const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../public/images/"));
//   },
//   filename: function (req, file, cb) {
//     const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/images/");
    // Tạo thư mục nếu chưa tồn tại
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Lấy đuôi file gốc thay vì hardcode .jpeg
    const ext = path.extname(file.originalname) || '.jpeg';
    cb(null, file.fieldname + "-" + uniquesuffix + ext);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },// limit file size 1mb
});


module.exports = { uploadPhoto  };
