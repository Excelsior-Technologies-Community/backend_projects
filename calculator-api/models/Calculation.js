const mongoose = require('mongoose');

// Schema for tracking calculation history
const calculationSchema = new mongoose.Schema({
  operation: {
    type: String,
    required: [true, 'Operation name is required'],
    enum: ['add', 'subtract', 'multiply', 'divide']
  },
  num1: {
    type: Number,
    required: [true, 'First number (num1) is required']
  },
  num2: {
    type: Number,
    required: [true, 'Second number (num2) is required']
  },
  result: {
    type: Number,
    required: true
  },
  expression: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Calculation model
const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = Calculation;
