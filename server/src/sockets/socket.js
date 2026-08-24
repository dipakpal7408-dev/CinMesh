const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const { registerChatHandlers } = require("./chat.socket");
const { registerNotificationHandlers } = require("./notification.socket");

// userId -> socketId, shared with controllers via app.set("onlineUsers", ...)
const onlineUsers = new Map();

const initSocket = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    },
  });

  app.set("io", io);
  app.set("onlineUsers", onlineUsers);

  // Authenticate every socket connection using the JWT sent from the client
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error: no token"));
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    onlineUsers.set(String(userId), socket.id);

    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit("presence:update", { userId, isOnline: true });

    registerChatHandlers(io, socket, onlineUsers);
    registerNotificationHandlers(io, socket, onlineUsers);

    socket.on("disconnect", async () => {
      onlineUsers.delete(String(userId));
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit("presence:update", { userId, isOnline: false });
    });
  });

  return io;
};

module.exports = { initSocket, onlineUsers };
