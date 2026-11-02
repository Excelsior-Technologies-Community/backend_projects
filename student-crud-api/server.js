const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// MongoDB Connection URI (Local MongoDB server)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/studentDB";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully at:", MONGO_URI);
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err.message);
  });

// ==========================================
// API ROUTES
// ==========================================

// 1. Home Route - Quick guide and API documentation
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Student CRUD REST API!",
    database: "MongoDB (studentDB)",
    endpoints: {
      "GET /api/students": "Get all students (supports optional ?grade=A filter)",
      "GET /api/students/:id": "Get a single student by MongoDB ID",
      "POST /api/students": "Add a new student (Body: { name, roll, marks, grade? })",
      "PUT /api/students/:id": "Update a student (Body: { name?, roll?, marks?, grade? })",
      "DELETE /api/students/:id": "Delete a student by ID"
    }
  });
});

// 2. GET ALL STUDENTS (Read)
// GET /api/students
// Optional query: GET /api/students?grade=A
app.get("/api/students", async (req, res) => {
  try {
    const filter = {};
    if (req.query.grade) {
      filter.grade = req.query.grade.toUpperCase();
    }

    const students = await Student.find(filter).sort({ roll: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching students",
      error: error.message
    });
  }
});

// 3. GET SINGLE STUDENT BY ID (Read One)
// GET /api/students/:id
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Student ID format",
      error: error.message
    });
  }
});

// 4. ADD A NEW STUDENT (Create)
// POST /api/students
app.post("/api/students", async (req, res) => {
  try {
    const { name, roll, marks, grade } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Student name is required"
      });
    }

    if (roll === undefined || roll === null || isNaN(Number(roll))) {
      return res.status(400).json({
        success: false,
        message: "Valid roll number is required"
      });
    }

    if (marks === undefined || marks === null || isNaN(Number(marks))) {
      return res.status(400).json({
        success: false,
        message: "Valid marks are required"
      });
    }

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ roll: Number(roll) });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Roll number ${roll} is already assigned to ${existingStudent.name}`
      });
    }

    // Create new student record
    const newStudent = new Student({
      name: name.trim(),
      roll: Number(roll),
      marks: Number(marks),
      ...(grade && { grade: grade.trim() }) // optional custom grade, else model calculates it automatically
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: savedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create student",
      error: error.message
    });
  }
});

// 5. UPDATE A STUDENT BY ID (Update)
// PUT /api/students/:id
app.put("/api/students/:id", async (req, res) => {
  try {
    const { name, roll, marks, grade } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // If updating roll, ensure it doesn't collide with another student
    if (roll !== undefined && Number(roll) !== student.roll) {
      const duplicateRoll = await Student.findOne({ roll: Number(roll) });
      if (duplicateRoll) {
        return res.status(400).json({
          success: false,
          message: `Roll number ${roll} is already in use by another student`
        });
      }
      student.roll = Number(roll);
    }

    if (name !== undefined) student.name = name.trim();
    if (marks !== undefined) student.marks = Number(marks);
    if (grade !== undefined) {
      student.grade = grade.trim();
    } else if (marks !== undefined) {
      // Re-calculate grade if marks changed and grade wasn't explicitly given
      student.grade = undefined; // trigger default schema calculation
    }

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update student",
      error: error.message
    });
  }
});

// 6. DELETE A STUDENT BY ID (Delete)
// DELETE /api/students/:id
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Student ID format",
      error: error.message
    });
  }
});

// Catch-all 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found. Visit GET / for available routes."
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Student CRUD API server is running on http://localhost:${PORT}`);
});
