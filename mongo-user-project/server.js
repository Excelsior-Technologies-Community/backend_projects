const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5005;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, "public")));

// API Status & Quick Documentation Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    service: "Mongo User & Product Management API",
    cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "mongo_user_products",
    endpoints: {
      auth: [
        "POST /api/auth/register",
        "POST /api/auth/verify-otp",
        "POST /api/auth/resend-otp",
        "POST /api/auth/login",
        "GET /api/auth/me [Protected]"
      ],
      products: [
        "GET /api/products",
        "GET /api/products/:id",
        "POST /api/products [Protected, Multer image upload]",
        "PUT /api/products/:id [Protected, Image replacement]",
        "DELETE /api/products/:id [Protected, Image removal]"
      ]
    }
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Frontend UI live at: http://localhost:${PORT}`);
  console.log(`📡 Health & API docs: http://localhost:${PORT}/api/health`);
  console.log(`☁️ Cloudinary folder: ${process.env.CLOUDINARY_FOLDER || "mongo_user_products"}`);
  console.log(`===============================================`);
});
