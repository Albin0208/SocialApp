import express from "express";
import router from "./router.js";
import { closeDB } from "./database.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5500",
}));

app.use(express.json());

app.use(router);
// Use the router middleware

/**
 * Returns a server and executes the callback when the server is running.
 *
 * @param {Object} config - Server configuration
 * @param {Object} callback - Optional callback function
 * @returns {Promise}
 */
function startServer(config, callback) {
  // This server takes on config argument which could
  // things such as what port to use and database configs.
  const port = config.port;
  return app.listen(port, () => {
    callback && callback();
  });
}

// Close the database connection after 2 seconds.
// setTimeout(closeDB, 2000); // This causes error when running in production, but is needed for testing.

export { startServer };
