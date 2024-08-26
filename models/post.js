const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", Post);
