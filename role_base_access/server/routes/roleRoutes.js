const express = require('express');
const router = express.Router();
const {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
  createPermission,
} = require('../controllers/roleController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);
router.use(authorizeRoles('Admin'));

router.get('/', getRoles);
router.get('/permissions', getPermissions);
router.post('/permissions', createPermission);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
