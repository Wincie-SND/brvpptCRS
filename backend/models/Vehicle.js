const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Sedan", "SUV", "Van", "Pickup", "Luxury", "Hatchback"], required: true },
    transmission: { type: String, enum: ["Manual", "Automatic", "CVT", "DCT"], required: true },
    fuel_type: { type: String, enum: ["Gasoline", "Diesel", "Hybrid", "Electric"], required: true },
    daily_rate: { type: Number, required: true, min: 1, index: true },
    availability: { type: String, enum: ["available", "booked", "maintenance", "disabled"], default: "available", index: true },
    images: [{ type: String }],
    plate_number: { type: String, required: true, uppercase: true, trim: true, index: true }
  },
  { timestamps: true }
);

vehicleSchema.index({ tenant_id: 1, plate_number: 1 }, { unique: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);
