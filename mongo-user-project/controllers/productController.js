const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

// Helper: Stream memory buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "mongo_user_products",
        resource_type: "image",
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

// @desc    Create a new product with image upload (Multer + Cloudinary)
// @route   POST /api/products
// @access  Private (JWT protected)
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock } = req.body;

    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Product title and price are required."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required. Please upload an image (JPG, PNG, WEBP)."
      });
    }

    // 1. Upload memory buffer to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer);

    // 2. Create product in MongoDB
    const product = await Product.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      price: Number(price),
      category: category ? category.trim() : "General",
      stock: stock ? Number(stock) : 0,
      imageUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      format: cloudinaryResult.format || "",
      bytes: cloudinaryResult.bytes || req.file.size,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully with Cloudinary image upload.",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (with pagination, search, & filter)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const { search, category } = req.query;

    // Build filter query
    const filter = {};

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }

    if (category && category.trim()) {
      filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID."
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product with optional image replacement support
// @route   PUT /api/products/:id
// @access  Private (JWT protected)
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID."
      });
    }

    const { title, description, price, category, stock } = req.body;

    // Update text fields if provided
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category.trim();
    if (stock !== undefined) product.stock = Number(stock);

    // If new image uploaded, replace image in Cloudinary
    if (req.file) {
      // 1. Upload new image to Cloudinary
      const newCloudResult = await uploadBufferToCloudinary(req.file.buffer);

      // 2. Delete old image from Cloudinary
      if (product.publicId) {
        try {
          await cloudinary.uploader.destroy(product.publicId);
          console.log(`🗑️ Removed previous Cloudinary asset: ${product.publicId}`);
        } catch (cloudErr) {
          console.warn("⚠️ Failed to delete old Cloudinary image:", cloudErr.message);
        }
      }

      // 3. Update image references
      product.imageUrl = newCloudResult.secure_url;
      product.publicId = newCloudResult.public_id;
      product.format = newCloudResult.format || "";
      product.bytes = newCloudResult.bytes || req.file.size;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product & remove associated image from Cloudinary
// @route   DELETE /api/products/:id
// @access  Private (JWT protected)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID."
      });
    }

    // 1. Remove image asset from Cloudinary
    if (product.publicId) {
      try {
        await cloudinary.uploader.destroy(product.publicId);
        console.log(`🗑️ Deleted Cloudinary asset: ${product.publicId}`);
      } catch (cloudErr) {
        console.warn("⚠️ Could not delete Cloudinary asset:", cloudErr.message);
      }
    }

    // 2. Remove document from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product and associated Cloudinary image deleted successfully.",
      data: { id: req.params.id, title: product.title }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
