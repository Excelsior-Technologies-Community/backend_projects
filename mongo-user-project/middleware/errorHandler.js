const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error caught by middleware:", err.message);

  // Multer Error Handling
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds the 5MB limit. Please upload a smaller image."
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`
    });
  }

  // Multer file filter custom error
  if (err.message && err.message.includes("Invalid image format")) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `An account with that ${field} already exists.`
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: errors.join(", ")
    });
  }

  // Mongoose Invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      success: false,
      message: "Resource not found with the specified ID."
    });
  }

  // Default Internal Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error occurred."
  });
};

module.exports = errorHandler;
