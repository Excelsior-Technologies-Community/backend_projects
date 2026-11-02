const express = require('express');
const router = express.Router();
const {
  getActivityLogs,
  getDashboardStats,
} = require('../controllers/activityLogController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/', authorizeRoles('Admin'), getActivityLogs);

module.exports = router;
