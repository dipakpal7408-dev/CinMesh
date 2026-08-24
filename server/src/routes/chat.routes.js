const express = require("express");
const { accessOneToOneChat, createGroupChat, getMyChats } = require("../controllers/chat.controller");
const { sendMessage, getMessages, markSeen } = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", protect, getMyChats);
router.post("/one-to-one", protect, accessOneToOneChat);
router.post("/group", protect, createGroupChat);

router.get("/:chatId/messages", protect, getMessages);
router.put("/:chatId/seen", protect, markSeen);

module.exports = router;
