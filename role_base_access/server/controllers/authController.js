const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { logActivity } = require('../utils/logger');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new customer (public registration strictly assigns Customer role)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // STRICT REQUIREMENT: Public registration must always assign Customer role
    const customerRole = await Role.findOne({ name: 'Customer' });
    if (!customerRole) {
      return res.status(500).json({ success: false, message: 'System role setup incomplete. Please run seed script.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: customerRole._id,
      isActive: true,
    });

    const populatedUser = await User.findById(user._id).populate('role');

    // Log Activity
    await logActivity({
      actor: populatedUser,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user._id,
      details: `Customer account registered for ${user.email}`,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        isActive: populatedUser.isActive,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('role');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Log Activity
    await logActivity({
      actor: user,
      action: 'USER_LOGIN',
      resource: 'Auth',
      resourceId: user._id,
      details: `User ${user.email} logged in successfully`,
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('role').populate('assignedManager', 'name email');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

// @desc    Update user profile (name, password)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }
      user.password = req.body.password;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate('role');

    await logActivity({
      actor: updatedUser,
      action: 'PROFILE_UPDATED',
      resource: 'User',
      resourceId: user._id,
      details: `User ${user.email} updated profile`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
};

// @desc    Logout user & log event
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    await logActivity({
      actor: req.user,
      action: 'USER_LOGOUT',
      resource: 'Auth',
      resourceId: req.user._id,
      details: `User ${req.user.email} logged out`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during logout' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  logout,
};
