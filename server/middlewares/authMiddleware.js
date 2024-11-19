const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleWare = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization && req?.headers?.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                    req.user = user;
                    next();
            }
        } catch (error) {
            throw new Error("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại")
        }
    }
    //  else {
    //     throw new Error('Vui lòng đăng nhập!')
    // }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email: email })
    if (adminUser?.role == 'user') {
        throw new Error("Bạn không có quyền truy cập vào trang này!")
    } else {
        next();
    }
})
module.exports = {
    authMiddleWare,
    isAdmin
};