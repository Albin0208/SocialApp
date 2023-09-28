import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscore."],
    minLength: [3, "Username must be at least 3 characters long."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
