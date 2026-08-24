const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    college: { type: String, default: "" },
    branch: {
      type: String,
      enum: ["CSE", "ECE", "EE", "ME", "CE", "IT", "Other", ""],
      default: "",
    },
    year: { type: Number, min: 1, max: 5 },
    bio: { type: String, maxlength: 280, default: "" },
    skills: [{ type: String, trim: true }],
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
    isEmailVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
