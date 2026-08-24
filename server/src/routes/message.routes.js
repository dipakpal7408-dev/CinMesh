const express = require("express");
const { sendMessage } = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.post("/", protect, upload.single("attachment"), sendMessage);

module.exports = router;
