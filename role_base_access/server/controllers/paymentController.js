const crypto = require('crypto');
const Razorpay = require('razorpay');
const Plan = require('../models/Plan');
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const { logActivity } = require('../utils/logger');

// Initialize Razorpay instance helper
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('placeholder')) {
    return null; // Signals simulation / placeholder mode
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Get public Razorpay Key ID for frontend Checkout
// @route   GET /api/payments/config
// @access  Private
const getPaymentConfig = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id';
  const isSimulationMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('placeholder');
  res.status(200).json({
    success: true,
    keyId,
    isSimulationMode,
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Customer / Authenticated user)
const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Selected plan is invalid or inactive' });
    }

    // Amount in integer paise (e.g. 499 INR = 49900 paise)
    const amountInPaise = Math.round(plan.price * 100);
    const currency = 'INR';
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    const razorpay = getRazorpayInstance();
    let orderId;

    if (razorpay) {
      // Create real order using official Razorpay Node.js SDK
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receiptId,
        notes: {
          userId: req.user._id.toString(),
          userEmail: req.user.email,
          planId: plan._id.toString(),
          planName: plan.name,
        },
      });
      orderId = order.id;
    } else {
      // Simulation order for local testing without active API keys
      orderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }

    // Create a pending Transaction record in MongoDB
    const transaction = await Transaction.create({
      userId: req.user._id,
      planId: plan._id,
      razorpayOrderId: orderId,
      amount: plan.price,
      currency,
      paymentStatus: 'pending',
      metadata: {
        receiptId,
        planDuration: plan.durationInDays,
        isSimulation: !razorpay,
      },
    });

    res.status(200).json({
      success: true,
      order: {
        id: orderId,
        amount: amountInPaise,
        currency,
        planName: plan.name,
        planPrice: plan.price,
        durationInDays: plan.durationInDays,
      },
      transactionId: transaction._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create payment order' });
  }
};

// Helper: Activate subscription idempotently
const activateSubscriptionForUser = async ({ userId, planId, transactionId }) => {
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error('Plan not found during subscription activation');

  const startDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

  // Expire any existing active subscriptions for this user
  await Subscription.updateMany(
    { userId, status: 'active' },
    { $set: { status: 'expired' } }
  );

  // Create new active subscription
  const subscription = await Subscription.create({
    userId,
    planId,
    transactionId,
    startDate,
    expiryDate,
    status: 'active',
  });

  return subscription;
};

// @desc    Verify payment signature & activate subscription
// @route   POST /api/payments/verify
// @access  Private (Authenticated Customer)
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_failed,
      failure_reason,
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Razorpay order ID is required' });
    }

    // Look up transaction
    const transaction = await Transaction.findOne({ razorpayOrderId: razorpay_order_id })
      .populate('planId')
      .populate('userId', 'name email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction record not found for this order' });
    }

    // Handle user/checkout cancellation or failure
    if (payment_failed) {
      transaction.paymentStatus = 'failed';
      transaction.failureReason = failure_reason || 'Checkout was cancelled or payment failed';
      await transaction.save();

      await logActivity({
        actor: req.user,
        action: 'PAYMENT_FAILED',
        resource: 'Transaction',
        resourceId: transaction._id,
        details: `Payment failed for order ${razorpay_order_id}: ${transaction.failureReason}`,
        ipAddress: req.ip,
      });

      return res.status(400).json({
        success: false,
        message: transaction.failureReason,
        transaction,
      });
    }

    // Idempotency check: If already captured, don't duplicate activation
    if (transaction.paymentStatus === 'captured') {
      const existingSub = await Subscription.findOne({ transactionId: transaction._id }).populate('planId');
      return res.status(200).json({
        success: true,
        message: 'Payment already verified and processed',
        transaction,
        subscription: existingSub,
      });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const isSimulation = !razorpaySecret || razorpaySecret.includes('placeholder') || razorpay_order_id.startsWith('order_sim_');

    if (!isSimulation) {
      // Real Razorpay signature verification
      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        transaction.paymentStatus = 'failed';
        transaction.failureReason = 'Payment signature verification mismatch';
        await transaction.save();

        await logActivity({
          actor: req.user,
          action: 'PAYMENT_VERIFICATION_FAILED',
          resource: 'Transaction',
          resourceId: transaction._id,
          details: `Signature mismatch for payment ${razorpay_payment_id}`,
          ipAddress: req.ip,
        });

        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid signature',
        });
      }
    }

    // Verified! Update transaction to captured
    transaction.razorpayPaymentId = razorpay_payment_id || `pay_sim_${Date.now()}`;
    transaction.razorpaySignature = razorpay_signature || 'simulated_signature';
    transaction.paymentStatus = 'captured';
    await transaction.save();

    // Activate subscription idempotently
    const subscription = await activateSubscriptionForUser({
      userId: transaction.userId._id,
      planId: transaction.planId._id,
      transactionId: transaction._id,
    });

    const populatedSub = await Subscription.findById(subscription._id).populate('planId');

    await logActivity({
      actor: req.user,
      action: 'PAYMENT_SUCCESSFUL',
      resource: 'Transaction',
      resourceId: transaction._id,
      details: `Payment verified. Amount: ₹${transaction.amount}, Subscription activated for ${populatedSub.planId.name}`,
      metadata: {
        paymentId: transaction.razorpayPaymentId,
        orderId: transaction.razorpayOrderId,
        subscriptionId: subscription._id,
      },
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated successfully!',
      transaction,
      subscription: populatedSub,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};

// @desc    Razorpay Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Signature verified via raw body)
const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const receivedSignature = req.headers['x-razorpay-signature'];

    // Verify webhook signature with raw body
    if (webhookSecret && !webhookSecret.includes('placeholder')) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.rawBody || JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== receivedSignature) {
        console.warn('Webhook signature verification failed');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const transaction = await Transaction.findOne({ razorpayOrderId: orderId });
      if (transaction && transaction.paymentStatus !== 'captured') {
        transaction.razorpayPaymentId = paymentId;
        transaction.paymentStatus = 'captured';
        await transaction.save();

        await activateSubscriptionForUser({
          userId: transaction.userId,
          planId: transaction.planId,
          transactionId: transaction._id,
        });

        await logActivity({
          actor: { _id: transaction.userId, name: 'System Webhook', role: 'System' },
          action: 'WEBHOOK_PAYMENT_CAPTURED',
          resource: 'Transaction',
          resourceId: transaction._id,
          details: `Webhook confirmed payment captured for order ${orderId}`,
        });
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const transaction = await Transaction.findOne({ razorpayOrderId: orderId });
      if (transaction && transaction.paymentStatus === 'pending') {
        transaction.paymentStatus = 'failed';
        transaction.failureReason = paymentEntity.error_description || 'Webhook reported payment failure';
        await transaction.save();
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

module.exports = {
  getPaymentConfig,
  createOrder,
  verifyPayment,
  handleWebhook,
};
