const Post = require("../models/Post");

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Authenticated users only)
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide both post title and content."
      });
    }

    // Automatically set author to authenticated user's ID
    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      author: req.user._id
    });

    // Populate author details for clean response
    await post.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search;
    const authorId = req.query.author;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }
    if (authorId) {
      filter.author = authorId;
    }

    const skip = (page - 1) * limit;
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found."
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post (Author only)
// @route   PUT /api/posts/:id
// @access  Private (Author only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found."
      });
    }

    // STRICT AUTHOR OWNERSHIP CHECK
    // Only the author who created the post is permitted to edit it
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to edit this post. Only the author can edit their own post."
      });
    }

    const { title, content, tags } = req.body;
    if (title !== undefined) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [tags];

    const updatedPost = await post.save();
    await updatedPost.populate("author", "name email");

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: updatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post (Author only)
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found."
      });
    }

    // STRICT AUTHOR OWNERSHIP CHECK
    // Only the author who created the post is permitted to delete it
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this post. Only the author can delete their own post."
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
