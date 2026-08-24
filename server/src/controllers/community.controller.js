const asyncHandler = require("express-async-handler");
const Community = require("../models/Community");
const User = require("../models/User");

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// @desc  List / search communities
// @route GET /api/communities?branch=&category=&q=
const listCommunities = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branch) filter.branch = req.query.branch;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.q) filter.name = { $regex: req.query.q, $options: "i" };

  const communities = await Community.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: communities });
});

// @desc  Get a single community by slug
// @route GET /api/communities/:slug
const getCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findOne({ slug: req.params.slug }).populate(
    "members",
    "name avatar branch"
  );
  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }
  res.json({ success: true, data: community });
});

// @desc  Create a community
// @route POST /api/communities
const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, branch, category } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Community name is required");
  }

  const slug = slugify(name);
  const exists = await Community.findOne({ slug });
  if (exists) {
    res.status(400);
    throw new Error("A community with a similar name already exists");
  }

  const community = await Community.create({
    name,
    slug,
    description,
    branch,
    category,
    createdBy: req.user._id,
    members: [req.user._id],
    moderators: [req.user._id],
  });

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { communities: community._id } });

  res.status(201).json({ success: true, data: community });
});

// @desc  Join / leave a community
// @route POST /api/communities/:id/join
const toggleMembership = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id);
  if (!community) {
    res.status(404);
    throw new Error("Community not found");
  }

  const isMember = community.members.some((m) => String(m) === String(req.user._id));

  if (isMember) {
    community.members = community.members.filter((m) => String(m) !== String(req.user._id));
    await User.findByIdAndUpdate(req.user._id, { $pull: { communities: community._id } });
  } else {
    community.members.push(req.user._id);
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { communities: community._id } });
  }

  await community.save();
  res.json({ success: true, joined: !isMember, memberCount: community.members.length });
});

module.exports = { listCommunities, getCommunity, createCommunity, toggleMembership };
