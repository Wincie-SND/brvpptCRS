const express = require("express");
const { registerRenter, login, adminVerify, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerRenter);
router.post("/login", login);
router.post("/admin-verify", adminVerify);
router.get("/me", protect, me);

module.exports = router;
