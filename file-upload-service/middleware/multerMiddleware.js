const multer = require("multer");
const path = require("path");

// Use in-memory buffer so the file can be directly streamed to Cloudinary
const storage = multer.memoryStorage();

// Validate file type (Images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megabytes limit
  },
  fileFilter
});

module.exports = upload;
