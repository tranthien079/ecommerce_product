const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/uploadController");
const { isAdmin, authMiddleWare } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.post(
  "/",
  authMiddleWare,
  isAdmin,
  uploadPhoto.array("images", 10),
  uploadImages
);

router.delete("/delete-img/:id", authMiddleWare, isAdmin, deleteImages);

module.exports = router;