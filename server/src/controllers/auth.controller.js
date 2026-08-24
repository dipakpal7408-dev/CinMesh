const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { isValidEmail, isStrongEnoughPassword } = require("../utils/validators");

// @desc  Register a new student
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, college, branch, year } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }
  if (!isStrongEnoughPassword(password)) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, college, branch, year });

  res.status(201).json({
    success: true,
    data: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @desc  Login
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  user.isOnline = true;
  await user.save();

  res.json({
    success: true,
    data: user.toSafeObject(),
    token: generateToken(user._id),
  });
});

// @desc  Get current logged-in user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @desc  Logout (client should also discard token)
// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: new Date() });
  res.json({ success: true, message: "Logged out" });
});

module.exports = { register, login, getMe, logout };
