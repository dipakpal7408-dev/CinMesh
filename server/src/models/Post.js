const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 3000 },
    media: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ["image", "video"], default: "image" },
      },
    ],
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", default: null },
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    isReported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ content: "text", tags: 1 });

module.exports = mongoose.model("Post", postSchema);
