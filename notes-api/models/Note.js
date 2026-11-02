const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: "General"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Index to optimize user-specific searches and date filtering
noteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
