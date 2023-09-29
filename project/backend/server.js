import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { connect } from "./database.js"; // Connect to the database
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/verifyJWT.js";

const app = express();
const port = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PATCH",
    credentials: true,
  })
);
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser())

// Mount API routes
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use(verifyJWT); // Protect all routes below this line


/**
 * Starts the server by connecting to the database and listening on the specified port.
 * @returns {Promise<import('http').Server>} The HTTP server instance.
 */
async function startServer() {
  await connect(); // Connect to the database
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { startServer };
