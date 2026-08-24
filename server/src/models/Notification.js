const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message", "community"],
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", default: null },
    text: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
