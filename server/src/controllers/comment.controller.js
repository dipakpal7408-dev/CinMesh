const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { createNotification } = require("../services/notification.service");

// @desc  Add a comment to a post
// @route POST /api/posts/:postId/comments
const addComment = asyncHandler(async (req, res) => {
  const { text, parentComment } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    text,
    parentComment: parentComment || null,
  });

  post.commentCount += 1;
  await post.save();

  const io = req.app.get("io");
  const onlineUsers = req.app.get("onlineUsers");
  await createNotification(
    { recipient: post.author, sender: req.user._id, type: "comment", post: post._id, text: `${req.user.name} commented on your post` },
    io,
    onlineUsers
  );

  const populated = await comment.populate("author", "name avatar");
  res.status(201).json({ success: true, data: populated });
});

// @desc  Get comments for a post
// @route GET /api/posts/:postId/comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: 1 })
    .populate("author", "name avatar");
  res.json({ success: true, data: comments });
});

// @desc  Delete own comment
// @route DELETE /api/comments/:id
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  if (String(comment.author) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only delete your own comments");
  }
  await comment.deleteOne();
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
  res.json({ success: true, message: "Comment deleted" });
});

module.exports = { addComment, getComments, deleteComment };
