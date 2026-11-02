const multer = require("multer");
const path = require("path");

// File filter: Strict image validation (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /^(jpeg|jpg|png|webp)$/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const mime = file.mimetype.toLowerCase();

  const isExtValid = allowedExtensions.test(ext);
  const isMimeValid =
    mime === "image/jpeg" ||
    mime === "image/jpg" ||
    mime === "image/png" ||
    mime === "image/webp";

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Invalid image format! Only JPG, JPEG, PNG, and WEBP files are allowed."
    )
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
  },
  fileFilter
});

module.exports = { upload };
