const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
const { logActivity } = require('../utils/logger');

// @desc    Get all roles with assigned user count
// @route   GET /api/roles
// @access  Private (Admin / roles.manage)
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });

    // Count users for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ role: role._id });
        return {
          ...role.toObject(),
          userCount,
        };
      })
    );

    res.status(200).json({ success: true, roles: rolesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all permissions
// @route   GET /api/roles/permissions
// @access  Private (Admin / permissions.manage)
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ module: 1, name: 1 });
    res.status(200).json({ success: true, permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin / roles.manage)
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const existingRole = await Role.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'A role with this name already exists' });
    }

    const role = await Role.create({
      name,
      description: description || '',
      permissions: Array.isArray(permissions) ? permissions : [],
      isSystem: false,
    });

    await logActivity({
      actor: req.user,
      action: 'ROLE_CREATED',
      resource: 'Role',
      resourceId: role._id,
      details: `Role ${role.name} created with ${role.permissions.length} permissions`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update role (name, description, permissions)
// @route   PUT /api/roles/:id
// @access  Private (Admin / roles.manage)
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    const { name, description, permissions } = req.body;

    // Prevent changing the system name of Admin
    if (role.isSystem && role.name === 'Admin' && name && name !== 'Admin') {
      return res.status(400).json({ success: false, message: 'Cannot rename the system Admin role' });
    }

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (Array.isArray(permissions)) {
      role.permissions = permissions;
    }

    await role.save();

    await logActivity({
      actor: req.user,
      action: 'ROLE_UPDATED',
      resource: 'Role',
      resourceId: role._id,
      details: `Role ${role.name} updated. Assigned permissions: ${role.permissions.join(', ')}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (Admin / roles.manage)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'System roles (Admin, Manager, Customer) cannot be deleted' });
    }

    // Check if any users are currently assigned to this role
    const assignedUsers = await User.countDocuments({ role: role._id });
    if (assignedUsers > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. There are ${assignedUsers} user(s) currently assigned to this role. Reassign them first.`,
      });
    }

    await Role.findByIdAndDelete(role._id);

    await logActivity({
      actor: req.user,
      action: 'ROLE_DELETED',
      resource: 'Role',
      resourceId: role._id,
      details: `Role ${role.name} deleted`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: `Role ${role.name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new permission (Admin only)
// @route   POST /api/roles/permissions
// @access  Private (Admin / permissions.manage)
const createPermission = async (req, res) => {
  try {
    const { name, description, module } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Permission name is required' });
    }

    const exists = await Permission.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Permission already exists' });
    }

    const permission = await Permission.create({
      name,
      description: description || '',
      module: module || 'general',
    });

    await logActivity({
      actor: req.user,
      action: 'PERMISSION_CREATED',
      resource: 'Permission',
      resourceId: permission._id,
      details: `Permission ${permission.name} created`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, permission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
  createPermission,
};
