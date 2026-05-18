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
