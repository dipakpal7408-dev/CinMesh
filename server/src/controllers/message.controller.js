const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { uploadBuffer } = require("../services/upload.service");

// @desc  Send a message (also emitted over socket by the client after this call,
//        or you can emit server-side here — see sockets/chat.socket.js for the realtime path)
// @route POST /api/messages
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || (!text && !req.file)) {
    res.status(400);
    throw new Error("chatId and text or attachment are required");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }
  if (!chat.members.some((m) => String(m) === String(req.user._id))) {
    res.status(403);
    throw new Error("You are not a member of this chat");
  }

  let attachment;
  if (req.file) {
    const result = await uploadBuffer(req.file.buffer, "cinmesh/chat");
    attachment = {
      url: result.secure_url,
      publicId: result.public_id,
      type: req.file.mimetype.startsWith("image") ? "image" : "file",
      name: req.file.originalname,
    };
  }

  const message = await Message.create({
    chat: chatId,
    sender: req.user._id,
    text: text || "",
    attachment,
    deliveredTo: [req.user._id],
    seenBy: [req.user._id],
  });

  chat.lastMessage = message._id;
  await chat.save();

  const populated = await message.populate("sender", "name avatar");
  res.status(201).json({ success: true, data: populated });
});

// @desc  Get messages for a chat (paginated, oldest to newest within page)
// @route GET /api/messages/:chatId
const getMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }
  if (!chat.members.some((m) => String(m) === String(req.user._id))) {
    res.status(403);
    throw new Error("You are not a member of this chat");
  }

  const limit = Math.min(parseInt(req.query.limit) || 30, 100);
  const before = req.query.before ? new Date(req.query.before) : new Date();

  const messages = await Message.find({ chat: chat._id, createdAt: { $lt: before } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("sender", "name avatar");

  res.json({ success: true, data: messages.reverse() });
});

// @desc  Mark all messages in a chat as seen by current user
// @route PUT /api/messages/:chatId/seen
const markSeen = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { chat: req.params.chatId, seenBy: { $ne: req.user._id } },
    { $addToSet: { seenBy: req.user._id, deliveredTo: req.user._id } }
  );
  res.json({ success: true });
});

module.exports = { sendMessage, getMessages, markSeen };
