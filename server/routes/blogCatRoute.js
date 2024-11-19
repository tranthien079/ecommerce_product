const express = require('express')
const router = express.Router()
const { createBlogCategory, getAllBlogCategories, getBlogCategoryById, updateBlogCategory, deleteBlogCategory } = require('../controllers/blogCatController')
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware')

router.post('/create', authMiddleWare, isAdmin, createBlogCategory)
router.put('/:id', authMiddleWare, isAdmin, updateBlogCategory )
router.delete('/:id', authMiddleWare, isAdmin, deleteBlogCategory)
router.get('/:id', getBlogCategoryById )
router.get('/', getAllBlogCategories)


module.exports = router