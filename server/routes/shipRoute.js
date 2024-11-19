const express = require("express");
const { 
  createShip,
  updateShip,
  deleteShip,
  getShipById,
  getAllShips,
} = require("../controllers/shipController");
const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/create", authMiddleWare, isAdmin, createShip);
router.put("/:id", authMiddleWare, isAdmin, updateShip);
router.delete("/:id", authMiddleWare, isAdmin, deleteShip);
router.get("/:id", getShipById);
router.get("/", getAllShips);

module.exports = router;