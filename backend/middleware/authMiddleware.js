const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized. Missing token."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isDisabled) {
      res.status(401);
      return next(new Error("Not authorized. Invalid user session."));
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized. Token failed."));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("Forbidden. Insufficient role."));
  }
  next();
};

module.exports = { protect, authorize };
