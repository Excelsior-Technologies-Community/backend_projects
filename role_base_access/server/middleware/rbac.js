// Authorize by Role Name (e.g. 'Admin', 'Manager')
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: No role assigned to user',
      });
    }

    const userRoleName = req.user.role.name;
    if (!allowedRoles.includes(userRoleName)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Role '${userRoleName}' does not have permission to access this resource`,
      });
    }

    next();
  };
};

// Authorize by Permission Name (e.g. 'users.create', 'plans.manage')
const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: No role assigned to user',
      });
    }

    // Admins always have all permissions
    if (req.user.role.name === 'Admin') {
      return next();
    }

    const userPermissions = req.user.role.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Missing required permission (${requiredPermissions.join(', ')})`,
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  authorizePermissions,
};
