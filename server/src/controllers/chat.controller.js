const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");

// @desc  Get (or create) a 1-to-1 chat with another user
// @route POST /api/chats/one-to-one
const accessOneToOneChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  if (userId === String(req.user._id)) {
    res.status(400);
    throw new Error("You cannot chat with yourself");
  }

  const otherUser = await User.findById(userId);
  if (!otherUser) {
    res.status(404);
    throw new Error("User not found");
  }

  let chat = await Chat.findOne({
    isGroup: false,
    members: { $all: [req.user._id, userId], $size: 2 },
  })
    .populate("members", "name avatar isOnline lastSeen")
    .populate({ path: "lastMessage", populate: { path: "sender", select: "name" } });

  if (!chat) {
    chat = await Chat.create({ isGroup: false, members: [req.user._id, userId] });
    chat = await chat.populate("members", "name avatar isOnline lastSeen");
  }

  res.json({ success: true, data: chat });
});

// @desc  Create a group chat
// @route POST /api/chats/group
const createGroupChat = asyncHandler(async (req, res) => {
  const { name, memberIds } = req.body;
  if (!name || !Array.isArray(memberIds) || memberIds.length < 2) {
    res.status(400);
    throw new Error("Group name and at least 2 other members are required");
  }

  const members = [...new Set([...memberIds, String(req.user._id)])];

  const chat = await Chat.create({
    isGroup: true,
    name,
    members,
    admins: [req.user._id],
  });

  const populated = await chat.populate("members", "name avatar isOnline");
  res.status(201).json({ success: true, data: populated });
});

// @desc  Get all chats for the logged-in user
// @route GET /api/chats
const getMyChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ members: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("members", "name avatar isOnline lastSeen")
    .populate({ path: "lastMessage", populate: { path: "sender", select: "name" } });
  res.json({ success: true, data: chats });
});

module.exports = { accessOneToOneChat, createGroupChat, getMyChats };
