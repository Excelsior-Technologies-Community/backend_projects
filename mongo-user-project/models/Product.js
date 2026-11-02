const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [2, "Product title must be at least 2 characters"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      trim: true,
      default: "General"
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"]
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"]
    },
    format: {
      type: String,
      default: ""
    },
    bytes: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual index for title search
productSchema.index({ title: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
