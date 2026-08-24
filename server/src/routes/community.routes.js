const express = require("express");
const {
  listCommunities,
  getCommunity,
  createCommunity,
  toggleMembership,
} = require("../controllers/community.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", protect, listCommunities);
router.post("/", protect, createCommunity);
router.get("/:slug", protect, getCommunity);
router.post("/:id/join", protect, toggleMembership);

module.exports = router;
