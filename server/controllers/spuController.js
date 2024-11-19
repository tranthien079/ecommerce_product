const Product = require('../models/productModel');
const User = require('../models/userModel');
const Receipt = require('../models/receiptModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongodbId');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary');
const fs = require('fs');
const SkuController = require('./skuController');
const randomProductId = () => {
    return Math.floor(Math.random() * 89999 + 100000)
}

const createProduct = asyncHandler(async (req, res) => {
    try {
        const sku_list = req.body.sku_list || [];
        if(req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        const findProduct = await Product.findOne({name : req.body.name});
        if(findProduct) throw new Error('Sản phẩm đã tồn tại');
 
        const newProduct = await Product.create({
            product_id: randomProductId(),
            name: req.body.name,
            slug: req.body.slug,
            categoryId: req.body.categoryId,
            brandId: req.body.brandId,
            price: req.body.price,
            description: req.body.description,
            variants: req.body.variants
        });

        if(newProduct && sku_list.length) {
            SkuController.createSku({sku_list, spu_id: newProduct.product_id})
            .then()
        }
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const addVariants = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { variants } = req.body; 
    validateMongoDbId(id)

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
    const { id } = req.params
    validateMongoDbId(id)
    try {
        if(req.body.name) {
            req.body.slug = slugify(req.body.name);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
          const product = await Product.findById(id);
  
          for (const image of product.images) {
              await cloudinaryDeleteImg(image.public_id); 
          }
  
          const deleteProduct = await Product.findByIdAndDelete(id);
          res.json(deleteProduct);
    } catch (error) {
      throw new Error(error); 
    }
})

// const getProductById = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//         const findProduct = await Product.findById(id)
//         res.json(findProduct);
//     } catch (error) {
//         throw new Error(error);
//     }
// })

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        // Tìm sản phẩm dựa trên ID
        const product = await Product.findById(id);

        // Tìm tất cả receipts có liên quan đến productId này
        const receipts = await Receipt.find({
            'receiptDetails.productId': product._id
        });

        // Tính toán tồn kho cho từng biến thể dựa trên SKU
        const updatedVariants = product.variants.map(variant => {
            // Tính tổng stock cho biến thể này dựa trên SKU
            let totalStock = 0;

            receipts.forEach(receipt => {
                receipt.receiptDetails.forEach(detail => {
                    if (detail.productVariantSku === variant.sku) {
                        totalStock += detail.quantity;
                    }
                });
            });

            // Trả về biến thể cùng với tồn kho được tính toán
            return {
                ...variant.toObject(), // Chuyển đổi variant thành đối tượng (nếu cần)
                stock: totalStock // Thêm thuộc tính stock
            };
        });

        // Cập nhật product với variants mới đã có thuộc tính stock
        const productWithStock = {
            ...product.toObject(),
            variants: updatedVariants
        };

        // Trả về sản phẩm cùng với variants đã có tồn kho
        res.json(productWithStock);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filter
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'skip', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));
        
        // Sorting by bandid categoryid
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
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
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // Count documents without populate
        const productCount = await Product.countDocuments();

        if (skip >= productCount) throw new Error('Trang này không tồn tại!');

        // Execute query with populate
        const products = await query.populate('brandId').populate('categoryId');
        
        // res.json({
        //     success: true,
        //     page,
        //     limit,
        //     total: productCount,
        //     products,
        // });
        res.json(products);

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

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
        const alreadyAdded =  user.wishlist?.find((id) => id.toString() === productId);
        if(alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: productId }
            },
            { new: true }
            )
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: productId }
            },
            { new: true }
            )
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
})

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user; 
    const { star, productId, comment } = req.body; 

    try {
        const product = await Product.findById(productId);

        let alreadyRated = product.ratings.find(
            (rating) => rating.postedBy.toString() === _id.toString()
        );

        if (alreadyRated) {
            // If the user has already rated, update the existing rating
            await Product.updateOne(
                {
                    _id: productId,
                    "ratings._id": alreadyRated._id
                },
                {
                    $set: {
                        "ratings.$.star": star,
                        "ratings.$.comment": comment
                    }
                },
                { new: true }
            );
        } else {
            // If the user has not rated yet, add a new rating
            await Product.findByIdAndUpdate(
                productId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: _id
                        }
                    }
                },
                { new: true }
            );
        }

        // Recalculate the overall product rating
        const updatedProduct = await Product.findById(productId);
        let totalRating = updatedProduct.ratings.length;
        let ratingSum = updatedProduct.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRating);

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
    console.log(req.files)
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
module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    addVariants,
    rating,
    uploadImages
}