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
          variant.stock = (variant.stock || 0) + detail.quantity;
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

const cancelReceipt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    // Tìm receipt cần hủy
    const receipt = await Receipt.findById(id);
    
    if (!receipt) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    if (receipt.status === 'Đã hủy') {
      return res.status(400).json({ message: "Phiếu nhập đã được hủy trước đó" });
    }

    const productUpdates = {};

    for (const detail of receipt.receiptDetails) {
      if (!productUpdates[detail.productId]) {
        productUpdates[detail.productId] = await Product.findById(detail.productId);
      }

      const product = productUpdates[detail.productId];

      if (product) {
        const variant = product.variants.find(v => v.sku === detail.productSku);

        if (variant) {
          if ((variant.stock || 0) < detail.quantity) {
            throw new Error('Không thể hủy nhập hàng do có sản phẩm không đủ tồn kho để hủy');
          }

          variant.stock = (variant.stock || 0) - detail.quantity;
        }
      }
    }

    // Lưu lại thông tin sản phẩm
    for (const productId in productUpdates) {
      await productUpdates[productId].save();
    }

    // Cập nhật trạng thái của receipt
    receipt.status = 'Đã hủy';
    await receipt.save();

    res.json({ 
      message: "Hủy phiếu nhập thành công",
      receipt: receipt 
    });

  } catch (error) {
    console.error('Lỗi hủy phiếu nhập:', error);
    res.status(500).json({ 
      message: "Có lỗi xảy ra khi hủy phiếu nhập",
      error: error.message 
    });
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
    const getallReceipt = await Receipt.find().sort({ createdAt: -1 }).populate('userId').populate('supplierId').populate('receiptDetails.productId');
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
  cancelReceipt,
};
