const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// @desc  Get my notifications
// @route GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "name avatar")
    .populate("post", "content")
    .populate("community", "name slug");
  res.json({ success: true, data: notifications });
});

// @desc  Mark a notification (or all) as read
// @route PUT /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  if (req.params.id === "all") {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    return res.json({ success: true, message: "All notifications marked as read" });
  }
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notif) {
    res.status(404);
    throw new Error("Notification not found");
  }
  res.json({ success: true, data: notif });
});

module.exports = { getNotifications, markAsRead };
