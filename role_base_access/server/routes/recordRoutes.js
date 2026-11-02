const express = require('express');
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
} = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);

router.get('/', authorizeRoles('Admin', 'Manager'), getRecords);
router.post('/', authorizeRoles('Admin'), createRecord);
router.get('/:id', authorizeRoles('Admin', 'Manager'), getRecordById);
router.put('/:id', authorizeRoles('Admin', 'Manager'), updateRecord);

module.exports = router;
