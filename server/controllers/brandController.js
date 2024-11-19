const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Product = require("../models/productModel")
const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new Error("Không tìm thấy thương hiệu");
    }

    const productsUsingBrand = await Product.findOne({ brandId: id });
    
    if (productsUsingBrand) {
      throw new Error(
        "Xóa thương hiệu không thành công, vì tồn tại sản phẩm liên quan đến thương hiệu này"
      );
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Đã xóa thương hiệu thành công",
      deletedBrand,
    });

  } catch (error) {
    throw new Error(error.message || "Không thể xóa thương hiệu");
  }
});
const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.json(getaBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find().sort({ createdAt: -1 });
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getAllBrands,
};