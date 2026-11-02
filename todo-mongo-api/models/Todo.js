const mongoose = require('mongoose');

// Define Schema for Todo items
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Todo title is required'],
    trim: true
  },
  description: {
    type: String, 
    default: '',
    trim: true
  },
  completed: {
    type: Boolean,
    default: falsev
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Todo model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
