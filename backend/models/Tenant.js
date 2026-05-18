const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    tenant_name: { type: String, required: true, trim: true, index: true },
    tenant_key: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    business_email: { type: String, required: true, lowercase: true, trim: true },
    subscription_plan: { type: String, enum: ["Starter", "Professional", "Enterprise"], default: "Starter" },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);
