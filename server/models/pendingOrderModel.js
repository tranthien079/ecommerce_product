const mongoose = require('mongoose');
// const { create } = require('./userModel');

const pendingOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    shippingInfo: {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true, 
        },
        mobile: { 
            type: String, 
            required: true,
        }
    },
    paymentInfo: {
        type: String,
        required: true,
    },
    orderItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            color: {
                type: String,
                required: true,
            },
            size: {
                type: String,
                required: true,
            },
            sku: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,    
            }
        }
    ],
    paidAt: {
        type: Date,
        default: Date.now()
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'],
        default: 'Chờ xác nhận'
    },
    typeDelivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipping',
    },
    paymentOrderId: {
        type: String,
    }

}, { timestamps: true });

module.exports = mongoose.model('PendingOrder', pendingOrderSchema);
