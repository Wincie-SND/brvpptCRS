const asyncHandler = require("express-async-handler");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const { platformAnalytics } = require("../services/analyticsService");

const platformStats = asyncHandler(async (req, res) => {
  const analytics = await platformAnalytics();
  res.json({ success: true, analytics });
});

const listTenants = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().sort({ createdAt: -1 });
  res.json({ success: true, tenants });
});

const createTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.create(req.body);
  res.status(201).json({ success: true, tenant });
});

const setTenantStatus = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true, runValidators: true }
  );
  if (!tenant) {
    res.status(404);
    throw new Error("Tenant not found.");
  }
  res.json({ success: true, tenant });
});

const userRegistry = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("tenant_id", "tenant_name").sort({ createdAt: -1 });
  res.json({ success: true, users });
});

const setUserDisabled = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDisabled: req.body.isDisabled },
    { new: true }
  ).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }
  res.json({ success: true, user });
});

module.exports = { platformStats, listTenants, createTenant, setTenantStatus, userRegistry, setUserDisabled };
