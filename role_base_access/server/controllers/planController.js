const Plan = require('../models/Plan');
const { logActivity } = require('../utils/logger');

// @desc    Get all active plans (Public / Customer)
// @route   GET /api/plans
// @access  Public
const getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all plans including inactive (Admin)
// @route   GET /api/plans/admin
// @access  Private (Admin / plans.manage)
const getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single plan by ID
// @route   GET /api/plans/:id
// @access  Public
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new subscription plan (Admin)
// @route   POST /api/plans
// @access  Private (Admin / plans.manage)
const createPlan = async (req, res) => {
  try {
    const { name, description, price, durationInDays, features, isActive } = req.body;

    if (!name || !description || price === undefined || !durationInDays) {
      return res.status(400).json({
        success: false,
        message: 'Plan name, description, price, and duration in days are required',
      });
    }

    const plan = await Plan.create({
      name,
      description,
      price: Number(price),
      durationInDays: Number(durationInDays),
      features: Array.isArray(features) ? features : [],
      isActive: isActive !== undefined ? isActive : true,
    });

    await logActivity({
      actor: req.user,
      action: 'PLAN_CREATED',
      resource: 'Plan',
      resourceId: plan._id,
      details: `Plan '${plan.name}' created at ₹${plan.price} for ${plan.durationInDays} days`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a subscription plan (Admin)
// @route   PUT /api/plans/:id
// @access  Private (Admin / plans.manage)
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const { name, description, price, durationInDays, features, isActive } = req.body;

    if (name) plan.name = name;
    if (description) plan.description = description;
    if (price !== undefined) plan.price = Number(price);
    if (durationInDays !== undefined) plan.durationInDays = Number(durationInDays);
    if (Array.isArray(features)) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();

    await logActivity({
      actor: req.user,
      action: 'PLAN_UPDATED',
      resource: 'Plan',
      resourceId: plan._id,
      details: `Plan '${plan.name}' updated (Price: ₹${plan.price}, Active: ${plan.isActive})`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle plan active/inactive status (Admin)
// @route   PATCH /api/plans/:id/status
// @access  Private (Admin / plans.manage)
const togglePlanStatus = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    await logActivity({
      actor: req.user,
      action: plan.isActive ? 'PLAN_ACTIVATED' : 'PLAN_DEACTIVATED',
      resource: 'Plan',
      resourceId: plan._id,
      details: `Plan '${plan.name}' status set to ${plan.isActive ? 'Active' : 'Inactive'}`,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`,
      plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivePlans,
  getAllPlansAdmin,
  getPlanById,
  createPlan,
  updatePlan,
  togglePlanStatus,
};
