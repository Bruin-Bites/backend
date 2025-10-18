const { Schema, model } = require("mongoose");

//schema for community posts.
const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous Bruin",
    },
    tag: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = model("Post", PostSchema);
