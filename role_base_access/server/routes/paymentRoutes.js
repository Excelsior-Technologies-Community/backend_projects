const express = require('express');
const router = express.Router();
const {
  getPaymentConfig,
  createOrder,
  verifyPayment,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Webhook endpoint (public, verified with raw body signature)
router.post('/webhook', handleWebhook);

// Protected routes
router.get('/config', protect, getPaymentConfig);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
