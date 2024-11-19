const express = require('express')
const router = express.Router()
const { createProduct, getSkuProduct, getProductById, deleteProduct, getAllProducts, updateProduct, addToWishList,rating, addVariants, uploadImages, isShowReview, getProductReviews, getRelatedProducts, searchProducts } = require('../controllers/productController')
// const { createProduct } = require('../controllers/spuController')

const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware')
const {  uploadPhoto } = require("../middlewares/uploadImages");

router.post('/create', createProduct)
router.put('/upload/:id', authMiddleWare, isAdmin, uploadPhoto.array("images", 8), uploadImages);
router.get('/:id/get-sku', getSkuProduct);
router.put('/wishlist', authMiddleWare, addToWishList)
router.put('/rating', authMiddleWare, rating)
router.put('/show-review/:productId/:commentId', authMiddleWare, isShowReview)
router.get('/get-review', authMiddleWare, getProductReviews)
router.get('/search', searchProducts)
router.get('/related/:productId/:categoryId', getRelatedProducts)
router.patch('/:id', authMiddleWare, isAdmin, updateProduct)
router.delete('/:id', authMiddleWare, isAdmin, deleteProduct)
router.get('/:id', getProductById)
router.get('/', getAllProducts)



module.exports = router