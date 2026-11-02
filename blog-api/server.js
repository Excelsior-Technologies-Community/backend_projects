const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Documentation endpoint
app.get("/api/docs", (req, res) => {
  res.json({
    project: "Blog REST API with Authentication",
    status: "Active",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register user (Body: { name, email, password })",
        "POST /api/auth/login": "Login user (Body: { email, password })",
        "GET /api/auth/profile": "Get current profile (Protected: Bearer token)"
      },
      posts: {
        "GET /api/posts": "Get all blog posts (Public, supports ?search= & ?author= & ?page= & ?limit=)",
        "GET /api/posts/:id": "Get single blog post (Public)",
        "POST /api/posts": "Create new post (Protected: Bearer token, Body: { title, content, tags })",
        "PUT /api/posts/:id": "Update post (Protected: Only the post author can update)",
        "DELETE /api/posts/:id": "Delete post (Protected: Only the post author can delete)"
      }
    }
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Blog API running on http://localhost:${PORT}`);
});
