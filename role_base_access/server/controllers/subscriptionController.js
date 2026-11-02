const Subscription = require('../models/Subscription');

// @desc    Get current user's active subscription and past history
// @route   GET /api/subscriptions/my
// @access  Private (Customer / Any authenticated user)
const getMySubscription = async (req, res) => {
  try {
    // Find latest active subscription
    const activeSub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    })
      .populate('planId')
      .populate('transactionId')
      .sort({ createdAt: -1 });

    if (activeSub) {
      // Check if expired
      if (new Date() > activeSub.expiryDate) {
        activeSub.status = 'expired';
        await activeSub.save();
      }
    }

    // Also get all subscriptions history for this user
    const history = await Subscription.find({ userId: req.user._id })
      .populate('planId')
      .populate('transactionId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      currentSubscription: activeSub && activeSub.status === 'active' ? activeSub : null,
      history,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all subscriptions across the system (Admin)
// @route   GET /api/subscriptions/admin
// @access  Private (Admin / transactions.view)
const getAllSubscriptionsAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Subscription.countDocuments(query);
    const subscriptions = await Subscription.find(query)
      .populate('userId', 'name email')
      .populate('planId')
      .populate('transactionId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Update any that have naturally expired
    const now = new Date();
    for (const sub of subscriptions) {
      if (sub.status === 'active' && now > sub.expiryDate) {
        sub.status = 'expired';
        await sub.save();
      }
    }

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMySubscription,
  getAllSubscriptionsAdmin,
};
