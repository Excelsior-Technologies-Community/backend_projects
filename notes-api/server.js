const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/docs", (req, res) => {
  res.json({
    project: "Notes REST API",
    status: "Active",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register account (Body: { name, email, password })",
        "POST /api/auth/login": "Login to receive JWT (Body: { email, password })",
        "GET /api/auth/profile": "Get user profile (Protected: Bearer token)"
      },
      notes: {
        "GET /api/notes": "Get private notes (Protected. Query: ?search=keyword, ?date=YYYY-MM-DD, ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)",
        "GET /api/notes/:id": "Get single private note by ID (Protected)",
        "POST /api/notes": "Create private note (Protected. Body: { title, content, category })",
        "PUT /api/notes/:id": "Update private note (Protected: Only owner)",
        "DELETE /api/notes/:id": "Delete private note (Protected: Only owner)"
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Notes API running on http://localhost:${PORT}`);
});
