const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const Record = require('../models/Record');

// @desc    Get Activity Logs with filters and pagination
// @route   GET /api/logs
// @access  Private (Admin)
const getActivityLogs = async (req, res) => {
  try {
    const { action, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }

    if (search) {
      query.$or = [
        { 'actor.email': { $regex: search, $options: 'i' } },
        { 'actor.name': { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Dashboard Statistics (role-aware: Admin, Manager, Customer)
// @route   GET /api/logs/stats
// @access  Private (Authenticated)
const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role?.name;

    if (userRole === 'Admin') {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const totalActiveSubs = await Subscription.countDocuments({ status: 'active' });
      const totalCapturedTransactions = await Transaction.countDocuments({ paymentStatus: 'captured' });

      // Total revenue
      const revenueResult = await Transaction.aggregate([
        { $match: { paymentStatus: 'captured' } },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
      ]);
      const totalRevenue = revenueResult[0]?.totalRevenue || 0;

      const recentTransactions = await Transaction.find()
        .populate('userId', 'name email')
        .populate('planId')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentLogs = await ActivityLog.find()
        .sort({ createdAt: -1 })
        .limit(6);

      return res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          activeUsers,
          totalActiveSubs,
          totalCapturedTransactions,
          totalRevenue,
          recentTransactions,
          recentLogs,
        },
      });
    }

    if (userRole === 'Manager') {
      const totalAssigned = await Record.countDocuments({ assignedManager: req.user._id });
      const openCount = await Record.countDocuments({ assignedManager: req.user._id, status: 'Open' });
      const inProgressCount = await Record.countDocuments({ assignedManager: req.user._id, status: 'In Progress' });
      const resolvedCount = await Record.countDocuments({ assignedManager: req.user._id, status: 'Resolved' });

      const recentAssignedRecords = await Record.find({ assignedManager: req.user._id })
        .sort({ updatedAt: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        stats: {
          totalAssigned,
          openCount,
          inProgressCount,
          resolvedCount,
          recentAssignedRecords,
        },
      });
    }

    // Default Customer Stats
    const activeSub = await Subscription.findOne({ userId: req.user._id, status: 'active' }).populate('planId');
    const myTransactionCount = await Transaction.countDocuments({ userId: req.user._id, paymentStatus: 'captured' });

    return res.status(200).json({
      success: true,
      stats: {
        currentSubscription: activeSub,
        totalPaymentsMade: myTransactionCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivityLogs,
  getDashboardStats,
};
