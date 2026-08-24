/**
 * Notifications are pushed server-side from controllers/services via
 * notification.service.js#createNotification, which already knows how
 * to reach a specific online user through `onlineUsers`. This file is
 * kept as the place to add any notification-specific *incoming* socket
 * events in the future (e.g. marking as read in realtime).
 */
const registerNotificationHandlers = (io, socket, onlineUsers) => {
  socket.on("notification:markRead", ({ notificationId }) => {
    // Placeholder for future realtime read-state sync across devices
    socket.broadcast.emit("notification:read", { notificationId });
  });
};

module.exports = { registerNotificationHandlers };
