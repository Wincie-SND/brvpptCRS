const Tenant = require("../models/Tenant");

const requireActiveTenant = async (req, res, next) => {
  if (req.user.role === "super_admin" || req.user.role === "renter") return next();

  if (!req.user.tenant_id) {
    res.status(403);
    return next(new Error("Tenant account is missing tenant_id."));
  }

  const tenant = await Tenant.findById(req.user.tenant_id);
  if (!tenant || !tenant.isActive) {
    res.status(403);
    return next(new Error("Tenant is inactive or not found."));
  }

  req.tenant = tenant;
  next();
};

const tenantScopedBody = (req, res, next) => {
  if (req.user && req.user.role !== "super_admin" && req.user.tenant_id) {
    req.body.tenant_id = req.user.tenant_id;
  }
  next();
};

module.exports = { requireActiveTenant, tenantScopedBody };
