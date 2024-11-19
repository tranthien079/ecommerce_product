const express = require("express");
const { 
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
} = require("../controllers/supplierController");
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/create", authMiddleWare, isAdmin, createSupplier);
router.put("/:id", authMiddleWare, isAdmin, updateSupplier);
router.delete("/:id", authMiddleWare, isAdmin, deleteSupplier);
router.get("/:id", getSupplierById);
router.get("/", getAllSuppliers);

module.exports = router;