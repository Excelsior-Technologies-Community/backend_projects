const User = require('../models/User');
const Role = require('../models/Role');
const { logActivity } = require('../utils/logger');

// @desc    Get all users (with search and role filter)
// @route   GET /api/users
// @access  Private (Admin / users.view)
const getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status !== undefined && status !== '') {
      query.isActive = status === 'active';
    }

    if (role) {
      const foundRole = await Role.findOne({ name: role });
      if (foundRole) {
        query.role = foundRole._id;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('role')
      .populate('assignedManager', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin or Manager with permission)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role')
      .populate('assignedManager', 'name email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a user (Admin only)
// @route   POST /api/users
// @access  Private (Admin / users.create)
const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId, assignedManager } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User email already exists' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role._id,
      assignedManager: assignedManager || null,
      isActive: true,
    });

    const populatedUser = await User.findById(user._id).populate('role').populate('assignedManager', 'name email');

    await logActivity({
      actor: req.user,
      action: 'USER_CREATED',
      resource: 'User',
      resourceId: user._id,
      details: `Admin ${req.user.email} created user ${user.email} with role ${role.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, user: populatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details, role, or manager assignment
// @route   PUT /api/users/:id
// @access  Private (Admin / users.update)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, roleId, isActive, assignedManager, password } = req.body;

    // Check if modifying an Admin to non-admin or deactivating
    if (user.role.name === 'Admin') {
      const adminRole = await Role.findOne({ name: 'Admin' });
      const activeAdminCount = await User.countDocuments({
        role: adminRole._id,
        isActive: true,
      });

      // If this is the last active admin, don't allow deactivating or changing role
      if (activeAdminCount <= 1) {
        if (isActive === false) {
          return res.status(400).json({
            success: false,
            message: 'Action prohibited: Cannot deactivate the last active Admin account.',
          });
        }
        if (roleId && roleId.toString() !== user.role._id.toString()) {
          return res.status(400).json({
            success: false,
            message: 'Action prohibited: Cannot change the role of the last active Admin.',
          });
        }
      }
    }

    const previousRoleName = user.role.name;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (isActive !== undefined) user.isActive = isActive;
    if (assignedManager !== undefined) user.assignedManager = assignedManager || null;
    if (password && password.trim().length >= 6) {
      user.password = password; // pre-save will hash
    }

    if (roleId && roleId.toString() !== user.role._id.toString()) {
      const newRole = await Role.findById(roleId);
      if (!newRole) {
        return res.status(400).json({ success: false, message: 'Invalid role specified' });
      }
      user.role = newRole._id;

      await logActivity({
        actor: req.user,
        action: 'ROLE_ASSIGNED',
        resource: 'User',
        resourceId: user._id,
        details: `Role for ${user.email} changed from ${previousRoleName} to ${newRole.name}`,
        ipAddress: req.ip,
      });
    }

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('role')
      .populate('assignedManager', 'name email');

    await logActivity({
      actor: req.user,
      action: 'USER_UPDATED',
      resource: 'User',
      resourceId: user._id,
      details: `Admin ${req.user.email} updated user ${user.email}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle deactivate / activate user
// @route   PATCH /api/users/:id/status
// @access  Private (Admin / users.delete)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role.name === 'Admin' && user.isActive) {
      const adminRole = await Role.findOne({ name: 'Admin' });
      const activeAdminCount = await User.countDocuments({
        role: adminRole._id,
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active Admin account.',
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    await logActivity({
      actor: req.user,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      resource: 'User',
      resourceId: user._id,
      details: `User ${user.email} status set to ${user.isActive ? 'Active' : 'Deactivated'}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: `User successfully ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of Managers (for assignment dropdown)
// @route   GET /api/users/managers
// @access  Private (Admin)
const getManagers = async (req, res) => {
  try {
    const managerRole = await Role.findOne({ name: 'Manager' });
    if (!managerRole) {
      return res.status(200).json({ success: true, managers: [] });
    }
    const managers = await User.find({ role: managerRole._id, isActive: true }).select('name email');
    res.status(200).json({ success: true, managers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  getManagers,
};
