const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model("Supplier", supplierSchema);