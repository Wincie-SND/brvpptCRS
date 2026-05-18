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
