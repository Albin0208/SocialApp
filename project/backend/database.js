import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/tdp013";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Database connection error:", error);
  process.exit(1); // Exit the application on database connection error
});

db.once("open", () => {
  console.log("Connected to the database");
});

export default db;
