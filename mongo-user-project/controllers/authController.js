const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtpEmail } = require("../config/email");

// Helper: Generate 6-digit numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper: Generate JWT token
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
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

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check existing user
    let user = await User.findOne({ email: normalizedEmail });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "An account with this email is already registered and verified. Please log in."
      });
    }

    // 3. Generate 6-digit OTP (valid for 10 minutes)
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user && !user.isVerified) {
      // User exists but unverified: update their details and set fresh OTP
      user.name = name.trim();
      user.password = password; // Pre-save hook will hash it
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      user.otpLastSentAt = new Date();
      await user.save();
    } else {
      // Create new unverified user
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        isVerified: false,
        otp,
        otpExpiresAt,
        otpLastSentAt: new Date()
      });
    }

    // 4. Send OTP email via Nodemailer
    const emailResult = await sendOtpEmail(user.email, otp, user.name);

    res.status(201).json({
      success: true,
      message: "Registration initiated! A 6-digit OTP has been sent to your email for verification.",
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
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
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email."
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your email is already verified. Please proceed to login."
      });
    }

    // Check expiry
    if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP code has expired. Please request a new OTP using Resend OTP."
      });
    }

    // Check OTP match
    if (user.otp !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please enter the correct 6-digit code."
      });
    }

    // Mark verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token
    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Email successfully verified! Your account is now active.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP to email
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
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email."
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. No OTP is needed. Please login."
      });
    }

    // Cooldown check: 60 seconds
    if (user.otpLastSentAt) {
      const secondsSinceLastOtp = (Date.now() - user.otpLastSentAt.getTime()) / 1000;
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
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpLastSentAt = new Date();
    await user.save();

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

// @desc    User Login with JWT authentication (only verified users)
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
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // STRICT CHECK: Only verified users can log in
    if (!user.isVerified) {
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
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
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
