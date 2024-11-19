const express = require('express')
const router = express.Router()
const { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory } = require('../controllers/productCatController')
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware')

router.post('/create', authMiddleWare, isAdmin, createProductCategory)
router.put('/:id', authMiddleWare, isAdmin, updateProductCategory )
router.delete('/:id', authMiddleWare, isAdmin, deleteProductCategory)
router.get('/:id', getProductCategoryById )
router.get('/', getAllProductCategories)


module.exports = router