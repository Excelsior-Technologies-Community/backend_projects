const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const { sendOtpEmail } = require("../config/email");

// Email regex validator
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper: Generate 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Generate JWT token   
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || "default_jwt_secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @desc    Register a new user & send OTP to email
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password."
      });
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters long."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address format."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // 2. Check existing user
    let user = await UserModel.findByEmail(normalizedEmail);

    if (user && user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "An account with this email is already registered and verified. Please log in."
      });
    }

    // 3. Generate 6-digit OTP (valid for 10 minutes)
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const now = new Date();

    if (user && !user.is_verified) {
      // User exists but unverified: update their details and set fresh OTP
      await UserModel.updateUnverifiedUser(user.id, {
        name: name.trim(),
        password,
        otp,
        otpExpiresAt,
        otpLastSentAt: now
      });
    } else {
      // Create new unverified user
      const created = await UserModel.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        otp,
        otpExpiresAt,
        otpLastSentAt: now
      });
      user = { id: created.id, email: created.email, name: created.name };
    }

    // 4. Send OTP email via Nodemailer
    const emailResult = await sendOtpEmail(normalizedEmail, otp, name.trim());

    res.status(201).json({
      success: true,
      message: "Registration initiated! A 6-digit OTP has been sent to your email for verification.",
      data: {
        userId: user.id,
        email: normalizedEmail,
        name: name.trim(),
        otpExpiresIn: "10 minutes",
        // In local/demo mode if SMTP credentials are missing, expose OTP in response for instant developer testing
        debugOtp: emailResult.method === "console_fallback" ? otp : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and 6-digit OTP code."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        message: "OTP code must be exactly 6 numeric digits."
      });
    }

    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email."
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Your email is already verified. Please proceed to login."
      });
    }

    // Check expiry
    if (!user.otp_expires_at || new Date(user.otp_expires_at).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP code has expired. Please request a new OTP using Resend OTP."
      });
    }

    // Check OTP match
    if (String(user.otp).trim() !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please enter the correct 6-digit code."
      });
    }

    // Mark verified and clear OTP in MySQL
    const verifiedUser = await UserModel.verifyUser(user.id);

    // Generate JWT token
    const token = signToken(verifiedUser);

    res.status(200).json({
      success: true,
      message: "Email successfully verified! Your account is now active.",
      token,
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        isVerified: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP to email for unverified users
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address to resend OTP."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email."
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. No OTP is needed. Please login."
      });
    }

    // Cooldown check: 60 seconds
    if (user.otp_last_sent_at) {
      const secondsSinceLastOtp = (Date.now() - new Date(user.otp_last_sent_at).getTime()) / 1000;
      if (secondsSinceLastOtp < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLastOtp);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`
        });
      }
    }

    // Generate fresh OTP
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const now = new Date();

    await UserModel.updateOtp(user.id, {
      otp,
      otpExpiresAt,
      otpLastSentAt: now
    });

    // Send email
    const emailResult = await sendOtpEmail(user.email, otp, user.name);

    res.status(200).json({
      success: true,
      message: "A fresh 6-digit OTP has been sent to your email.",
      data: {
        email: user.email,
        otpExpiresIn: "10 minutes",
        debugOtp: emailResult.method === "console_fallback" ? otp : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User Login with JWT authentication (only email-verified users can log in)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // STRICT CHECK: Only verified users can log in
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        message: "Your account is not verified yet. Please verify the OTP sent to your email before logging in.",
        email: user.email
      });
    }

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: Boolean(user.is_verified)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (JWT protected)
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  getMe
};
