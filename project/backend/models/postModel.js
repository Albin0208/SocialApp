import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: [true, "Title is required."],
  //   trim: true,
  //   minLength: [3, "Title must be at least 3 characters long."],
  // },
  content: {
    type: String,
    required: [true, "Content is required."],
    trim: true,
    minLength: [3, "Content must be at least 3 characters long."],
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