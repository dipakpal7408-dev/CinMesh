const express = require("express");
const {
  createPost,
  getFeed,
  getPost,
  deletePost,
  toggleLike,
  toggleSave,
  reportPost,
} = require("../controllers/post.controller");
const { addComment, getComments } = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", protect, getFeed);
router.post("/", protect, upload.array("media", 4), createPost);
router.get("/:id", protect, getPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/save", protect, toggleSave);
router.post("/:id/report", protect, reportPost);

router.get("/:postId/comments", protect, getComments);
router.post("/:postId/comments", protect, addComment);

module.exports = router;
