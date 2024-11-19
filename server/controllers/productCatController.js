const ProductCategory = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const Product = require("../models/productModel")

const createProductCategory = asyncHandler(async (req, res) => {
    try {
        const newProductCategory = await ProductCategory.create(req.body);
        res.json(newProductCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const updateProductCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedProductCategory = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProductCategory);
    } catch (error) {
        
    }
})

const deleteProductCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      // Kiểm tra xem category có tồn tại không
      const category = await ProductCategory.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục sản phẩm");
      }
  
      const productsUsingCategory = await Product.findOne({ categoryId: id });
      
      if (productsUsingCategory) {
        throw new Error(
          "Xóa danh mục sản phẩm không thành công, vì tồn tại sản phẩm liên quan đến danh mục sản phẩm này"
        );
      }
      // Kiểm tra xem có danh mục con không
    //   const hasChildCategories = await ProductCategory.findOne({ parent: id });
  
    //   if (hasChildCategories) {
    //     throw new Error(
    //       "Không thể xóa danh mục này vì đang có danh mục con. Vui lòng xóa các danh mục con trước."
    //     );
    //   }
  
      // Nếu không có sản phẩm và danh mục con nào, tiến hành xóa category
      const deletedCategory = await ProductCategory.findByIdAndDelete(id);
      res.json({
        success: true,
        message: "Đã xóa danh mục sản phẩm thành công",
        deletedCategory,
      });
  
    } catch (error) {
      throw new Error(error.message || "Không thể xóa danh mục sản phẩm");
    }
  });

const getProductCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
  
    try {
        const findProductCategory = await ProductCategory.findById(id);
     
        res.json(findProductCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllProductCategories = asyncHandler(async (req, res) => {
    try {
        const getProductCategories = await ProductCategory.find().sort({ createdAt: -1 });
        res.json(getProductCategories);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getProductCategoryById,
    getAllProductCategories,

}