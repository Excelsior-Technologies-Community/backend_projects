const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/docs", (req, res) => {
  res.json({
    project: "File Upload Microservice with Cloudinary & MongoDB",
    status: "Active",
    endpoints: {
      "POST /api/upload": "Upload an image (multipart/form-data with field 'image', max 5MB)",
      "GET /api/files": "Get all uploaded images from database (supports ?page= & ?limit=)",
      "GET /api/files/:id": "Get single image details by ID",
      "DELETE /api/files/:id": "Delete image from Cloudinary and database"
    }
  });
});

app.use("/api", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 File Upload Service running on http://localhost:${PORT}`);
});
