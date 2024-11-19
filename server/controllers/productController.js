const Product = require("../models/productModel");
const User = require("../models/userModel");
const Receipt = require("../models/receiptModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const Order =  require("../models/orderModel");
const mongoose = require('mongoose');
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const findProduct = await Product.findOne({ name: req.body.name });
    if (findProduct) throw new Error("Sản phẩm đã tồn tại");

    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const addVariants = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { variants } = req.body;
  validateMongoDbId(id);

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $push: { variants: { $each: variants } } },
      { new: true, runValidators: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id)
  validateMongoDbId(id);
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const receiptWithProduct = await Receipt.findOne({
      'receiptDetails.productId': id
    });

    if (receiptWithProduct) {
      throw new Error(
        "Xóa sản phẩm không thành công, vì tồn tại nhập hàng liên quan đến sản phẩm này"
      );
    }

    const product = await Product.findById(id);

    for (const image of product.images) {
      await cloudinaryDeleteImg(image.public_id);
    }

    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// const getProductById = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const findProduct = await Product.findById(id)
//         res.json(findProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// })
const getSkuProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { size, color } = req.query;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);
    const variant = product.variants.find(
      (variant) => variant.size === size && variant.color === color
    );
    return res.json({
      sku: variant.sku,
      stock: variant.stock,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Tìm sản phẩm dựa trên ID
    const productWithStock = await Product.findById(id)
      .populate("brandId")
      .populate("categoryId")
      .populate("ratings.postedBy");
    const sizes = [
      ...new Set(productWithStock.variants.map((variant) => variant.size)),
    ];
    const colors = [
      ...new Set(productWithStock.variants.map((variant) => variant.color)),
    ];
    const colorsCode =  [
      ...new Set(productWithStock.variants.map((variant) => variant.colorCode)),
    ];

    res.json({ productWithStock, sizes, colors, colorsCode });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Filter
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "skip", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    // Sorting by brandId and categoryId
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limit the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    // const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Count documents without populate
    const productCount = await Product.countDocuments();

    if (skip >= productCount) throw new Error("Trang này không tồn tại!");

    // Calculate total pages
    const totalPages = Math.ceil(productCount / limit);
    
    // Execute query with populate
    const products = await query.populate("brandId").populate("categoryId");

    res.json({
      success: true,
      page,
      limit,
      totalProducts: productCount,
      totalPages,
      products,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

const searchProducts =  asyncHandler(async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const products = await Product.find({ 
        name: { $regex: name, $options: 'i' } 
      });
      res.json(products);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
})

// const getAllProducts = asyncHandler(async (req, res) => {

//     try {
//         // Filter
//         const queryObj = { ...req.query };
//         const excludeFields = ['page','sort', 'limit','skip', 'fields'];
//         excludeFields.forEach(el => delete queryObj[el]);

//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//         let query = Product.find(JSON.parse(queryStr));

//         // Sorting by bandid categoryid
//         if(req.query.sort) {
//             const sortBy = req.query.sort.split(',').join(' ');
//             query = query.sort(sortBy)
//         } else {
//             query= query.sort('-createdAt')
//         }

//         //Limit the fields
//         if (req.query.fields) {
//             const fields = req.query.fields.split(",").join(" ");
//             query = query.select(fields);
//           } else {
//             query = query.select("-__v");
//         }

//         // pagination
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);
//         const skip = (page - 1) * limit;
//         query = query.skip(skip).limit(limit);
//         if(req.query.page) {
//             const productCount = await Product.countDocuments().populate('brandId').populate('categoryId');
//             if(skip >= productCount) throw new Error('Trang này không tồn tại!')
//          }

//         const product = await query
//         res.json(product);
//     } catch (error) {
//         throw new Error(error);
//     }
// })

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist?.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const isShowReview = asyncHandler(async (req, res) => {
  const { productId, commentId } = req.params;
  try {
    const product = await Product.findById(productId);

    const rating = product.ratings.id(commentId);

    rating.isShow = !rating.isShow;

    await product.save();

    res.json(rating);
  } catch (error) {
    throw new Error(error);
  }
});

const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const analyzeSentiment = (comment) => {
    const result = sentiment.analyze(comment);
    return result.score; // trả về điểm cảm xúc
};

// const getProductReviews = asyncHandler(async (req, res) => {
//     try {
//         const products = await Product.find({}, 'name ratings').populate('ratings.postedBy');

//         const allReviews = [];
//         let totalRatings = 0;
//         let totalComments = 0;

//         // Tính toán các đánh giá và phân tích
//         products.forEach(product => {
//             product.ratings.forEach(rating => {
//                 if (rating) {
//                     const sentimentScore = analyzeSentiment(rating.comment);

//                     allReviews.push({
//                         userId: rating.postedBy,
//                         productId: product._id,
//                         productName: product.name,
//                         star: rating.star,
//                         comment: rating.comment,
//                         sentimentScore, // thêm điểm cảm xúc
//                         commentId: rating._id,
//                         isShow: rating.isShow,
//                         postedBy: rating.postedBy ? rating.postedBy.name : 'Ẩn danh',
//                         createdAt: rating.createdAt
//                     });

//                     // Cộng dồn số sao và số bình luận
//                     totalRatings += rating.star;
//                     totalComments++;
//                 }
//             });
//         });

//         // Tính trung bình số sao
//         const averageStar = totalComments > 0 ? (totalRatings / totalComments).toFixed(2) : 0;

//         // Tạo các thống kê đánh giá
//         const reviewStats = {
//             totalReviews: allReviews.length,
//             totalComments,
//             averageStar,
//             positiveReviews: allReviews.filter(review => review.star >= 4).length,
//             negativeReviews: allReviews.filter(review => review.star < 4).length,
//         };

//         res.status(200).json({ reviews: allReviews, stats: reviewStats });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


const getProductReviews = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}, 'name ratings').populate('ratings.postedBy');

        const allReviews = [];
        products.forEach(product => {
            product.ratings.forEach(rating => {
                if (rating) {
                    allReviews.push({
                        userId: rating.postedBy,
                        productId: product._id,
                        productName: product.name,
                        star: rating.star,
                        comment: rating.comment,
                        commentId: rating._id,
                        isShow: rating.isShow,
                        postedBy: rating.postedBy ? rating.postedBy.name : 'Ẩn danh',
                        createdAt: rating.createdAt,
                    });
                }
            });
        });

        res.status(200).json(allReviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, productId, comment } = req.body;

  try {
    // Verify user is logged in
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new Error("Vui lòng đăng nhập để đánh giá");
    }

    const hasPurchased = await Order.exists({
      userId: _id,
      "orderItems.productId": productId,
      orderStatus: "Hoàn thành"  
    });
    if (!hasPurchased) {
      throw new Error("Bạn cần mua sản phẩm này trước khi đánh giá");
    }

    await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedBy: _id,
          },
        },
      },
      { new: true }
    );

    // Recalculate the overall product rating
    const updatedProduct = await Product.findById(productId);
    const totalRating = updatedProduct.ratings.length;
    const ratingSum = updatedProduct.ratings.reduce((sum, item) => sum + item.star, 0);
    const actualRating = Math.round(ratingSum / totalRating);

    // Update the product's overall rating
    const finalProduct = await Product.findByIdAndUpdate(
      productId,
      { totalrating: actualRating },
      { new: true }
    );

    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  console.log(req.files);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  try {
    const { categoryId, productId } = req.params;

    const relatedProducts = await Product.aggregate([
      { $match: { 
          categoryId: new mongoose.Types.ObjectId(categoryId), 
          _id: { $ne: new mongoose.Types.ObjectId(productId) },
        } 
      },
      { $sample: { size: 6 } }
    ]);

    return res.json(relatedProducts);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  addVariants,
  rating,
  uploadImages,
  getSkuProduct,
  getProductReviews,
  isShowReview,
  getRelatedProducts,
  searchProducts
};
