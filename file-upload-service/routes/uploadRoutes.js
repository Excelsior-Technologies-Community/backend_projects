const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerMiddleware");
const {
  uploadImage,
  getAllFiles,
  getFileById,
  deleteFile
} = require("../controllers/uploadController");

// Upload endpoint - accepts multipart/form-data with field name 'image' (or 'file')
router.post("/upload", upload.single("image"), uploadImage);

// Retrieve and manage files
router.get("/files", getAllFiles);
router.get("/files/:id", getFileById);
router.delete("/files/:id", deleteFile);

module.exports = router;
