const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public Product Endpoints
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected Product Endpoints (Require JWT Auth)
router.post("/", verifyToken, upload.single("image"), createProduct);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
