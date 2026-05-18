const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    renter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assigned_staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null, index: true },
    last_message: { type: String, default: "" },
    unread_count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

chatSchema.index({ tenant_id: 1, renter_id: 1, booking_id: 1 });

module.exports = mongoose.model("Chat", chatSchema);
