const Notification = require("../models/Notification");

/**
 * Creates a notification and emits it in realtime if the recipient is online.
 * `getIO` is a lazy getter to avoid circular requires with sockets/socket.js
 */
const createNotification = async ({ recipient, sender, type, post = null, community = null, text = "" }, io, onlineUsers) => {
  if (String(recipient) === String(sender)) return null; // don't notify yourself

  const notification = await Notification.create({ recipient, sender, type, post, community, text });
  const populated = await notification.populate("sender", "name avatar");

  if (io && onlineUsers) {
    const socketId = onlineUsers.get(String(recipient));
    if (socketId) {
      io.to(socketId).emit("notification:new", populated);
    }
  }

  return populated;
};

module.exports = { createNotification };
