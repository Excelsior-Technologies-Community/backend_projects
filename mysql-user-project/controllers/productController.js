const ProductModel = require("../models/productModel");
const {
  uploadImage,
  deleteImage,
  isCloudinaryUrl
} = require("../config/cloudinary");

const removeCloudinaryImage = async (url, publicId) => {
  if (!isCloudinaryUrl(url) || !publicId) return false;

  try {
    await deleteImage(publicId);
    return true;
  } catch (error) {
    console.error(`Failed to delete Cloudinary image '${publicId}': ${error.message}`);
    return false;
  }
};

// @desc    Create a new product with image upload (Multer)
// @route   POST /api/products
// @access  Private (JWT protected)
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, stock } = req.body;

    // Validate required fields
    if (!title || price === undefined || price === null || price === "") {
      return res.status(400).json({
        success: false,
        message: "Product title and price are required."
      });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required. Please upload an image (JPG, JPEG, PNG, WEBP)."
      });
    }

    const image = await uploadImage(req.file.buffer);

    let product;
    try {
      product = await ProductModel.create({
        title: title.trim(),
        description: description ? description.trim() : "",
        price: numPrice,
        category: category ? category.trim() : "General",
        stock: stock ? Number(stock) : 0,
        imageUrl: image.url,
        imageFilename: image.publicId,
        imageSize: image.size,
        createdBy: req.user.id
      });
    } catch (error) {
      await removeCloudinaryImage(image.url, image.publicId);
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Product created successfully with image upload.",
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
    const search = req.query.search || "";
    const category = req.query.category || "";

    const result = await ProductModel.findAll({ page, limit, search, category });

    res.status(200).json({
      success: true,
      count: result.products.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.products
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
    const product = await ProductModel.findById(req.params.id);

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
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID."
      });
    }

    const { title, description, price, category, stock } = req.body;
    const updates = {};

    if (title !== undefined && title.trim()) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number."
        });
      }
      updates.price = numPrice;
    }
    if (category !== undefined) updates.category = category.trim();
    if (stock !== undefined) updates.stock = Number(stock);

    let newImage;
    if (req.file) {
      newImage = await uploadImage(req.file.buffer);
      updates.imageUrl = newImage.url;
      updates.imageFilename = newImage.publicId;
      updates.imageSize = newImage.size;
    }

    let updatedProduct;
    try {
      updatedProduct = await ProductModel.update(req.params.id, updates);
    } catch (error) {
      if (newImage) {
        await removeCloudinaryImage(newImage.url, newImage.publicId);
      }
      throw error;
    }

    const previousCloudinaryImageDeleted =
      newImage && isCloudinaryUrl(product.imageUrl)
        ? await removeCloudinaryImage(product.imageUrl, product.imageFilename)
        : null;

    res.status(200).json({
      success: true,
      message: previousCloudinaryImageDeleted === false
        ? "Product updated, but the previous Cloudinary image could not be deleted."
        : "Product updated successfully.",
      previousCloudinaryImageDeleted,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product & remove associated Cloudinary image
// @route   DELETE /api/products/:id
// @access  Private (JWT protected)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with this ID."
      });
    }

    // Delete the product record before best-effort Cloudinary cleanup.
    await ProductModel.delete(req.params.id);
    const cloudinaryImageDeleted = isCloudinaryUrl(product.imageUrl)
      ? await removeCloudinaryImage(product.imageUrl, product.imageFilename)
      : null;

    res.status(200).json({
      success: true,
      message: cloudinaryImageDeleted === false
        ? "Product deleted, but its Cloudinary image could not be deleted."
        : "Product and associated Cloudinary image deleted successfully.",
      data: {
        id: product.id,
        title: product.title,
        cloudinaryImageDeleted
      }
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
