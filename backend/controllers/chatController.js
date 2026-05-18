const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Booking = require("../models/Booking");
const { tenantFilter } = require("../utils/tenantFilter");
const { assertChatAccess, createOrGetChat, persistMessage } = require("../services/chatService");

const listChats = asyncHandler(async (req, res) => {
  if (req.user.role === "super_admin") {
    res.status(403);
    throw new Error("Super admin cannot access private tenant-customer messages.");
  }

  const query = req.user.role === "renter"
    ? { renter_id: req.user._id }
    : tenantFilter(req);

  const chats = await Chat.find(query)
    .populate("renter_id", "name email avatar")
    .populate("assigned_staff", "name email")
    .populate("booking_id")
    .sort({ updatedAt: -1 });

  res.json({ success: true, chats });
});

const getMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  assertChatAccess(chat, req.user);

  const messages = await Message.find({ chat_id: chat._id })
    .populate("sender_id", "name role avatar")
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

const startChat = asyncHandler(async (req, res) => {
  const { booking_id } = req.body;
  const booking = await Booking.findById(booking_id);
  if (!booking || String(booking.renter_id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Cannot start chat for this booking.");
  }

  const chat = await createOrGetChat({
    tenant_id: booking.tenant_id,
    renter_id: req.user._id,
    booking_id: booking._id
  });

  res.status(201).json({ success: true, chat });
});

const sendMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  assertChatAccess(chat, req.user);

  const attachments = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
  const message = await persistMessage({
    chat,
    sender_id: req.user._id,
    message: req.body.message,
    attachments
  });

  res.status(201).json({ success: true, message });
});

const assignStaff = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, tenant_id: req.user.tenant_id });
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  chat.assigned_staff = req.body.staff_id;
  await chat.save();
  res.json({ success: true, chat });
});

module.exports = { listChats, getMessages, startChat, sendMessage, assignStaff };
