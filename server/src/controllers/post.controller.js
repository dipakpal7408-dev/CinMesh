const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { getPagination } = require("../utils/pagination");
const { uploadBuffer } = require("src/services/upload.service");
const { createNotification } = require("src/services/notification.service.js");

// @desc  Create a post
// @route POST /api/posts
const createPost = asyncHandler(async (req, res) => {
  const { content, community, tags } = req.body;
  if (!content && (!req.files || req.files.length === 0)) {
    res.status(400);
    throw new Error("Post must have content or media");
  }

  const media = [];
  if (req.files && req.files.length) {
    for (const file of req.files) {
      const result = await uploadBuffer(file.buffer, "cinmesh/posts");
      media.push({
        url: result.secure_url,
        publicId: result.public_id,
        type: file.mimetype.startsWith("video") ? "video" : "image",
      });
    }
  }

  const post = await Post.create({
    author: req.user._id,
    content: content || "",
    media,
    community: community || null,
    tags: tags ? String(tags).split(",").map((t) => t.trim().toLowerCase()) : [],
  });

  const populated = await post.populate("author", "name avatar branch college");
  res.status(201).json({ success: true, data: populated });
});

// @desc  Get feed (paginated, newest first, optional community filter)
// @route GET /api/posts?community=&page=&limit=
const getFeed = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.community) filter.community = req.query.community;
  if (req.query.author) filter.author = req.query.author;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar branch college")
      .populate("community", "name slug"),
    Post.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single post
// @route GET /api/posts/:id
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name avatar branch college")
    .populate("community", "name slug");
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json({ success: true, data: post });
});

// @desc  Delete a post (author only)
// @route DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (String(post.author) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only delete your own posts");
  }
  await post.deleteOne();
  await Comment.deleteMany({ post: post._id });
  res.json({ success: true, message: "Post deleted" });
});

// @desc  Like / unlike a post
// @route POST /api/posts/:id/like
const toggleLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const alreadyLiked = post.likes.some((u) => String(u) === String(req.user._id));
  if (alreadyLiked) {
    post.likes = post.likes.filter((u) => String(u) !== String(req.user._id));
  } else {
    post.likes.push(req.user._id);
  }
  await post.save();

  if (!alreadyLiked) {
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    await createNotification(
      { recipient: post.author, sender: req.user._id, type: "like", post: post._id, text: `${req.user.name} liked your post` },
      io,
      onlineUsers
    );
  }

  res.json({ success: true, liked: !alreadyLiked, likeCount: post.likes.length });
});

// @desc  Save / unsave a post
// @route POST /api/posts/:id/save
const toggleSave = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  const alreadySaved = post.savedBy.some((u) => String(u) === String(req.user._id));
  if (alreadySaved) {
    post.savedBy = post.savedBy.filter((u) => String(u) !== String(req.user._id));
  } else {
    post.savedBy.push(req.user._id);
  }
  await post.save();
  res.json({ success: true, saved: !alreadySaved });
});

// @desc  Report a post
// @route POST /api/posts/:id/report
const reportPost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { isReported: true }, { new: true });
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json({ success: true, message: "Post reported for review" });
});

module.exports = {
  createPost,
  getFeed,
  getPost,
  deletePost,
  toggleLike,
  toggleSave,
  reportPost,
};
