const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
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
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'captured', 'failed'],
      default: 'pending',
      index: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    failureReason: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number before saving if status is captured and invoiceNumber is not set
transactionSchema.pre('save', function (next) {
  if (!this.invoiceNumber && (this.paymentStatus === 'captured' || this.paymentStatus === 'pending')) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoiceNumber = `INV-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
