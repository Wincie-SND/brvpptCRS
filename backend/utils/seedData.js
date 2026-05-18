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
