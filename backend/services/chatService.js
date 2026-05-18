const Chat = require("../models/Chat");
const Message = require("../models/Message");

const assertChatAccess = (chat, user) => {
  if (user.role === "super_admin") throw new Error("Super admin cannot access private tenant-customer messages.");
  if (user.role === "renter" && String(chat.renter_id) !== String(user._id)) throw new Error("Chat access denied.");
  if (user.role !== "renter" && String(chat.tenant_id) !== String(user.tenant_id)) throw new Error("Chat access denied.");
};

const createOrGetChat = async ({ tenant_id, renter_id, booking_id, assigned_staff = null }) => {
  let chat = await Chat.findOne({ tenant_id, renter_id, booking_id: booking_id || null });
  if (!chat) {
    chat = await Chat.create({ tenant_id, renter_id, booking_id: booking_id || null, assigned_staff });
  }
  return chat;
};

const persistMessage = async ({ chat, sender_id, message, attachments = [] }) => {
  const saved = await Message.create({ chat_id: chat._id, sender_id, message, attachments });
  chat.last_message = message || (attachments.length ? "Attachment" : "");
  chat.unread_count += 1;
  await chat.save();
  return saved;
};

module.exports = { assertChatAccess, createOrGetChat, persistMessage };
