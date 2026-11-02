const express = require('express');
const router = express.Router();
const {
  getMyTransactions,
  getAllTransactionsAdmin,
  getReceipt,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

router.use(protect);

router.get('/my', getMyTransactions);
router.get('/', authorizeRoles('Admin'), getAllTransactionsAdmin);
router.get('/:id/receipt', getReceipt);

module.exports = router;
