# Complete DriveLink Node.js Backend Source

## backend/server.js

```javascript
require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const configureChatSocket = require("./sockets/chatSocket");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map(origin => origin.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, service: "DriveLink Multi-Tenant Backend", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/admin", adminRoutes);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true
  }
});

configureChatSocket(io);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`DriveLink backend running on port ${PORT}`));

```

## backend/package.json

```json
{
  "name": "drivelink-backend",
  "version": "1.0.0",
  "description": "Multi-Tenant Car Rental Booking System with Chat Support backend",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedData.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.19.2",
    "express-async-handler": "^1.2.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.4",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}

```

## backend/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/drivelink_multi_tenant
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_SECRET_KEY=DX-ADMIN-9F2A
CLIENT_ORIGIN=http://127.0.0.1:5000
NODE_ENV=development

```

## backend/config/db.js

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

```

## backend/middleware/authMiddleware.js

```javascript
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

```

## backend/middleware/tenantMiddleware.js

```javascript
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

```

## backend/middleware/adminMiddleware.js

```javascript
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super_admin") {
    res.status(403);
    return next(new Error("Super admin access required."));
  }
  next();
};

module.exports = { requireSuperAdmin };

```

## backend/middleware/errorMiddleware.js

```javascript
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };

```

## backend/models/User.js

```javascript
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

```

## backend/models/Tenant.js

```javascript
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

```

## backend/models/Vehicle.js

```javascript
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

```

## backend/models/Booking.js

```javascript
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    renter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    pickup_date: { type: Date, required: true, index: true },
    return_date: { type: Date, required: true, index: true },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled", "rejected"],
      default: "pending",
      index: true
    },
    total_payment: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

bookingSchema.index({ tenant_id: 1, vehicle_id: 1, pickup_date: 1, return_date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);

```

## backend/models/Chat.js

```javascript
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    renter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assigned_staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null, index: true },
    last_message: { type: String, default: "" },
    unread_count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

chatSchema.index({ tenant_id: 1, renter_id: 1, booking_id: 1 });

module.exports = mongoose.model("Chat", chatSchema);

```

## backend/models/Message.js

```javascript
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true, index: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, trim: true, default: "" },
    attachments: [{ type: String }],
    seen: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

messageSchema.index({ chat_id: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);

```

## backend/controllers/authController.js

```javascript
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

```

## backend/controllers/vehicleController.js

```javascript
const asyncHandler = require("express-async-handler");
const Vehicle = require("../models/Vehicle");
const { tenantFilter, requireTenantOwnership } = require("../utils/tenantFilter");

const publicVehicles = asyncHandler(async (req, res) => {
  const { brand, category, transmission, maxPrice } = req.query;
  const query = { availability: "available" };
  if (brand) query.brand = new RegExp(brand, "i");
  if (category) query.category = category;
  if (transmission) query.transmission = transmission;
  if (maxPrice) query.daily_rate = { $lte: Number(maxPrice) };

  const vehicles = await Vehicle.find(query).populate("tenant_id", "tenant_name").sort({ createdAt: -1 });
  res.json({ success: true, count: vehicles.length, vehicles });
});

const tenantFleet = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find(tenantFilter(req)).sort({ createdAt: -1 });
  res.json({ success: true, count: vehicles.length, vehicles });
});

const createVehicle = asyncHandler(async (req, res) => {
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
  const vehicle = await Vehicle.create({
    ...req.body,
    tenant_id: req.user.tenant_id,
    images
  });
  res.status(201).json({ success: true, vehicle });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found.");
  }
  if (!requireTenantOwnership(vehicle, req)) {
    res.status(403);
    throw new Error("Tenant ownership validation failed.");
  }

  const images = req.files && req.files.length ? req.files.map(file => `/uploads/${file.filename}`) : vehicle.images;
  Object.assign(vehicle, req.body, { images });
  await vehicle.save();

  res.json({ success: true, vehicle });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found.");
  }
  if (!requireTenantOwnership(vehicle, req)) {
    res.status(403);
    throw new Error("Tenant ownership validation failed.");
  }
  await vehicle.deleteOne();
  res.json({ success: true, message: "Vehicle deleted." });
});

module.exports = { publicVehicles, tenantFleet, createVehicle, updateVehicle, deleteVehicle };

```

## backend/controllers/bookingController.js

```javascript
const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const { tenantFilter, requireTenantOwnership } = require("../utils/tenantFilter");
const { createBookingForVehicle, updateBookingStatusSafe } = require("../services/bookingService");

const createBooking = asyncHandler(async (req, res) => {
  const booking = await createBookingForVehicle({
    renter_id: req.user._id,
    vehicle_id: req.body.vehicle_id,
    pickup_date: req.body.pickup_date,
    return_date: req.body.return_date
  });
  res.status(201).json({ success: true, booking });
});

const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ renter_id: req.user._id })
    .populate("vehicle_id")
    .populate("tenant_id", "tenant_name")
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

const tenantBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find(tenantFilter(req))
    .populate("vehicle_id")
    .populate("renter_id", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found.");
  }
  if (!requireTenantOwnership(booking, req)) {
    res.status(403);
    throw new Error("Tenant ownership validation failed.");
  }
  const updated = await updateBookingStatusSafe(booking, req.body.booking_status);
  res.json({ success: true, booking: updated });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found.");
  }

  const isOwner = String(booking.renter_id) === String(req.user._id);
  const isTenantOwner = req.user.tenant_id && String(booking.tenant_id) === String(req.user.tenant_id);

  if (!isOwner && !isTenantOwner) {
    res.status(403);
    throw new Error("Booking access denied.");
  }

  const updated = await updateBookingStatusSafe(booking, "cancelled");
  res.json({ success: true, booking: updated });
});

module.exports = { createBooking, myBookings, tenantBookings, updateBookingStatus, cancelBooking };

```

## backend/controllers/chatController.js

```javascript
const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Booking = require("../models/Booking");
const { tenantFilter } = require("../utils/tenantFilter");
const { assertChatAccess, createOrGetChat, persistMessage } = require("../services/chatService");

const listChats = asyncHandler(async (req, res) => {
  if (req.user.role === "super_admin") {
    res.status(403);
    throw new Error("Super admin cannot access private tenant-customer messages.");
  }

  const query = req.user.role === "renter"
    ? { renter_id: req.user._id }
    : tenantFilter(req);

  const chats = await Chat.find(query)
    .populate("renter_id", "name email avatar")
    .populate("assigned_staff", "name email")
    .populate("booking_id")
    .sort({ updatedAt: -1 });

  res.json({ success: true, chats });
});

const getMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  assertChatAccess(chat, req.user);

  const messages = await Message.find({ chat_id: chat._id })
    .populate("sender_id", "name role avatar")
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
});

const startChat = asyncHandler(async (req, res) => {
  const { booking_id } = req.body;
  const booking = await Booking.findById(booking_id);
  if (!booking || String(booking.renter_id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Cannot start chat for this booking.");
  }

  const chat = await createOrGetChat({
    tenant_id: booking.tenant_id,
    renter_id: req.user._id,
    booking_id: booking._id
  });

  res.status(201).json({ success: true, chat });
});

const sendMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  assertChatAccess(chat, req.user);

  const attachments = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
  const message = await persistMessage({
    chat,
    sender_id: req.user._id,
    message: req.body.message,
    attachments
  });

  res.status(201).json({ success: true, message });
});

const assignStaff = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, tenant_id: req.user.tenant_id });
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found.");
  }
  chat.assigned_staff = req.body.staff_id;
  await chat.save();
  res.json({ success: true, chat });
});

module.exports = { listChats, getMessages, startChat, sendMessage, assignStaff };

```

## backend/controllers/tenantController.js

```javascript
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

```

## backend/controllers/adminController.js

```javascript
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

```

## backend/routes/authRoutes.js

```javascript
const express = require("express");
const { registerRenter, login, adminVerify, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerRenter);
router.post("/login", login);
router.post("/admin-verify", adminVerify);
router.get("/me", protect, me);

module.exports = router;

```

## backend/routes/vehicleRoutes.js

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireActiveTenant, tenantScopedBody } = require("../middleware/tenantMiddleware");
const { publicVehicles, tenantFleet, createVehicle, updateVehicle, deleteVehicle } = require("../controllers/vehicleController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});

const fileFilter = (req, file, cb) => {
  if (/image\/(jpeg|png|webp|jpg)/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image uploads are allowed."));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", publicVehicles);
router.get("/fleet", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, tenantFleet);
router.post("/", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, tenantScopedBody, upload.array("images", 6), createVehicle);
router.put("/:id", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, upload.array("images", 6), updateVehicle);
router.delete("/:id", protect, authorize("tenant_admin"), requireActiveTenant, deleteVehicle);

module.exports = router;

```

## backend/routes/bookingRoutes.js

```javascript
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireActiveTenant } = require("../middleware/tenantMiddleware");
const { createBooking, myBookings, tenantBookings, updateBookingStatus, cancelBooking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", protect, authorize("renter"), createBooking);
router.get("/my-bookings", protect, authorize("renter"), myBookings);
router.get("/tenant", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, tenantBookings);
router.patch("/:id/status", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, updateBookingStatus);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;

```

## backend/routes/chatRoutes.js

```javascript
const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect, authorize } = require("../middleware/authMiddleware");
const { listChats, getMessages, startChat, sendMessage, assignStaff } = require("../controllers/chatController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|png|webp|jpg)|application\/pdf/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported attachment type."));
  }
});

router.get("/", protect, listChats);
router.post("/", protect, authorize("renter"), startChat);
router.get("/:chatId/messages", protect, getMessages);
router.post("/:chatId/message", protect, upload.array("attachments", 5), sendMessage);
router.patch("/:chatId/assign", protect, authorize("tenant_admin"), assignStaff);

module.exports = router;

```

## backend/routes/tenantRoutes.js

```javascript
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireActiveTenant } = require("../middleware/tenantMiddleware");
const { getMyTenant, getDashboard, createStaff } = require("../controllers/tenantController");

const router = express.Router();

router.get("/me", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, getMyTenant);
router.get("/dashboard", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, getDashboard);
router.post("/staff", protect, authorize("tenant_admin"), requireActiveTenant, createStaff);

module.exports = router;

```

## backend/routes/adminRoutes.js

```javascript
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireSuperAdmin } = require("../middleware/adminMiddleware");
const { platformStats, listTenants, createTenant, setTenantStatus, userRegistry, setUserDisabled } = require("../controllers/adminController");

const router = express.Router();

router.use(protect, requireSuperAdmin);

router.get("/platform-stats", platformStats);
router.get("/tenants", listTenants);
router.post("/tenants", createTenant);
router.patch("/tenants/:id/status", setTenantStatus);
router.get("/users", userRegistry);
router.patch("/users/:id/disabled", setUserDisabled);

module.exports = router;

```

## backend/sockets/chatSocket.js

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { assertChatAccess, persistMessage } = require("../services/chatService");

const configureChatSocket = (io) => {
  const chatNamespace = io.of("/chat");

  chatNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Socket auth token missing."));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user || user.isDisabled) return next(new Error("Invalid socket user."));
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed."));
    }
  });

  chatNamespace.on("connection", (socket) => {
    socket.on("join_room", async ({ chat_id }) => {
      const chat = await Chat.findById(chat_id);
      if (!chat) return socket.emit("socket_error", "Chat not found.");
      try {
        assertChatAccess(chat, socket.user);
        socket.join(`chat:${chat._id}`);
        if (socket.user.tenant_id) socket.join(`tenant:${socket.user.tenant_id}`);
        socket.emit("joined_room", { chat_id });
      } catch (error) {
        socket.emit("socket_error", error.message);
      }
    });

    socket.on("send_message", async ({ chat_id, message, attachments = [] }) => {
      const chat = await Chat.findById(chat_id);
      if (!chat) return socket.emit("socket_error", "Chat not found.");
      try {
        assertChatAccess(chat, socket.user);
        const saved = await persistMessage({ chat, sender_id: socket.user._id, message, attachments });
        const payload = {
          _id: saved._id,
          chat_id,
          sender_id: socket.user._id,
          sender_name: socket.user.name,
          message: saved.message,
          attachments: saved.attachments,
          seen: saved.seen,
          createdAt: saved.createdAt
        };
        chatNamespace.to(`chat:${chat_id}`).emit("receive_message", payload);
      } catch (error) {
        socket.emit("socket_error", error.message);
      }
    });

    socket.on("typing", ({ chat_id, isTyping }) => {
      socket.to(`chat:${chat_id}`).emit("typing", {
        chat_id,
        user_id: socket.user._id,
        name: socket.user.name,
        isTyping: Boolean(isTyping)
      });
    });

    socket.on("message_seen", async ({ chat_id }) => {
      await Message.updateMany({ chat_id, sender_id: { $ne: socket.user._id } }, { seen: true });
      const chat = await Chat.findById(chat_id);
      if (chat) {
        chat.unread_count = 0;
        await chat.save();
      }
      socket.to(`chat:${chat_id}`).emit("message_seen", { chat_id, seen_by: socket.user._id });
    });
  });
};

module.exports = configureChatSocket;

```

## backend/utils/generateToken.js

```javascript
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tenant_id: user.tenant_id || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;

```

## backend/utils/tenantFilter.js

```javascript
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

```

## backend/utils/seedData.js

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const seed = async () => {
  await connectDB();

  await Promise.all([
    Tenant.deleteMany(),
    User.deleteMany(),
    Vehicle.deleteMany(),
    Booking.deleteMany(),
    Chat.deleteMany(),
    Message.deleteMany()
  ]);

  const tenants = await Tenant.insertMany([
    { tenant_name: "Horizon Car Rentals", tenant_key: "HORIZON", business_email: "admin@horizon.com", subscription_plan: "Enterprise" },
    { tenant_name: "MetroGlide PH", tenant_key: "METROGLIDE", business_email: "admin@metroglide.com", subscription_plan: "Professional" },
    { tenant_name: "VelocityDrive", tenant_key: "VELOCITY", business_email: "admin@velocitydrive.com", subscription_plan: "Starter" }
  ]);

  const [horizon, metro, velocity] = tenants;

  const users = await User.create([
    { name: "Maria Santos", email: "maria@email.com", password: "test123", role: "renter", driver_license_status: "verified", avatar: "MS" },
    { name: "Juan Reyes", email: "juan@email.com", password: "test123", role: "renter", driver_license_status: "pending", avatar: "JR" },
    { name: "Carlos Mendoza", email: "carlos@horizon.com", password: "horizon123", role: "tenant_admin", tenant_id: horizon._id, driver_license_status: "n/a", avatar: "CM" },
    { name: "Ryan Lim", email: "ryan@metroglide.com", password: "metro123", role: "tenant_admin", tenant_id: metro._id, driver_license_status: "n/a", avatar: "RL" },
    { name: "Vera Cruz", email: "vera@velocitydrive.com", password: "velocity123", role: "tenant_admin", tenant_id: velocity._id, driver_license_status: "n/a", avatar: "VC" },
    { name: "Admin Root", email: "admin@drivelink.io", password: "superadmin999", role: "super_admin", driver_license_status: "n/a", avatar: "AR" }
  ]);

  const [maria, juan] = users;

  const vehicles = await Vehicle.insertMany([
    { tenant_id: horizon._id, brand: "Toyota", model: "Fortuner", category: "SUV", transmission: "Automatic", fuel_type: "Diesel", daily_rate: 4500, plate_number: "HRZ-001", availability: "available" },
    { tenant_id: horizon._id, brand: "Honda", model: "Civic", category: "Sedan", transmission: "Automatic", fuel_type: "Gasoline", daily_rate: 2800, plate_number: "HRZ-002", availability: "available" },
    { tenant_id: metro._id, brand: "Toyota", model: "Vios", category: "Sedan", transmission: "Automatic", fuel_type: "Gasoline", daily_rate: 2200, plate_number: "MTG-001", availability: "available" },
    { tenant_id: metro._id, brand: "Honda", model: "BR-V", category: "SUV", transmission: "CVT", fuel_type: "Gasoline", daily_rate: 2900, plate_number: "MTG-002", availability: "available" },
    { tenant_id: velocity._id, brand: "Ford", model: "Ranger", category: "Pickup", transmission: "Automatic", fuel_type: "Diesel", daily_rate: 4200, plate_number: "VLD-001", availability: "available" }
  ]);

  const booking = await Booking.create({
    renter_id: maria._id,
    tenant_id: horizon._id,
    vehicle_id: vehicles[0]._id,
    pickup_date: new Date("2026-06-01"),
    return_date: new Date("2026-06-04"),
    booking_status: "confirmed",
    total_payment: 13500
  });

  const chat = await Chat.create({
    tenant_id: horizon._id,
    renter_id: maria._id,
    booking_id: booking._id,
    last_message: "Is the Fortuner ready for pickup?",
    unread_count: 1
  });

  await Message.create({
    chat_id: chat._id,
    sender_id: maria._id,
    message: "Is the Fortuner ready for pickup?",
    seen: false
  });

  console.log("Seed complete.");
  console.log("Renter: maria@email.com / test123");
  console.log("Tenant Horizon: carlos@horizon.com / horizon123 / HORIZON");
  console.log("Tenant MetroGlide: ryan@metroglide.com / metro123 / METROGLIDE");
  console.log("Admin: admin@drivelink.io / superadmin999 / DX-ADMIN-9F2A");

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});

```

## backend/services/bookingService.js

```javascript
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

const dayMs = 1000 * 60 * 60 * 24;

const calculateDays = (pickup, ret) => {
  const pickupDate = new Date(pickup);
  const returnDate = new Date(ret);
  const diff = Math.ceil((returnDate - pickupDate) / dayMs);
  if (diff <= 0) throw new Error("Return date must be after pickup date.");
  return diff;
};

const assertVehicleAvailable = async (vehicleId, pickupDate, returnDate) => {
  const conflict = await Booking.findOne({
    vehicle_id: vehicleId,
    booking_status: { $in: ["pending", "confirmed", "active"] },
    pickup_date: { $lt: new Date(returnDate) },
    return_date: { $gt: new Date(pickupDate) }
  });
  if (conflict) throw new Error("Vehicle is already booked for the selected dates.");
};

const createBookingForVehicle = async ({ renter_id, vehicle_id, pickup_date, return_date }) => {
  const vehicle = await Vehicle.findById(vehicle_id);
  if (!vehicle || vehicle.availability === "disabled" || vehicle.availability === "maintenance") {
    throw new Error("Vehicle is not available.");
  }

  await assertVehicleAvailable(vehicle_id, pickup_date, return_date);
  const totalDays = calculateDays(pickup_date, return_date);

  return Booking.create({
    renter_id,
    tenant_id: vehicle.tenant_id,
    vehicle_id,
    pickup_date,
    return_date,
    total_payment: totalDays * vehicle.daily_rate
  });
};

const updateBookingStatusSafe = async (booking, nextStatus) => {
  const allowed = {
    pending: ["confirmed", "cancelled", "rejected"],
    confirmed: ["active", "cancelled"],
    active: ["completed"],
    completed: [],
    cancelled: [],
    rejected: []
  };

  if (!allowed[booking.booking_status].includes(nextStatus)) {
    throw new Error(`Invalid booking status transition: ${booking.booking_status} to ${nextStatus}`);
  }

  booking.booking_status = nextStatus;
  await booking.save();

  if (["confirmed", "active"].includes(nextStatus)) {
    await Vehicle.findByIdAndUpdate(booking.vehicle_id, { availability: "booked" });
  }

  if (["completed", "cancelled", "rejected"].includes(nextStatus)) {
    await Vehicle.findByIdAndUpdate(booking.vehicle_id, { availability: "available" });
  }

  return booking;
};

module.exports = { calculateDays, assertVehicleAvailable, createBookingForVehicle, updateBookingStatusSafe };

```

## backend/services/chatService.js

```javascript
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const assertChatAccess = (chat, user) => {
  if (user.role === "super_admin") throw new Error("Super admin cannot access private tenant-customer messages.");
  if (user.role === "renter" && String(chat.renter_id) !== String(user._id)) throw new Error("Chat access denied.");
  if (user.role !== "renter" && String(chat.tenant_id) !== String(user.tenant_id)) throw new Error("Chat access denied.");
};

const createOrGetChat = async ({ tenant_id, renter_id, booking_id, assigned_staff = null }) => {
  let chat = await Chat.findOne({ tenant_id, renter_id, booking_id: booking_id || null });
  if (!chat) {
    chat = await Chat.create({ tenant_id, renter_id, booking_id: booking_id || null, assigned_staff });
  }
  return chat;
};

const persistMessage = async ({ chat, sender_id, message, attachments = [] }) => {
  const saved = await Message.create({ chat_id: chat._id, sender_id, message, attachments });
  chat.last_message = message || (attachments.length ? "Attachment" : "");
  chat.unread_count += 1;
  await chat.save();
  return saved;
};

module.exports = { assertChatAccess, createOrGetChat, persistMessage };

```

## backend/services/analyticsService.js

```javascript
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Tenant = require("../models/Tenant");
const User = require("../models/User");

const tenantAnalytics = async (tenantId) => {
  const [bookings, vehicles] = await Promise.all([
    Booking.find({ tenant_id: tenantId }).lean(),
    Vehicle.find({ tenant_id: tenantId }).lean()
  ]);

  const revenue = bookings
    .filter(b => !["cancelled", "rejected"].includes(b.booking_status))
    .reduce((sum, b) => sum + b.total_payment, 0);

  const activeRentals = bookings.filter(b => b.booking_status === "active").length;
  const availableVehicles = vehicles.filter(v => v.availability === "available").length;

  return {
    totalBookings: bookings.length,
    revenue,
    activeRentals,
    totalFleet: vehicles.length,
    availableVehicles,
    fleetUtilization: vehicles.length ? Math.round(((vehicles.length - availableVehicles) / vehicles.length) * 100) : 0
  };
};

const platformAnalytics = async () => {
  const [tenants, users, vehicles, bookings] = await Promise.all([
    Tenant.countDocuments(),
    User.countDocuments(),
    Vehicle.countDocuments(),
    Booking.find().lean()
  ]);

  const revenue = bookings
    .filter(b => !["cancelled", "rejected"].includes(b.booking_status))
    .reduce((sum, b) => sum + b.total_payment, 0);

  return {
    tenants,
    users,
    vehicles,
    bookings: bookings.length,
    marketplaceRevenue: revenue
  };
};

module.exports = { tenantAnalytics, platformAnalytics };

```
