const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const { getProfile } = require("./controllers/authController");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middlewares
app.use(cors());
app.use(express.json());

// Home / Documentation Route
app.get("/", (req, res) => {
  res.json({
    project: "Authentication System API",
    status: "Active",
    endpoints: {
      "POST /api/auth/register": "Register a new user (Body: { name, email, password })",
      "POST /api/auth/login": "Log in and obtain JWT token (Body: { email, password })",
      "GET /api/auth/profile": "Get current user profile (Headers: Authorization: Bearer <token>)",
      "GET /api/profile": "Direct alias for /api/auth/profile (Headers: Authorization: Bearer <token>)"
    }
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);

// Direct /api/profile route as per specification
app.get("/api/profile", protect, getProfile);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Authentication System API running on http://localhost:${PORT}`);
});
