const Note = require("../models/Note");

// @desc    Create a new private note
// @route   POST /api/notes
// @access  Private (Authenticated users only)
const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide both note title and content."
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : "General",
      user: req.user._id // strictly bound to authenticated user
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully.",
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all private notes for the authenticated user
// @route   GET /api/notes
// @access  Private
// @query   ?search=... | ?title=... (Search by title)
//          ?date=YYYY-MM-DD (Filter by specific date)
//          ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD (Filter by date range)
//          ?category=... (Filter by category)
const getNotes = async (req, res, next) => {
  try {
    const { search, title, date, startDate, endDate, category, page, limit } = req.query;

    // Base filter: STRICTLY isolated to the authenticated user only
    const filter = { user: req.user._id };

    // 1. Search by title
    const searchKeyword = search || title;
    if (searchKeyword) {
      filter.title = { $regex: searchKeyword.trim(), $options: "i" };
    }

    // 2. Filter by category
    if (category) {
      filter.category = { $regex: category.trim(), $options: "i" };
    }

    // 3. Filter by date
    if (date) {
      // Filter for exact day (00:00:00 to 23:59:59.999)
      const dayStart = new Date(date);
      dayStart.setUTCHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setUTCHours(23, 59, 59, 999);

      if (!isNaN(dayStart.getTime()) && !isNaN(dayEnd.getTime())) {
        filter.createdAt = { $gte: dayStart, $lte: dayEnd };
      }
    } else if (startDate || endDate) {
      // Filter for date range
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        if (!isNaN(start.getTime())) filter.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        if (!isNaN(end.getTime())) filter.createdAt.$lte = end;
      }
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: notes.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single private note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    // Only find if ID matches AND belongs to authenticated user
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      // Check if note exists under another user to distinguish 404 vs 403
      const noteExistsForOther = await Note.findById(req.params.id);
      if (noteExistsForOther) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to view this note."
        });
      }
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a private note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    // PRIVACY ENFORCEMENT: Check user ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to edit this note. Notes are private to their creator."
      });
    }

    const { title, content, category } = req.body;
    if (title !== undefined) note.title = title.trim();
    if (content !== undefined) note.content = content.trim();
    if (category !== undefined) note.category = category.trim();

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a private note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found."
      });
    }

    // PRIVACY ENFORCEMENT: Check user ownership
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this note. Notes are private to their creator."
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
