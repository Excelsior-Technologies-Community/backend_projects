const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { initDB, getStatus } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5006;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend UI
app.use(express.static(path.join(__dirname, "public")));

// API Status & Documentation Endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = getStatus();
  res.status(200).json({
    success: true,
    status: "Healthy",
    service: "MySQL User & Product Management System",
    database: {
      type: "MySQL",
      connected: dbStatus.connected,
      host: dbStatus.host,
      port: dbStatus.port,
      database: dbStatus.database,
      note: dbStatus.connected
        ? "Connected and tables synchronized."
        : "Pending MySQL credentials or server start. Configure in .env"
    },
    endpoints: {
      auth: [
        "POST /api/auth/register (Validation, bcrypt hash, Nodemailer OTP)",
        "POST /api/auth/verify-otp (OTP expiry & validation check)",
        "POST /api/auth/resend-otp (60s cooldown throttling)",
        "POST /api/auth/login (JWT token, verified users only)",
        "GET /api/auth/me [Protected with JWT]"
      ],
      products: [
        "GET /api/products (Public, pagination, search, category filter)",
        "GET /api/products/:id (Public, single product by ID)",
        "POST /api/products [Protected with JWT, Multer-to-Cloudinary image upload]",
        "PUT /api/products/:id [Protected with JWT, Cloudinary image replacement]",
        "DELETE /api/products/:id [Protected with JWT, Cloudinary image removal]"
      ]
    }
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server & Connect to Database
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 MySQL Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Frontend UI live at:     http://localhost:${PORT}`);
  console.log(`📡 Health & API docs at:    http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);

  // Attempt database connection & table initialization
  await initDB();
});
