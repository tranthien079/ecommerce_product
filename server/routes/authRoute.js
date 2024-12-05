const express = require('express')
const router = express.Router()
const { checkStatusPayment, applyCoupon,getOrderById,getMyOrders, updateProductQuantity,removeProductCart, updateOrderStatus, createOrder, getUserCart, addUserCart, createAddressUser, getWishList, loginAdmin, verifyEmail, resetPassword, forgotPasswordToken, updatePassword, handleRefreshToken, unblockUser, blockUser, createUser, loginUser, getAllUsers, getUserById, deleteUser, updateUser, logOut, getAllOrder, getUsers, findUser, getUsersSale, updateMember, repayment } = require('../controllers/userController')
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware')
const {  uploadImages, deleteImages } = require('../controllers/uploadController');
const { createPaymentMomo, handleCallbackMomo, checkTransactionStatusMomo } = require('../controllers/paymentMomoController');
const sendMailContact = require('../controllers/contactController');
const { paymentPayOs } = require('../controllers/paymentPayOSController');
router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.post('/verify-email', verifyEmail) 
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleWare, updatePassword)
router.post('/admin-login', loginAdmin)

router.post('/cart', authMiddleWare, addUserCart)
router.delete('/delete-product-cart/:cartId', authMiddleWare, removeProductCart)
router.put('/update-product-cart/:cartId/:newQuantity', authMiddleWare, updateProductQuantity)
router.get('/cart', authMiddleWare, getUserCart)
router.post('/checkout/applycoupon', authMiddleWare, applyCoupon)
router.post('/repayment',authMiddleWare , repayment)
router.post('/cart/create-order', authMiddleWare, createOrder)
router.get('/checkout/payment-online/:orderId', authMiddleWare, checkStatusPayment)
router.get('/get-user-orders', authMiddleWare, getMyOrders)
router.get('/get-user-orders/:id', authMiddleWare, getOrderById)
router.get('/get-all-orders', authMiddleWare, getAllOrder)
router.put('/update-order/:id', authMiddleWare, updateOrderStatus)


// router.post('/payment-zalopay', createPaymentMomo);
// router.post('/payment-payos', paymentPayOs);

router.get('/find/:userId', findUser)
router.get('/get-all-user', getUsers)
router.get('/', getUsersSale)

router.post('/login', loginUser)
router.post('/send-mail', sendMailContact);
router.post('/save-address', authMiddleWare, createAddressUser)
router.post('/logout', logOut)
router.post('/refresh', handleRefreshToken)
router.get('/all-users', authMiddleWare, isAdmin, getAllUsers)
router.get('/wishlist', authMiddleWare, getWishList)
router.get('/:id', authMiddleWare, isAdmin, getUserById)
router.put('/edit-user', authMiddleWare, updateUser)
router.put('/block-user/:id', authMiddleWare, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleWare, isAdmin, unblockUser)
router.delete('/:id', deleteUser)
router.put('/update/:userId', authMiddleWare, updateMember)
module.exports = router
