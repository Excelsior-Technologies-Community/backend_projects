const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ actor, action, resource, resourceId = '', details = '', metadata = {}, ipAddress = '' }) => {
  try {
    await ActivityLog.create({
      actor: {
        userId: actor?._id,
        name: actor?.name || 'System',
        email: actor?.email || '',
        role: actor?.role?.name || (typeof actor?.role === 'string' ? actor.role : 'Unknown'),
      },
      action,
      resource,
      resourceId: resourceId?.toString() || '',
      details,
      metadata,
      ipAddress,
    });
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};

module.exports = { logActivity };
