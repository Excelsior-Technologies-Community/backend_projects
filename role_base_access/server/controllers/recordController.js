const Record = require('../models/Record');
const { logActivity } = require('../utils/logger');

// @desc    Get assigned records for Manager, or all records for Admin
// @route   GET /api/records
// @access  Private (Manager with records.manage or Admin)
const getRecords = async (req, res) => {
  try {
    const query = {};

    // If user is Manager (not Admin), strictly filter by assignedManager
    if (req.user.role?.name === 'Manager') {
      query.assignedManager = req.user._id;
    } else if (req.user.role?.name === 'Admin') {
      if (req.query.managerId) {
        query.assignedManager = req.query.managerId;
      }
    } else {
      return res.status(403).json({ success: false, message: 'Access denied: Unauthorized role for records' });
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { clientName: { $regex: req.query.search, $options: 'i' } },
        { clientEmail: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const records = await Record.find(query)
      .populate('assignedManager', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single record by ID with manager ownership check
// @route   GET /api/records/:id
// @access  Private (Assigned Manager or Admin)
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id).populate('assignedManager', 'name email');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Manager Ownership Check
    const isAssigned = record.assignedManager._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'Admin';

    if (!isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this record because it is not assigned to you.',
      });
    }

    res.status(200).json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new record (Admin)
// @route   POST /api/records
// @access  Private (Admin / records.manage)
const createRecord = async (req, res) => {
  try {
    const { title, description, clientName, clientEmail, category, priority, assignedManager } = req.body;

    if (!title || !clientName || !clientEmail || !assignedManager) {
      return res.status(400).json({
        success: false,
        message: 'Title, client name, client email, and assigned manager are required',
      });
    }

    const record = await Record.create({
      title,
      description,
      clientName,
      clientEmail,
      category: category || 'General',
      priority: priority || 'Medium',
      assignedManager,
    });

    const populated = await Record.findById(record._id).populate('assignedManager', 'name email');

    await logActivity({
      actor: req.user,
      action: 'RECORD_CREATED',
      resource: 'Record',
      resourceId: record._id,
      details: `Record '${record.title}' created and assigned to ${populated.assignedManager.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, record: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update record status or add note (Assigned Manager or Admin)
// @route   PUT /api/records/:id
// @access  Private (Assigned Manager or Admin)
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const isAssigned = record.assignedManager.toString() === req.user._id.toString();
    const isAdmin = req.user.role?.name === 'Admin';

    if (!isAssigned && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot modify a record that is not assigned to you.',
      });
    }

    const { status, note, priority, category, title, description, assignedManager } = req.body;

    if (status) record.status = status;
    if (note && note.trim()) {
      record.notes.push({
        note: note.trim(),
        authorName: req.user.name,
        createdAt: new Date(),
      });
    }

    // Only Admin can reassign manager or change client metadata
    if (isAdmin) {
      if (priority) record.priority = priority;
      if (category) record.category = category;
      if (title) record.title = title;
      if (description) record.description = description;
      if (assignedManager) record.assignedManager = assignedManager;
    }

    await record.save();

    const updatedRecord = await Record.findById(record._id).populate('assignedManager', 'name email');

    await logActivity({
      actor: req.user,
      action: 'RECORD_UPDATED',
      resource: 'Record',
      resourceId: record._id,
      details: `${req.user.name} updated record '${record.title}' status to ${record.status}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, record: updatedRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
};
