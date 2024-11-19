const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandById,
  getAllBrands,
} = require("../controllers/brandController");
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/create", authMiddleWare, isAdmin, createBrand);
router.put("/:id", authMiddleWare, isAdmin, updateBrand);
router.delete("/:id", authMiddleWare, isAdmin, deleteBrand);
router.get("/:id", getBrandById);
router.get("/", getAllBrands);

module.exports = router;