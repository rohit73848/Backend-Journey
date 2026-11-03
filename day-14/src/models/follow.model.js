const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Follower is required"],
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Following is required"],
    },
  },
  {
    timestamps: true,
  },
);
const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;
