const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const generateToken = require("../utils/generateToken");

const registerRenter = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required.");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email already exists.");
  }

  const user = await User.create({ name, email, password, role: "renter" });
  res.status(201).json({
    success: true,
    token: generateToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, tenant_key, admin_secret_key } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || user.isDisabled || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (["tenant_admin", "tenant_staff"].includes(user.role)) {
    if (!tenant_key) {
      res.status(400);
      throw new Error("Tenant key is required.");
    }
    const tenant = await Tenant.findOne({ tenant_key: tenant_key.toUpperCase(), isActive: true });
    if (!tenant || String(tenant._id) !== String(user.tenant_id)) {
      res.status(401);
      throw new Error("Invalid tenant key.");
    }
  }

  if (user.role === "super_admin") {
    if (admin_secret_key !== process.env.ADMIN_SECRET_KEY) {
      res.status(401);
      throw new Error("Invalid admin secret key.");
    }
  }

  res.json({
    success: true,
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id
    }
  });
});

const adminVerify = asyncHandler(async (req, res) => {
  const { admin_secret_key } = req.body;
  if (admin_secret_key !== process.env.ADMIN_SECRET_KEY) {
    res.status(401);
    throw new Error("Invalid admin secret key.");
  }
  res.json({ success: true, message: "Admin key verified." });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { registerRenter, login, adminVerify, me };
