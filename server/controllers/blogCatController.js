const BlogCategory = require('../models/blogCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const Blog = require('../models/blogModel');

const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newBlogCategory = await BlogCategory.create(req.body);
        res.json(newBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedBlogCategory);
    } catch (error) {
        
    }
})

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
  
    try {
      const category = await BlogCategory.findById(id);
      if (!category) {
        throw new Error("Không tìm thấy danh mục blog");
      }
  
      const blogsUsingCategory = await Blog.findOne({ categoryId: id });
      
      if (blogsUsingCategory) {
        throw new Error(
          "Xóa chủ đề không thành công, vì tồn tại bài viết liên quan đến chủ đề này"
        );
      }
  
      // Nếu không có blog nào sử dụng, tiến hành xóa category
      const deletedBlogCategory = await BlogCategory.findByIdAndDelete(id);
      res.json({
        success: true,
        message: "Đã xóa danh mục blog thành công",
        deletedBlogCategory,
      });
  
    } catch (error) {
      throw new Error(error.message || "Không thể xóa danh mục blog");
    }
  });

const getBlogCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
  
    try {
        const findBlogCategory = await BlogCategory.findById(id);
     
        res.json(findBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
})

const getAllBlogCategories = asyncHandler(async (req, res) => {
    try {
        const getAllBlogCategories = await BlogCategory.find().sort({createdAt: -1});
        res.json(getAllBlogCategories);
    } catch (error) {
        throw new Error(error);
    }
})


module.exports = {
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getBlogCategoryById,
    getAllBlogCategories,

}