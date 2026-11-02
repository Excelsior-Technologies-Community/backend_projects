const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Record title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Billing', 'Account Support', 'Onboarding', 'Enterprise Plan Inquiry', 'General'],
      default: 'General',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: [
      {
        note: String,
        authorName: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', recordSchema);
