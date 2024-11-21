const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const PendingOrder = require("../models/pendingOrderModel");
const uniqid = require("uniqid");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendMail = require("./emailController");
const crypto = require("crypto");
const {
  createPaymentMomo,
  checkTransactionStatusMomo,
} = require("./paymentMomoController");
const { paymentPayOs } = require("./paymentPayOSController");

// Hàm tạo người dùng mới
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  // const mobile = req.body.mobile;
  const findUserEmail = await User.findOne({ email: email });
  // const findUserMobile = await User.findOne({ mobile: mobile });
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  if (!findUserEmail) {
    //Tạo người dùng mới nếu đã có email không tồn tại
    const newUser = await User.create({
      ...req.body, 
      verificationToken, 
      verificationTokenExpires: Date.now() + 30 * 60 * 1000, // Set the expiration time to 30 hours from now
    });
    const from = "Xác thực email";
    const resetURL = `Hi, Bạn vui lòng nhập mã token: ${verificationToken} này vào để xác thực email. Thời gian hiệu lực 30 phút từ lúc nhận email này. <a href='${process.env.CLIENT_URL}/verify-email'>Nhấp vào đây!</a>`;
    const data = {
      from: from,
      to: email,
      text: "Hello!",
      subject: "Xác thực email",
      html: resetURL,
    };
    sendMail(data);
    res.json(newUser);
  } else {
    throw new Error("Email đã tồn tại!");
  }
});

// Hàm đăng đăng nhập
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email, isActive: true });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    //Tạo token JWT
    res.json({
      _id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      avatar: findUser.avatar,
      address: findUser?.address,
      role: findUser.role,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Nhập sai email hoặc mật khẩu hoặc bị khóa");
  }
});

// Hàm đăng đăng nhập
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email: email, isActive: true });

  if (findAdmin?.role == "user") throw new Error("Bạn không có quyền truy cập trang này!");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    //Tạo token JWT
    res.json({
      _id: findAdmin._id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      avatar: findAdmin.avatar,
      role: findAdmin.role,
      // password: findAdmin.password,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Nhập sai email hoặc mật khẩu");
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(400).json({ message: "Token không tồn tại!" });
  }

  const refreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({ message: "RefreshToken không hợp lệ!" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err && user._id !== decoded._id) {
      return res.status(403).json({ message: "RefreshToken không hợp lệ!" });
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

const logOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(400).json({ message: "Token không tồn tại!" });
  }

  const refreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken });

  if (user) {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    // Clear the cookie from the client's browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None", // if you are using cross-site cookies
    });

    return res.status(204).send();
  } else {
    return res
      .status(403)
      .json({ message: "User not found or already logged out!" });
  }
};

// Hàm lấy thông tin tất cả người dùng trừ password
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().select("-password");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Hàm lấy thông tin theo id của người dùng trừ password
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getUser = await User.findById(id).select("-password");
    res.json({
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});
// Hàm cập nhật thông tin người dùng
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const { firstname, lastname, email, mobile, address, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname,
        lastname,
        email,
        mobile,
        address,
        avatar,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

const updateMember = asyncHandler(async (req, res) => {
  const { userId } = req.params
  validateMongoDbId(userId)
  try {
      const updatedMember = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.json(updatedMember);
  } catch (error) {
      
  }
})

// Hàm xóa người dùng
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const block = await User.findById(id);

    block.isActive = !block.isActive;

    await block.save();

    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

// Hàm mở khóa người dùng
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isActive: true,
      },
      {
        new: true,
      }
    );
    console.log(unblock)

    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});
// Hàm cập nhật password nếu đã đang nhập rồi
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { password } = req.body;
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});
// Hàm quên mật khẩu sử dụng email trả về token để xác nhận
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Người dùng không tồn tại!");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const from = "Link quên mật khẩu";
    const resetURL = `Hi, Bạn vui lòng nhấp vào link này để đồng ý với thay đổi mật khẩu của bạn. Thời gian hiệu lực 30 phút từ lúc nhận email này. <a href='${process.env.CLIENT_URL}/reset-password/${token}'>Nhấp vào đây!</a>`;
    const data = {
      from: from,
      to: email,
      text: "Hello!",
      subject: "Link quên mật khẩu",
      html: resetURL,
    };
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// Hàm reset password gửi về email sau đó qua trang đổi mật khẩu
const resetPassword = asyncHandler(async (req, res) => {
  const password = req.body.password;
  const { token } = req.params;
  console.log(token);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token hợp lệ hoặc đã hết hạn!");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// Hàm xử lý khi đã nhập token dùng xác minh tài khoản kích hoạt email....
const verifyEmail =asyncHandler( async (req, res) => {
  const { code } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Code không tồn tại hoặc đã hết hạn!");
    }
    user.isActive = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const getWishListOfUser = await User.findById(_id).populate("wishlist");
    res.json(getWishListOfUser);
  } catch (error) {
    throw new Error(error);
  }
});

const createAddressUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );

    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});

const addUserCart = asyncHandler(async (req, res) => {
  const { productId, sku, color, size, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const product = await Product.findById(productId);
    const variant = product.variants.find((v) => v.sku === sku);

    if (quantity > variant.stock) {
      throw new Error("Số lượng sản phẩm vượt quá tồn kho");
    }

    let existingCartItem = await Cart.findOne({
      userId: _id,
      productId: productId,
      sku: sku,
    });

    if (existingCartItem) {
      const newQuantity = Number(existingCartItem.quantity) + Number(quantity);
      if (newQuantity > variant.stock) {
        throw new Error("Số lượng sản phẩm vượt quá tồn kho");
      }
      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();
      res.json(existingCartItem);
    } else {
      let newCartItem = await new Cart({
        userId: _id,
        productId,
        sku,
        color,
        size,
        quantity,
        price,
      }).save();

      res.json(newCartItem);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const removeProductCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { cartId } = req.params;
  try {
    const deleteProductCart = await Cart.deleteOne({
      userId: _id,
      _id: cartId,
    });
    res.json(deleteProductCart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductQuantity = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { cartId, newQuantity } = req.params;
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartId });

    const product = await Product.findById(cartItem.productId);

    const variant = product.variants.find((v) => v.sku === cartItem.sku);
    if (!variant) {
      throw new Error("Không tìm thấy biến thể sản phẩm");
    }

    if (newQuantity > variant.stock) {
      throw new Error("Số lượng sản phẩm vượt quá tồn kho");
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const userCart = await Cart.find({ userId: _id }).populate("productId");
    res.json(userCart);
  } catch (error) {
    throw new Error(error);
  }
});

const repayment = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { id, paymentInfo, totalPrice } = req.body;
  
  if (paymentInfo === "momo") {
    const paymentResult = await createPaymentMomo(totalPrice);
    
    if (paymentResult?.resultCode === 0) {
      const order = await Order.findByIdAndUpdate(
        id, 
        { paymentInfo: "momo", paymentOrderId: paymentResult.orderId }, 
        { new: true }
      );
      
      return res.json({ paymentResult });
    }
  }
  
  if (paymentInfo === "payos") {
    const paymentResult = await paymentPayOs(totalPrice);
    
    const order = await Order.findByIdAndUpdate(
      id, 
      { paymentInfo: "payos", paymentOrderId: paymentResult.orderCode }, 
      { new: true }
    );
    
    return res.json({ paymentResult });
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const {
    shippingInfo,
    couponId,
    orderItems,
    totalPrice,
    paymentInfo,
    typeDelivery,
  } = req.body;

  try {
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }

      const variantIndex = product.variants.findIndex(
        (v) => v.sku === item.sku
      );

      if (variantIndex === -1) {
        throw new Error(
          `Không tìm thấy phiên bản với SKU ${item.sku} của sản phẩm ${product.title}`
        );
      }

      const variant = product.variants[variantIndex];

      if (variant.stock < item.quantity) {
        throw new Error(
          `Phiên bản size ${item.size}, màu ${item.color} của sản phẩm ${product.title} chỉ còn ${variant.stock} sản phẩm`
        );
      }

      product.variants[variantIndex].stock -= item.quantity;
      product.sold += item.quantity;

      await product.save();
    }

    if (paymentInfo === "momo") {
      const paymentResult = await createPaymentMomo(totalPrice);

      if (paymentResult?.resultCode === 0) {
        const order = await Order.create({
          userId: _id,
          shippingInfo,
          couponId,
          orderItems,
          totalPrice,
          paymentInfo,
          typeDelivery,
          paymentOrderId: paymentResult.orderId, 
        });

        if (order) {
          await Cart.deleteMany({ userId: _id });
        }

        return res.json({ paymentResult });
      } 
    } else if(paymentInfo === "payos") {

      const paymentResult = await paymentPayOs(totalPrice);

      const order = await Order.create({
        userId: _id,
        shippingInfo,
        couponId,
        orderItems,
        totalPrice,
        paymentInfo,
        typeDelivery,
        paymentOrderId: paymentResult.orderCode, 
      });

      if (order) {
        await Cart.deleteMany({ userId: _id });
      }

      return res.json({ paymentResult });
    } else {
      const order = await Order.create({
        userId: _id,
        shippingInfo,
        couponId,
        orderItems,
        totalPrice,
        paymentInfo,
        typeDelivery,
        paymentStatus: "Chưa thanh toán",
      });

      if (order) {
        await Cart.deleteMany({ userId: _id });
      }

      return res.json(order);
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const checkStatusPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params; 
  console.log(orderId)
  try {
    // Check trạng thái thanh toán momo
    const checkStatus = await checkTransactionStatusMomo({orderId});
    const pendingOrder = await Order.findOne({ paymentOrderId:orderId });
    if(pendingOrder) {
      if (checkStatus.resultCode === 0) {

        const order = await Order.updateOne(
          { paymentOrderId: orderId }, 
          { paymentStatus: "Đã thanh toán" } 
        );
  
        return res.json(order);
      } else {
  
        const order = await Order.updateOne(
          { paymentOrderId: orderId }, 
          { paymentStatus: "Đã thanh toán" } 
        );
  
        return res.json(order);
      }
    } else {
      return res.json({ message: "Đơn hàng không tồn tại hoặc đã thanh toán" });
    }
   
  } catch (error) {
    throw new Error(error.message);
  }
});



// const finalizeOrder = asyncHandler(async (req, res) => {
//   const { orderId } = req.params; 
//   console.log(orderId)
//   try {
//     // Check trạng thái thanh toán momo
//     const checkStatus = await checkTransactionStatusMomo({orderId});
//     if (checkStatus.resultCode === 0) {
//       const pendingOrder = await PendingOrder.findOne({ paymentOrderId:orderId });

//       const order = await Order.create({
//         userId: pendingOrder.userId,
//         shippingInfo: pendingOrder.shippingInfo,
//         orderItems: pendingOrder.orderItems,
//         totalPrice: pendingOrder.totalPrice,
//         paymentInfo: pendingOrder.paymentInfo,
//         typeDelivery: pendingOrder.typeDelivery,
//         paymentStatus: "Đã thanh toán",
//       });

//       if (order) {
//         await Cart.deleteMany({ userId: pendingOrder.userId });
//         await PendingOrder.deleteMany({ userId: pendingOrder.userId });
//       }

//       return res.json(order);
//     } 
//   } catch (error) {
//     throw new Error(error.message);
//   }
// });

// const deleteOrderPending = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const deleteOrderPending = await PendingOrder.deleteMany({ userId: _id });
//   return res.json(deleteOrderPending);
// })

const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ userId: _id })
      .populate("orderItems.productId")
      .populate("userId")
      .populate("typeDelivery");
    res.json(orders);
  } catch (error) {
    throw new Error(error);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const userOrder = await Order.findById(id)
      .populate("orderItems.productId")
      .populate("userId")
      .populate("typeDelivery");
    res.json(userOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const allOrder = await Order.find()
      .populate("orderItems.productId")
      .populate("userId")
      .populate("employeeId")
      .populate("typeDelivery")
      .sort({ createdAt: -1 });
    res.json(allOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  
  validateMongoDbId(_id);

  const validCoupon = await Coupon.findOne({ name: coupon });

  if (!validCoupon) {
    throw new Error("Coupon không hợp lệ!");
  }

  const currentDate = new Date();
  const expiryDate = new Date(validCoupon.expiry);

  if (expiryDate < currentDate || expiryDate.toDateString() === currentDate.toDateString()) {
    throw new Error("Mã giảm giá đã hết hạn!");
  }

  const user = await User.findById(_id);

  const alreadyUsed = user.usedCoupons.includes(validCoupon._id);
  if (alreadyUsed) {
    throw new Error("Bạn đã sử dụng mã giảm giá này rồi!");
  }

  if (validCoupon.quantity <= 0) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng!");
  }

  validCoupon.quantity -= 1;
  validCoupon.usedQuanity += 1;
  await validCoupon.save();

  user.usedCoupons.push(validCoupon._id);
  await user.save();

  return res.json(validCoupon);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const { _id } = req.user;
  validateMongoDbId(id);

  try {
    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (currentOrder.orderStatus === "Đã hủy") {
      throw new Error("Đơn hàng đã được hủy trước đó");
    }

    const updateData = { orderStatus: status, employeeId: _id };

    if (status === 'Hoàn thành') {
      updateData.paymentStatus = 'Đã thanh toán';
    }

    if (status === "Đã hủy") {
      for (const item of currentOrder.orderItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          const variantIndex = product.variants.findIndex(
            (v) => v.sku === item.sku
          );

          if (variantIndex !== -1) {
            product.variants[variantIndex].stock += item.quantity;
            product.sold -= item.quantity;

            await product.save();
          }
        }
      }

      if (currentOrder.paymentStatus === "Đã thanh toán") {
        updateData.paymentStatus = "Chờ hoàn tiền";
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedOrder);

  } catch (error) {
    throw new Error(error.message || "Failed to update order status");
  }
});

const findUser = async (req, res) => {
  const userId = req.params.userId;
try {
  let user = await User.findById(userId).select('-password');
  if (!user) return res.status(400).json("Người dùng không tồn tại.");
  res.status(200).json(user);
} catch (error) {
  res.status(500).json(error);
}
};

// const getUsers = async (req, res) => {
// try {
//   let user = await User.find().select('-password');
//   res.status(200).json(user);
// } catch (error) {
//   res.status(500).json(error);
// }
// };

const getUsers = async (req, res) => {
  try {
    let user = await User.find({ role: { $ne: 'user' } }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUsersSale = async (req, res) => {
  try {
    let user = await User.find({ role: 'sale' }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  verifyEmail,
  loginAdmin,
  getWishList,
  createAddressUser,
  addUserCart,
  updateProductQuantity,
  removeProductCart,
  getUserCart,
  applyCoupon,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrder,
  updateOrderStatus,
  checkStatusPayment,
  findUser,
  getUsers,
  getUsersSale,
  updateMember,
  repayment
};
