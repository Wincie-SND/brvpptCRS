const mongoose = require("mongoose");

const tenantFilter = (req, extra = {}) => {
  if (req.user.role === "super_admin") return { ...extra };
  if (!req.user.tenant_id) return { ...extra };
  return { tenant_id: req.user.tenant_id, ...extra };
};

const requireTenantOwnership = (doc, req) => {
  if (req.user.role === "super_admin") return true;
  if (!doc || !doc.tenant_id || !req.user.tenant_id) return false;
  return String(doc.tenant_id) === String(req.user.tenant_id);
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = { tenantFilter, requireTenantOwnership, isValidObjectId };
