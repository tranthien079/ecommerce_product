const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const shipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model("Shipping", shipSchema);