const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  usedQuanity: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);