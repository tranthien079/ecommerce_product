const Ship = require("../models/shipModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Order = require("../models/orderModel");
const createShip = asyncHandler(async (req, res) => {
  try {
    const newShip = await Ship.create(req.body);
    res.json(newShip);
  } catch (error) {
    throw new Error(error);
  }
});
const updateShip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedShip = await Ship.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedShip);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteShip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const existingOrders = await Order.find({ typeDelivery: id });

    if (existingOrders) {
      throw new Error(
        "Xóa đơn vị vận chuyển không thành công, vì tồn tại đơn hàng liên quan đến đơn vị vận chuyển này"
      );
    }
    const deletedShip = await Ship.findByIdAndDelete(id);
    res.json(deletedShip);
  } catch (error) {
    throw new Error(error);
  }
});
const getShipById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaShip = await Ship.findById(id);
    res.json(getaShip);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllShips = asyncHandler(async (req, res) => {
  try {
    const getallShip = await Ship.find().sort({ expiry: 1 });
    res.json(getallShip);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createShip,
  updateShip,
  deleteShip,
  getShipById,
  getAllShips,
};