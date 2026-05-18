const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { requireActiveTenant } = require("../middleware/tenantMiddleware");
const { getMyTenant, getDashboard, createStaff } = require("../controllers/tenantController");

const router = express.Router();

router.get("/me", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, getMyTenant);
router.get("/dashboard", protect, authorize("tenant_admin", "tenant_staff"), requireActiveTenant, getDashboard);
router.post("/staff", protect, authorize("tenant_admin"), requireActiveTenant, createStaff);

module.exports = router;
