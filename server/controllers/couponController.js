const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Order = require("../models/orderModel");
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw new Error("Không tìm thấy mã giảm giá");
    }

    const ordersUsingCoupon = await Order.findOne({ couponId: id });
    
    if (ordersUsingCoupon) {
      throw new Error(
        "Xóa mã giảm giá không thành công, vì tồn tại đơn hàng liên quan đến mã giảm giá này"
      );
    }

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Đã xóa mã giảm giá thành công",
      deletedCoupon,
    });

  } catch (error) {
    throw new Error(error.message || "Không thể xóa mã giảm giá");
  }
});

const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaCoupon = await Coupon.findById(id);
    res.json(getaCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const getallCoupon = await Coupon.find().sort({ expiry: 1 });
    res.json(getallCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupons,
};