const mongoose = require('mongoose');

// Helper function to calculate letter grade based on marks
function calculateGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

// Define Schema for Student records
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  roll: {
    type: Number,
    required: [true, 'Roll number is required'],
    unique: true
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [0, 'Marks cannot be negative'],
    max: [100, 'Marks cannot exceed 100']
  },
  grade: {
    type: String,
    trim: true,
    default: function () {
      return calculateGrade(this.marks);
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to automatically update grade if marks change and grade was not manually overwritten
studentSchema.pre('save', function (next) {
  if (this.isModified('marks') && !this.isModified('grade')) {
    this.grade = calculateGrade(this.marks);
  }
  next();
});

// Create and export the Student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
