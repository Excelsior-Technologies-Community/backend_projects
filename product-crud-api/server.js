const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI (Local MongoDB server)
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/productDB";

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
    message: "Welcome to the Product CRUD REST API with Pagination!",
    database: "MongoDB (productDB)",
    endpoints: {
      "GET /api/products": "Get paginated products (Query params: ?page=1&limit=5&search=name)",
      "GET /api/products/:id": "Get a single product by ID",
      "POST /api/products": "Add a new product (Body: { name, price, stock })",
      "PUT /api/products/:id": "Update a product (Body: { name?, price?, stock? })",
      "DELETE /api/products/:id": "Delete a product by ID"
    }
  });
});

// 2. GET ALL PRODUCTS (Read with Pagination & Search)
// GET /api/products?page=1&limit=5
app.get("/api/products", async (req, res) => {
  try {
    // Read query parameters with beginner-friendly defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || req.query.name;

    // Build search filter if provided
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Calculate how many items to skip
    const skip = (page - 1) * limit;

    // Get total count of matching products
    const total = await Product.countDocuments(filter);

    // Fetch the products for the requested page
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate total number of pages
    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages,
      limit,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
      error: error.message
    });
  }
});

// 3. GET SINGLE PRODUCT BY ID (Read One)
// GET /api/products/:id
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Product ID format",
      error: error.message
    });
  }
});

// 4. ADD A NEW PRODUCT (Create)
// POST /api/products
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required"
      });
    }

    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product price (greater than or equal to 0) is required"
      });
    }

    if (stock === undefined || stock === null || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product stock (greater than or equal to 0) is required"
      });
    }

    // Create new product record
    const newProduct = new Product({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock)
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
});

// 5. UPDATE PRODUCT BY ID (Update)
// PUT /api/products/:id
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (price !== undefined) {
      if (isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number >= 0"
        });
      }
      updates.price = Number(price);
    }
    if (stock !== undefined) {
      if (isNaN(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a valid number >= 0"
        });
      }
      updates.stock = Number(stock);
    }

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Product ID or update error",
      error: error.message
    });
  }
});

// 6. DELETE PRODUCT BY ID (Delete)
// DELETE /api/products/:id
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Product ID format",
      error: error.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
