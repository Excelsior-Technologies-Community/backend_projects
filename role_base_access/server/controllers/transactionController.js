const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');

// @desc    Get current user's transaction history
// @route   GET /api/transactions/my
// @access  Private (Customer / All authenticated users)
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('planId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transactions with search, filter, and pagination (Admin)
// @route   GET /api/transactions
// @access  Private (Admin / transactions.view)
const getAllTransactionsAdmin = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) {
      query.paymentStatus = status;
    }

    if (search) {
      query.$or = [
        { razorpayOrderId: { $regex: search, $options: 'i' } },
        { razorpayPaymentId: { $regex: search, $options: 'i' } },
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .populate('planId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // If search was also intended for user name or email, perform populated match filter if needed
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Receipt / Invoice data for a transaction
// @route   GET /api/transactions/:id/receipt
// @access  Private (Owner or Admin)
const getReceipt = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('planId');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Security check: Only transaction owner or Admin can view receipt
    const isOwner = transaction.userId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied: You do not own this transaction receipt' });
    }

    // Receipt is only available for verified successful payments
    if (transaction.paymentStatus !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Receipt is only available for verified successful payments',
      });
    }

    // Find corresponding subscription for validity info
    const subscription = await Subscription.findOne({ transactionId: transaction._id });

    const receiptData = {
      receiptType: 'PAYMENT RECEIPT',
      note: 'This is a computer-generated payment confirmation receipt.',
      invoiceNumber: transaction.invoiceNumber,
      paymentDate: transaction.updatedAt || transaction.createdAt,
      customer: {
        id: transaction.userId._id,
        name: transaction.userId.name,
        email: transaction.userId.email,
      },
      plan: {
        id: transaction.planId._id,
        name: transaction.planId.name,
        description: transaction.planId.description,
        durationInDays: transaction.planId.durationInDays,
      },
      paymentDetails: {
        orderId: transaction.razorpayOrderId,
        paymentId: transaction.razorpayPaymentId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.paymentStatus,
      },
      subscriptionValidity: subscription
        ? {
            startDate: subscription.startDate,
            expiryDate: subscription.expiryDate,
            status: subscription.status,
          }
        : null,
    };

    res.status(200).json({ success: true, receipt: receiptData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyTransactions,
  getAllTransactionsAdmin,
  getReceipt,
};
