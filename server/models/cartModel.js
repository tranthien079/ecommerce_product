const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    sku: {
      type: String,
      // required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
        required: true,
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
// const mongoose = require("mongoose"); // Erase if already required

// // Declare the Schema of the Mongo model
// const cartSchema = new mongoose.Schema(
//   {
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//             },
//             variant: {
//                 size: String,
//                 color: String,
//                 sku: String, // referencing the SKU from the product's variant
//             },
//             quantity: {
//                 type: Number,
//                 min: 1
//             },
//             price: {
//                 type: Number,
//             }
//         }
//     ],
//     cartTotal: Number,
//     totalAfterDiscount: Number,
//     orderBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// //Export the model
// module.exports = mongoose.model("Cart", cartSchema);