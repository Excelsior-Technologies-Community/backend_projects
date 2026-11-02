const cloudinary = require("../config/cloudinary");
const File = require("../models/File");

// Helper function to upload buffer to Cloudinary using upload_stream
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "backend_uploads",
        resource_type: "auto",
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Upload an image file to Cloudinary & save URL to MongoDB
// @route   POST /api/upload
// @access  Public
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image file to upload."
      });
    }

    // 1. Upload memory buffer directly to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer);

    // 2. Persist image metadata & Cloudinary secure URL in MongoDB
    const savedFile = await File.create({
      originalName: req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
      bytes: cloudinaryResult.bytes,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded to Cloudinary and saved to MongoDB successfully.",
      data: savedFile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all uploaded files from MongoDB
// @route   GET /api/files
// @access  Public
const getAllFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await File.countDocuments();
    const files = await File.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: files.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single uploaded file details by ID
// @route   GET /api/files/:id
// @access  Public
const getFileById = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File record not found in database."
      });
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image from Cloudinary & delete record from MongoDB
// @route   DELETE /api/files/:id
// @access  Public
const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File record not found in database."
      });
    }

    // 1. Delete image asset from Cloudinary
    try {
      await cloudinary.uploader.destroy(file.publicId);
    } catch (cloudErr) {
      console.warn("Cloudinary asset deletion warning:", cloudErr.message);
    }

    // 2. Delete file document from MongoDB
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted from Cloudinary and database successfully.",
      data: { id: req.params.id, publicId: file.publicId }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  getAllFiles,
  getFileById,
  deleteFile
};
