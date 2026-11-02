const multer = require("multer");

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Multer errors (e.g., file too large)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum allowed size is 5MB.";
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  // File filter error
  if (err.message && err.message.includes("Only image files")) {
    statusCode = 400;
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
