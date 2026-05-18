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
