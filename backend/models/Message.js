const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, trim: true, default: "" },
    attachments: [{ type: String }],
    seen: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

messageSchema.index({ chat_id: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
