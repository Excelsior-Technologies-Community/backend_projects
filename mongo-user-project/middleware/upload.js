const multer = require("multer");
const path = require("path");

// Use in-memory buffer so the file can be directly streamed to Cloudinary
const storage = multer.memoryStorage();

// File filter: Strict image validation (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid image format! Only JPG, JPEG, PNG, and WEBP files are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB file size limit
  },
  fileFilter
});

module.exports = upload;
