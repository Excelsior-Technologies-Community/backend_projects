const express = require('express');
const router = express.Router();
const {
  getActivePlans,
  getAllPlansAdmin,
  getPlanById,
  createPlan,
  updatePlan,
  togglePlanStatus,
} = require('../controllers/planController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

// Public route for active plans
router.get('/', getActivePlans);

// Admin routes
router.get('/admin', protect, authorizeRoles('Admin'), getAllPlansAdmin);
router.get('/:id', getPlanById);
router.post('/', protect, authorizeRoles('Admin'), createPlan);
router.put('/:id', protect, authorizeRoles('Admin'), updatePlan);
router.patch('/:id/status', protect, authorizeRoles('Admin'), togglePlanStatus);

module.exports = router;
