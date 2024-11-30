const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const receiptSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    supplierId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },
    importDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: ''
    },
    receiptDetails: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', 
                required: true
            },
            productSku: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Receipt', receiptSchema);
