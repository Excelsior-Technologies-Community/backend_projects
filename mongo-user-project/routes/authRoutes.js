const express = require("express");
const router = express.Router();
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Public Auth Endpoints
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// Protected Auth Endpoint
router.get("/me", verifyToken, getMe);

module.exports = router;
