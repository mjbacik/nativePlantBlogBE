const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Blog = new Schema(
  {
    headerImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    blogPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Blog", Blog);
