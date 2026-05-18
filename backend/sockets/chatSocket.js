const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { assertChatAccess, persistMessage } = require("../services/chatService");

const configureChatSocket = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Socket auth token missing."));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user || user.isDisabled) return next(new Error("Invalid socket user."));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed."));
    }
  });

  chatNamespace.on("connection", (socket) => {
    socket.on("join_room", async ({ chat_id }) => {
      const chat = await Chat.findById(chat_id);
      if (!chat) return socket.emit("socket_error", "Chat not found.");
      try {
        assertChatAccess(chat, socket.user);
        socket.join(`chat:${chat._id}`);
        if (socket.user.tenant_id) socket.join(`tenant:${socket.user.tenant_id}`);
        socket.emit("joined_room", { chat_id });
      } catch (error) {
        socket.emit("socket_error", error.message);
      }
    });

    socket.on("send_message", async ({ chat_id, message, attachments = [] }) => {
      const chat = await Chat.findById(chat_id);
      if (!chat) return socket.emit("socket_error", "Chat not found.");
      try {
        assertChatAccess(chat, socket.user);
        const saved = await persistMessage({ chat, sender_id: socket.user._id, message, attachments });
        const payload = {
          _id: saved._id,
          chat_id,
          sender_id: socket.user._id,
          sender_name: socket.user.name,
          message: saved.message,
          attachments: saved.attachments,
          seen: saved.seen,
          createdAt: saved.createdAt
        };
        chatNamespace.to(`chat:${chat_id}`).emit("receive_message", payload);
      } catch (error) {
        socket.emit("socket_error", error.message);
      }
    });

    socket.on("typing", ({ chat_id, isTyping }) => {
      socket.to(`chat:${chat_id}`).emit("typing", {
        chat_id,
        user_id: socket.user._id,
        name: socket.user.name,
        isTyping: Boolean(isTyping)
      });
    });

    socket.on("message_seen", async ({ chat_id }) => {
      await Message.updateMany({ chat_id, sender_id: { $ne: socket.user._id } }, { seen: true });
      const chat = await Chat.findById(chat_id);
      if (chat) {
        chat.unread_count = 0;
        await chat.save();
      }
      socket.to(`chat:${chat_id}`).emit("message_seen", { chat_id, seen_by: socket.user._id });
    });
  });
};

module.exports = configureChatSocket;
