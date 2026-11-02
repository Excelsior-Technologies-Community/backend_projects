const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true
    },
    cloudinaryUrl: {
      type: String,
      required: [true, "Cloudinary URL is required"]
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
      unique: true
    },
    format: {
      type: String
    },
    bytes: {
      type: Number
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("File", fileSchema);
