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
