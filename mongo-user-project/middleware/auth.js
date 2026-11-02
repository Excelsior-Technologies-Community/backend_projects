const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - JWT verification middleware
 */
const verifyToken = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_key");

    // Fetch user (without password) to ensure user still exists and is verified
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists."
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "User account is not verified. Please verify your OTP."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session token expired. Please login again."
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid or malformed authentication token."
    });
  }
};

module.exports = { verifyToken };
