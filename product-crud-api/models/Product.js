const mongoose = require("mongoose");

// Define Schema for Product records
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
