const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
