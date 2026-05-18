const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect, authorize } = require("../middleware/authMiddleware");
const { listChats, getMessages, startChat, sendMessage, assignStaff } = require("../controllers/chatController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|png|webp|jpg)|application\/pdf/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported attachment type."));
  }
});

router.get("/", protect, listChats);
router.post("/", protect, authorize("renter"), startChat);
router.get("/:chatId/messages", protect, getMessages);
router.post("/:chatId/message", protect, upload.array("attachments", 5), sendMessage);
router.patch("/:chatId/assign", protect, authorize("tenant_admin"), assignStaff);

module.exports = router;
