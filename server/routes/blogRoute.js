const express = require('express')
const router = express.Router()

const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require('../controllers/blogController')
const {  uploadPhoto } = require("../middlewares/uploadImages");
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');

router.post('/create', authMiddleWare, isAdmin, createBlog)
router.put('/upload/:id', authMiddleWare, isAdmin, uploadPhoto.array("images", 4), uploadImages);
router.put('/:id', authMiddleWare, isAdmin, updateBlog)
router.post('/likes', authMiddleWare, likeBlog)
router.post('/dislikes', authMiddleWare, dislikeBlog)
router.delete('/:id', authMiddleWare, isAdmin, deleteBlog)
router.get('/:id', getBlogById)
router.get('/', getAllBlogs)



module.exports = router