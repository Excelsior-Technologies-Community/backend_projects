const express = require('express');
const router = express.Router();
const {
  getMySubscription,
  getAllSubscriptionsAdmin,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);

router.get('/my', getMySubscription);
router.get('/admin', authorizeRoles('Admin'), getAllSubscriptionsAdmin);

module.exports = router;
