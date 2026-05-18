const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["renter", "tenant_admin", "tenant_staff", "super_admin"],
      default: "renter",
      index: true
    },
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", default: null, index: true },
    driver_license_status: { type: String, enum: ["pending", "verified", "rejected", "n/a"], default: "pending" },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: true },
    isDisabled: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
