const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  getManagers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorizeRoles, authorizePermissions } = require('../middleware/rbac');

router.use(protect);

router.get('/managers', authorizeRoles('Admin'), getManagers);
router.get('/', authorizeRoles('Admin'), getUsers);
router.post('/', authorizeRoles('Admin'), createUser);
router.get('/:id', authorizeRoles('Admin'), getUserById);
router.put('/:id', authorizeRoles('Admin'), updateUser);
router.patch('/:id/status', authorizeRoles('Admin'), toggleUserStatus);

module.exports = router;
