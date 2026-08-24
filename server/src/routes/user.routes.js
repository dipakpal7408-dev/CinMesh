const express = require("express");
const {
  getUserProfile,
  updateProfile,
  updateAvatar,
  toggleFollow,
  searchUsers,
} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/search", protect, searchUsers);
router.put("/me", protect, updateProfile);
router.post("/me/avatar", protect, upload.single("avatar"), updateAvatar);
router.get("/:id", protect, getUserProfile);
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;
