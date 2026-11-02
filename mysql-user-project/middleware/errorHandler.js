const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error caught by middleware:", err.message);

  // Multer File Upload Errors
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

  // Multer file filter custom error (invalid format)
  if (err.message && err.message.includes("Invalid image format")) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // MySQL Duplicate Key Error (ER_DUP_ENTRY)
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "An account with that email address already exists."
    });
  }

  // MySQL Foreign Key Constraint Error
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      success: false,
      message: "Referenced user does not exist."
    });
  }

  // MySQL Connection Refused / Server Down Error
  if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
    return res.status(503).json({
      success: false,
      message: "MySQL database is currently unreachable. Please ensure MySQL is running and credentials in .env are correct."
    });
  }

  // Default Internal Server Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error occurred."
  });
};

module.exports = errorHandler;
