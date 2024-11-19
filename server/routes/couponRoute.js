const express = require("express");
const { 
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupons,
} = require("../controllers/couponController");
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/create", authMiddleWare, isAdmin, createCoupon);
router.put("/:id", authMiddleWare, isAdmin, updateCoupon);
router.delete("/:id", authMiddleWare, isAdmin, deleteCoupon);
router.get("/:id", getCouponById);
router.get("/", getAllCoupons);

module.exports = router;