const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
        index: true,
      },
    description: {
      type: String,
      required: false,
      default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);

