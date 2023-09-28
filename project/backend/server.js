import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { connect } from "./database.js"; // Connect to the database

const app = express();
const port = 5000;

// Middleware
app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    methods: "GET, POST, PATCH",
  })
);
app.use(express.json());

// Mount API routes
app.use("/user", userRoutes);

// Connect to the database and start the server
async function startServer() {
  await connect(); // Connect to the database
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Start the server
// startServer();

export { startServer };
