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
