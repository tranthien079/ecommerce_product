import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { updatePaymentStatusApi,verifyEmailApi, forgotPasswordApi, changePasswordByTokenApi, updateUserInfoApi, registerApi, loginApi, getWishlistApi, addToCartApi, getCartApi, removeProductApi, updateProductApi, createOrderApi,getUserOrderApi, getOrderDetailApi, findUserApi, getUsersApi, updateOrderStatusApi, repaymentApi } from "../../api/user";
import { toast } from "react-toastify";
import { applyCouponApi } from "../../api/coupon";
const getCustomerFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : [];

const initialState = {
  user: getCustomerFromLocalStorage,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  userWishlist: [], 
  cartProduct: [], 
  cartUser: null, 
  deletedProduct: null, 
  updatedProduct: null, 
  createdOrder: null, 
  createdUser: null,
  orderUser: null,
  updatedUser: null,
};

export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const result = await registerApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const verifyEmail = createAsyncThunk("auth/verify", async (data, thunkAPI) => {
  try {
    const result = await verifyEmailApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const applyCoupon = createAsyncThunk("auth/checkout/applycoupon", async (data, thunkAPI) => {
  try {
    const result = await applyCouponApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const repaymentOrder = createAsyncThunk("auth/checkout/repayment", async (data, thunkAPI) => {
  try {
    const result = await repaymentApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const updateUserInfo = createAsyncThunk("auth/update-user", async (data, thunkAPI) => {
  try {
    const result = await updateUserInfoApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const result = await loginApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgot-password", async (data, thunkAPI) => {
  try {
    const result = await forgotPasswordApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const changePasswordToken = createAsyncThunk("auth/change-password-token", async (data, thunkAPI) => {
  try {
    const result = await changePasswordByTokenApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getUserWishlist = createAsyncThunk("auth/wishlist", async (thunkAPI) => {
  try {
    const result = await getWishlistApi();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getUserCart = createAsyncThunk("auth/get-cart", async (thunkAPI) => {
  try {
    const result = await getCartApi();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const addProductCart = createAsyncThunk("auth/add-cart", async (data, thunkAPI) => {
  try {
    const result = await addToCartApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const deleteProductCart = createAsyncThunk("auth/delete-cart", async (id, thunkAPI) => {
  try {
    const result = await removeProductApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const updateProductCart = createAsyncThunk("auth/update-cart", async ({ cartId, newQuantity }, thunkAPI) => {
  try {
    const result = await updateProductApi({ cartId, newQuantity });
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const createOrder = createAsyncThunk("auth/create-order", async (data, thunkAPI) => {
  try {
    const result = await createOrderApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const updatePaymentStatus = createAsyncThunk("auth/update-payment-status", async (data, thunkAPI) => {
  try {
    const result = await updatePaymentStatusApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const updateOrderStatus = createAsyncThunk("auth/update-order-status", async (data, thunkAPI) => {
  try {
    const result = await updateOrderStatusApi(data);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getUserOrder = createAsyncThunk("auth/get-order", async (thunkAPI) => {
  try {
    const result = await getUserOrderApi();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getOrderDetail = createAsyncThunk("auth/get-order-id", async (id, thunkAPI) => {
  try {
    const result = await getOrderDetailApi(id);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const findUser = createAsyncThunk("auth/find-user", async (userId, thunkAPI) => {
  try {
    const result = await findUserApi(userId);
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const getAllUsers = createAsyncThunk("auth/get-all-user", async (thunkAPI) => {
  try {
    const result = await getUsersApi();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.message);
  }
});

export const resetState = createAction('auth/resetState');

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logoutAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdUser = action.payload;
        // toast.success('Đăng ký thành công');

      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload));
        toast.success('Đăng nhập thành công');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(findUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.findedUser = action.payload;
      })
      .addCase(findUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.getAllUser = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.verifiedEmail = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getUserWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.userWishlist = action.payload;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(addProductCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProductCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.cartProduct = action.payload;
        toast.success("Thêm sản phẩm vào giỏ hàng thành công");
      })
      .addCase(addProductCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.cartUser = action.payload;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteProductCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProductCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.deletedProduct = action.payload;
        toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
      })
      .addCase(deleteProductCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateProductCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProductCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedProduct = action.payload;
        toast.success("Cập nhật số lượng sản phẩm thành công");
      })
      .addCase(updateProductCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdOrder = action.payload?.order;
        state.paymentResult = action.payload?.paymentResult;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.createdOrderOnline = action.payload?.order;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getUserOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.orderUser = action.payload;
        state.gotOrder = null;
      })
      .addCase(getUserOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.gotOrder = action.payload;
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.cancledOrder = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.appliedCoupon = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(repaymentOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(repaymentOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.paymentResult = action.payload?.paymentResult;
      })
      .addCase(repaymentOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.updatedUser = action.payload;
        let currentUser = JSON.parse(localStorage.getItem('user'))
          let newData = {
            _id: currentUser._id,
            token: currentUser.token,
            firstname: action?.payload?.firstname,
            lastname: action.payload?.lastname,
            mobile: action.payload?.mobile,
            email: action.payload?.email,
            address: action.payload?.address,
          }
          localStorage.setItem('user', JSON.stringify(newData))
          state.user = newData;
          toast.success("Cập nhật thông tin thành công");
        console.log(currentUser._id,newData)
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.token = action.payload;
        toast.success("Link đổi mật khẩu đã được gửi qua email của bạn!");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(changePasswordToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePasswordToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Đổi mật khẩu thành công!");

      })
      .addCase(changePasswordToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(resetState, () => initialState); 
  }
});

export default authSlice.reducer;
export const { logoutAuth } = authSlice.actions;

// import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
// import { registerApi, loginApi, getWishlistApi, addToCartApi, getCartApi, removeProductApi, updateProductApi, createOrderApi } from "../../api/user";
// import { toast } from "react-toastify";

// const getCustomerFromLocalStorage = localStorage.getItem("user")
//   ? JSON.parse(localStorage.getItem("user"))
//   : {};

// const initialState = {
//     user: getCustomerFromLocalStorage,
//     isError: false,
//     isLoading: false,
//     isSuccess: false,
//     message: "",
//   };
  
// export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
//   try {
//     const result = await registerApi(data);
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
//   try {
//     const result = await loginApi(data);
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const getUserWishlist = createAsyncThunk("auth/wishlist", async (thunkAPI) => {
//   try {
//     const result = await getWishlistApi();
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const getUserCart = createAsyncThunk("auth/get-cart", async (thunkAPI) => {
//   try {
//     const result = await getCartApi();
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const addProductCart = createAsyncThunk("auth/add-cart", async (data,thunkAPI) => {
//   try {
//     const result = await addToCartApi(data);
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const deleteProductCart = createAsyncThunk("auth/delete-cart", async (id,thunkAPI) => {
//   try {
//     const result = await removeProductApi(id);
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const updateProductCart = createAsyncThunk("auth/update-cart", async ({cartId, newQuantity},thunkAPI) => {
//   try {
//     const result = await updateProductApi({cartId, newQuantity});
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const createOrder = createAsyncThunk("auth/create-order", async (data,thunkAPI) => {
//   try {
//     const result = await createOrderApi(data);
//     return result;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error?.message);
//   }
// });

// export const resetState = createAction('Reset_all');


// export const authSlice = createSlice({
//   name: "auth",
//   initialState: initialState,
//   reducers: {
//     logoutAuth: (state, action) => {
//       state.user = {};
//       state.isAuthenticated = false;
//       localStorage.removeItem("token");
//     },
//   },
//   extraReducers: (builder) => {
//       builder
//         .addCase(register.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(register.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.createdUser = action.payload;
//           if(state.isSuccess === true) {
//             toast.success('Đăng ký thành công')
//           }
//         })
//         .addCase(register.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(login.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(login.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.user = action.payload;
//           if(state.isSuccess === true) {
//             localStorage.setItem("token", action.payload.token);
//             localStorage.setItem("user", JSON.stringify(action.payload));
//             toast.success('Đăng nhập thành công')
//           }
//         })
//         .addCase(login.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(getUserWishlist.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(getUserWishlist.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.userWishlist = action.payload;
//         })
//         .addCase(getUserWishlist.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(addProductCart.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(addProductCart.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.cartProduct = action.payload;
//           if(state.isSuccess == true ) {
//             toast.success("Thêm sản phẩm vào giỏ hàng thành công");
//           }
//         })
//         .addCase(addProductCart.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(getUserCart.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(getUserCart.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.cartUser = action.payload;
//         })
//         .addCase(getUserCart.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(deleteProductCart.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(deleteProductCart.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.deletedProduct = action.payload;
//           if(state.isSuccess == true ) {
//             toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
//           }
//         })
//         .addCase(deleteProductCart.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(updateProductCart.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(updateProductCart.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.updatedProduct = action.payload;
//           if(state.isSuccess == true ) {
//             toast.success("Cập nhật số lượng sản phẩm thành công");
//           }
//         })
//         .addCase(updateProductCart.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(createOrder.pending, (state) => {
//           state.isLoading = true;
//         })
//         .addCase(createOrder.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.isSuccess = true;
//           state.isError = false;
//           state.createdOrder = action.payload;
//           if(state.isSuccess == true ) {
//             toast.success("Đặt hàng thành công");
//           }
//         })
//         .addCase(createOrder.rejected, (state, action) => {
//           state.isLoading = false;
//           state.isError = true;
//           state.isSuccess = false;
//           state.message = action.error;
//         })
//         .addCase(resetState, () => cartUser);
//   }
// })

// export default authSlice.reducer;
// export const { logoutAuth } = authSlice.actions;
