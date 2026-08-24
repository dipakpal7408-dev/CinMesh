const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { uploadBuffer } = require("../services/upload.service");

// @desc  Get a user's public profile
// @route GET /api/users/:id
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("communities", "name slug");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ success: true, data: user });
});

// @desc  Update own profile
// @route PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "college", "branch", "year", "bio", "skills", "github", "linkedin"];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json({ success: true, data: user });
});

// @desc  Upload / change avatar
// @route POST /api/users/me/avatar
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }
  const result = await uploadBuffer(req.file.buffer, "cinmesh/avatars");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: { url: result.secure_url, publicId: result.public_id } },
    { new: true }
  ).select("-password");
  res.json({ success: true, data: user });
});

// @desc  Follow / unfollow a user
// @route POST /api/users/:id/follow
const toggleFollow = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error("User not found");
  }

  const alreadyFollowing = target.followers.some((f) => String(f) === String(req.user._id));

  if (alreadyFollowing) {
    target.followers = target.followers.filter((f) => String(f) !== String(req.user._id));
    req.user.following = req.user.following.filter((f) => String(f) !== String(target._id));
  } else {
    target.followers.push(req.user._id);
    req.user.following.push(target._id);
  }

  await target.save();
  await req.user.save();

  res.json({ success: true, following: !alreadyFollowing });
});

// @desc  Search users by name / branch / skill
// @route GET /api/users/search?q=
const searchUsers = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { branch: { $regex: q, $options: "i" } },
      { skills: { $regex: q, $options: "i" } },
    ],
  })
    .select("name avatar college branch year")
    .limit(20);
  res.json({ success: true, data: users });
});

module.exports = { getUserProfile, updateProfile, updateAvatar, toggleFollow, searchUsers };
