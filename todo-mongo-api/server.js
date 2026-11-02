const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB Connection URI (Local MongoDB server)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoDB";

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

// 1. Home Route - Quick guide/documentation
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Todo List API connected to MongoDB!",
    endpoints: {
      "GET /api/todos": "Get all todos",
      "GET /api/todos/:id": "Get a single todo by ID",
      "POST /api/todos": "Add a new todo (Body: { title, description })",
      "DELETE /api/todos/:id": "Delete a todo by ID",
      "PUT /api/todos/:id":
        "Update a todo (Body: { title, description, completed })",
      "PATCH /api/todos/:id/toggle": "Toggle completion status of a todo",
    },
  });
});

// 2. GET ALL TODOS (Read)
// GET /api/todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
      error: error.message,
    });
  }
});

// 3. GET SINGLE TODO BY ID (Read one)
// GET /api/todos/:id
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Todo ID format",
      error: error.message,
    });
  }
});

// 4. ADD A NEW TODO (Create)
// POST /api/todos
app.post("/api/todos", async (req, res) => {
  try {
    const { title, description } = req.body;

    // Basic validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required to create a todo",
      });
    }

    // Create new todo document in MongoDB
    const newTodo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: false,
    });

    // Save to MongoDB
    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      data: savedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving todo to database",
      error: error.message,
    });
  }
});

// 5. DELETE A TODO BY ID (Delete)
// DELETE /api/todos/:id
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found, could not delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully!",
      data: deletedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Todo ID format or error deleting todo",
      error: error.message,
    });
  }
});

// 6. UPDATE A TODO (Update)
// PUT /api/todos/:id
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true, runValidators: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found, could not update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully!",
      data: updatedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating todo",
      error: error.message,
    });
  }
});

// 7. TOGGLE TODO COMPLETION (Helper route)
// PATCH /api/todos/:id/toggle
app.patch("/api/todos/:id/toggle", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.completed = !todo.completed;
    const savedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: `Todo marked as ${savedTodo.completed ? "completed" : "incomplete"}!`,
      data: savedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error toggling todo status",
      error: error.message,
    });
  }
});

// Start Server (only when run directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📡 MongoDB Target: ${MONGO_URI}`);
  });
}

module.exports = app;
