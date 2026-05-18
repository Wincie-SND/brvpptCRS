const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    renter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    pickup_date: { type: Date, required: true, index: true },
    return_date: { type: Date, required: true, index: true },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled", "rejected"],
      default: "pending",
      index: true
    },
    total_payment: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

bookingSchema.index({ tenant_id: 1, vehicle_id: 1, pickup_date: 1, return_date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
