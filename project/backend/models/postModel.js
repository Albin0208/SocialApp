import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Content is required."],
    trim: true,
    minLength: [1, "Content must be at least 3 characters long."],
    maxLength: [140, "Content can't be longer than 140 characters."]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required."],
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;