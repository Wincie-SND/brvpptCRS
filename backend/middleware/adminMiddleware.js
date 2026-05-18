const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    res.status(403);
    return next(new Error("Super admin access required."));
  }
  next();
};

module.exports = { requireSuperAdmin };
