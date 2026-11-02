const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Method to verify and update expiry status
subscriptionSchema.methods.checkExpiry = function () {
  if (this.status === 'active' && new Date() > this.expiryDate) {
    this.status = 'expired';
  }
  return this.status;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
