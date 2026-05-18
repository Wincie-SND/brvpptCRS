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
