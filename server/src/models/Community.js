const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, maxlength: 500, default: "" },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "EE", "ME", "CE", "IT", "General"],
      default: "General",
    },
    category: {
      type: String,
      enum: [
        "DSA",
        "Web Development",
        "AI/ML",
        "GATE",
        "Placements",
        "Internships",
        "Projects",
        "College-specific",
        "General",
      ],
      default: "General",
    },
    coverImage: { type: String, default: "" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);
