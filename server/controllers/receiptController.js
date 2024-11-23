const Receipt = require("../models/receiptModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Product = require("../models/productModel");

const createReceipt = asyncHandler(async (req, res) => {
  try {
    const newReceipt = await Receipt.create(req.body);

    const productUpdates = {};

    for (const detail of newReceipt.receiptDetails) {
      if (!productUpdates[detail.productId]) {
        productUpdates[detail.productId] = await Product.findById(detail.productId);
      }

      const product = productUpdates[detail.productId];

      if (product) {
        const variant = product.variants.find(v => v.sku === detail.productSku);

        if (variant) {
          variant.stock = detail.quantity;
          console.log(variant.stock, detail.quantity)
        }
      }
    }

    for (const productId in productUpdates) {
      await productUpdates[productId].save();
    }

    res.json(newReceipt);
  } catch (error) {
    throw new Error(error);
  }
});


const updateReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  const data = {...req.body, userId: _id}
  validateMongoDbId(id);
  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(id, data, {
      new: true,
    });
    // for (const detail of updatedReceipt.receiptDetails) {
    //   const product = await Product.findById(detail.productId);
    //   if (product) {
    //     const variant = product.variants.find(v => v.sku === detail.productSku);
    //     if (variant) {
    //       const oldDetail = await Receipt.findById(id).select('receiptDetails');
    //       const oldQuantity = oldDetail.receiptDetails.find(d => d.productId.toString() === detail.productId.toString() && d.productSku === detail.productSku)?.quantity || 0;
    //       const quantityDifference = detail.quantity - oldQuantity;
          
    //       variant.stock += quantityDifference;
    //       await product.save();
    //     }
    //   }
    // }
    res.json(updatedReceipt);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedReceipt = await Receipt.findByIdAndDelete(id);
    res.json(deletedReceipt);
  } catch (error) {
    throw new Error(error);
  }
});
const getReceiptById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaReceipt = await Receipt.findById(id).populate('receiptDetails.productId', 'name');
    res.json(getaReceipt);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllReceipts = asyncHandler(async (req, res) => {
  try {
    const getallReceipt = await Receipt.find().sort({ expiry: 1 }).populate('userId').populate('supplierId').populate('receiptDetails.productId');
    res.json(getallReceipt);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createReceipt,
  updateReceipt,
  deleteReceipt,
  getReceiptById,
  getAllReceipts,
};
