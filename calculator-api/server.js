const express = require("express");
const mongoose = require("mongoose");
const Calculation = require("./models/Calculation");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB Connection URI (Local MongoDB server)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/calculatorDB";

// Track MongoDB connection status
let isMongoConnected = false;
const memoryHistory = [];

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    isMongoConnected = true;
    console.log("✅ Connected to MongoDB successfully at:", MONGO_URI);
  })
  .catch((err) => {
    isMongoConnected = false;
    console.log("⚠️ MongoDB not connected (" + err.message + "). Operating with in-memory calculation history.");
  });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Extracts and validates two numbers from query parameters or route path parameters.
 * Supports:
 * - Query params: ?num1=10&num2=5 (or aliases ?a=10&b=5)
 * - Route params: /:num1/:num2
 */
function parseAndValidateNumbers(req) {
  const raw1 = req.params.num1 ?? req.query.num1 ?? req.query.a;
  const raw2 = req.params.num2 ?? req.query.num2 ?? req.query.b;

  if (raw1 === undefined || raw1 === null || String(raw1).trim() === "") {
    return { error: "First number is required. Provide 'num1' (or 'a') as a query parameter or path parameter." };
  }
  if (raw2 === undefined || raw2 === null || String(raw2).trim() === "") {
    return { error: "Second number is required. Provide 'num2' (or 'b') as a query parameter or path parameter." };
  }

  const num1 = Number(raw1);
  const num2 = Number(raw2);

  if (isNaN(num1)) {
    return { error: `Invalid input '${raw1}' for first number. Must be a valid number.` };
  }
  if (isNaN(num2)) {
    return { error: `Invalid input '${raw2}' for second number. Must be a valid number.` };
  }

  return { num1, num2 };
}

/**
 * Saves a calculation record to MongoDB (or memory fallback)
 */
async function saveCalculationRecord(operation, num1, num2, result, expression) {
  const record = {
    operation,
    num1,
    num2,
    result,
    expression,
    createdAt: new Date()
  };

  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      await Calculation.create(record);
      return;
    } catch (err) {
      console.error("Failed to save to MongoDB:", err.message);
    }
  }

  // In-memory fallback
  memoryHistory.unshift({ ...record, _id: "mem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7) });
  if (memoryHistory.length > 50) memoryHistory.pop();
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Home Route - Quick guide / documentation
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Beginner Calculator REST API connected to MongoDB!",
    database: isMongoConnected ? "MongoDB connected" : "In-memory mode (MongoDB offline)",
    endpoints: {
      "GET /api/add?num1=10&num2=5": "Add two numbers (also supports /api/add/10/5)",
      "GET /api/subtract?num1=10&num2=5": "Subtract num2 from num1 (also supports /api/subtract/10/5)",
      "GET /api/multiply?num1=10&num2=5": "Multiply two numbers (also supports /api/multiply/10/5)",
      "GET /api/divide?num1=10&num2=5": "Divide num1 by num2 (also supports /api/divide/10/5)",
      "GET /api/calculate?operation=add&num1=10&num2=5": "Universal calculation endpoint",
      "GET /api/history": "Get calculation history from database",
      "DELETE /api/history": "Clear calculation history"
    },
    examples: {
      add: "/api/add?num1=25&num2=15",
      subtract: "/api/subtract?num1=50&num2=18",
      multiply: "/api/multiply?num1=12&num2=8",
      divide: "/api/divide?num1=100&num2=4"
    }
  });
});

// Alias /api to root documentation
app.get("/api", (req, res) => {
  res.redirect("/");
});

// 2. GET /api/add - Add two numbers
const handleAdd = async (req, res) => {
  const { num1, num2, error } = parseAndValidateNumbers(req);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const result = Number((num1 + num2).toFixed(10)) * 1;
  const expression = `${num1} + ${num2} = ${result}`;

  await saveCalculationRecord("add", num1, num2, result, expression);

  res.status(200).json({
    success: true,
    operation: "add",
    num1,
    num2,
    result,
    expression
  });
};

app.get("/api/add", handleAdd);
app.get("/api/add/:num1/:num2", handleAdd);

// 3. GET /api/subtract - Subtract two numbers
const handleSubtract = async (req, res) => {
  const { num1, num2, error } = parseAndValidateNumbers(req);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const result = Number((num1 - num2).toFixed(10)) * 1;
  const expression = `${num1} - ${num2} = ${result}`;

  await saveCalculationRecord("subtract", num1, num2, result, expression);

  res.status(200).json({
    success: true,
    operation: "subtract",
    num1,
    num2,
    result,
    expression
  });
};

app.get("/api/subtract", handleSubtract);
app.get("/api/subtract/:num1/:num2", handleSubtract);
app.get("/api/sub", handleSubtract);
app.get("/api/sub/:num1/:num2", handleSubtract);

// 4. GET /api/multiply - Multiply two numbers
const handleMultiply = async (req, res) => {
  const { num1, num2, error } = parseAndValidateNumbers(req);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const result = Number((num1 * num2).toFixed(10)) * 1;
  const expression = `${num1} × ${num2} = ${result}`;

  await saveCalculationRecord("multiply", num1, num2, result, expression);

  res.status(200).json({
    success: true,
    operation: "multiply",
    num1,
    num2,
    result,
    expression
  });
};

app.get("/api/multiply", handleMultiply);
app.get("/api/multiply/:num1/:num2", handleMultiply);
app.get("/api/mul", handleMultiply);
app.get("/api/mul/:num1/:num2", handleMultiply);

// 5. GET /api/divide - Divide two numbers
const handleDivide = async (req, res) => {
  const { num1, num2, error } = parseAndValidateNumbers(req);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  // Division by zero check
  if (num2 === 0) {
    return res.status(400).json({
      success: false,
      error: "Division by zero is not allowed. Second number (num2) cannot be 0."
    });
  }

  const result = Number((num1 / num2).toFixed(10)) * 1;
  const expression = `${num1} ÷ ${num2} = ${result}`;

  await saveCalculationRecord("divide", num1, num2, result, expression);

  res.status(200).json({
    success: true,
    operation: "divide",
    num1,
    num2,
    result,
    expression
  });
};

app.get("/api/divide", handleDivide);
app.get("/api/divide/:num1/:num2", handleDivide);
app.get("/api/div", handleDivide);
app.get("/api/div/:num1/:num2", handleDivide);

// 6. GET /api/calculate - Universal endpoint
app.get("/api/calculate", (req, res) => {
  const op = (req.query.operation || req.query.op || "").toLowerCase().trim();

  switch (op) {
    case "add":
    case "+":
      return handleAdd(req, res);
    case "subtract":
    case "sub":
    case "-":
      return handleSubtract(req, res);
    case "multiply":
    case "mul":
    case "*":
      return handleMultiply(req, res);
    case "divide":
    case "div":
    case "/":
      return handleDivide(req, res);
    default:
      return res.status(400).json({
        success: false,
        error: "Invalid or missing 'operation' query parameter. Supported operations: add, subtract, multiply, divide."
      });
  }
});

// 7. GET /api/history - Retrieve calculation history
app.get("/api/history", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const history = await Calculation.find().sort({ createdAt: -1 }).limit(limit);
      return res.status(200).json({
        success: true,
        source: "MongoDB",
        count: history.length,
        data: history
      });
    }

    return res.status(200).json({
      success: true,
      source: "In-Memory",
      count: memoryHistory.slice(0, limit).length,
      data: memoryHistory.slice(0, limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching calculation history",
      error: error.message
    });
  }
});

// 8. DELETE /api/history - Clear calculation history
app.delete("/api/history", async (req, res) => {
  try {
    if (isMongoConnected && mongoose.connection.readyState === 1) {
      const result = await Calculation.deleteMany({});
      return res.status(200).json({
        success: true,
        message: `Calculation history cleared successfully from MongoDB (${result.deletedCount} records deleted).`
      });
    }

    memoryHistory.length = 0;
    return res.status(200).json({
      success: true,
      message: "In-memory calculation history cleared successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while clearing calculation history",
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}. Visit / for endpoint documentation.`
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Calculator API running at http://localhost:${PORT}`);
  console.log(`📖 Visit http://localhost:${PORT}/ for API endpoint documentation`);
});

module.exports = { app, server };
