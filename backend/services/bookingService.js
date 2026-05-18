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
