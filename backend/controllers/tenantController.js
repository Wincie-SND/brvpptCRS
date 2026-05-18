const asyncHandler = require("express-async-handler");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const { tenantAnalytics } = require("../services/analyticsService");

const getMyTenant = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenant_id);
  res.json({ success: true, tenant });
});

const getDashboard = asyncHandler(async (req, res) => {
  const analytics = await tenantAnalytics(req.user.tenant_id);
  res.json({ success: true, analytics });
});

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["tenant_admin", "tenant_staff"].includes(role)) {
    res.status(400);
    throw new Error("Invalid tenant staff role.");
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    tenant_id: req.user.tenant_id,
    driver_license_status: "n/a"
  });
  res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

module.exports = { getMyTenant, getDashboard, createStaff };
