const Message = require("../models/Message");
const Chat = require("../models/Chat");

/**
 * Registers all chat-related socket event handlers on a connected socket.
 */
const registerChatHandlers = (io, socket, onlineUsers) => {
  // Join a chat room so messages/typing events reach only its members
  socket.on("chat:join", (chatId) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on("chat:leave", (chatId) => {
    socket.leave(`chat:${chatId}`);
  });

  // Realtime message send (in addition to / instead of the REST endpoint)
  socket.on("message:send", async (payload, callback) => {
    try {
      const { chatId, text, senderId } = payload;
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.members.some((m) => String(m) === String(senderId))) {
        return callback?.({ success: false, message: "Not a member of this chat" });
      }

      const message = await Message.create({
        chat: chatId,
        sender: senderId,
        text,
        deliveredTo: [senderId],
        seenBy: [senderId],
      });
      chat.lastMessage = message._id;
      await chat.save();

      const populated = await message.populate("sender", "name avatar");

      io.to(`chat:${chatId}`).emit("message:new", populated);
      callback?.({ success: true, data: populated });
    } catch (err) {
      callback?.({ success: false, message: err.message });
    }
  });

  // Typing indicator
  socket.on("typing:start", ({ chatId, userId, userName }) => {
    socket.to(`chat:${chatId}`).emit("typing:start", { chatId, userId, userName });
  });

  socket.on("typing:stop", ({ chatId, userId }) => {
    socket.to(`chat:${chatId}`).emit("typing:stop", { chatId, userId });
  });

  // Seen receipts
  socket.on("message:seen", async ({ chatId, userId }) => {
    await Message.updateMany(
      { chat: chatId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId, deliveredTo: userId } }
    );
    socket.to(`chat:${chatId}`).emit("message:seen", { chatId, userId });
  });
};

module.exports = { registerChatHandlers };
