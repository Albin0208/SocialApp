import express from "express";
import router from "./router.js";
import { closeDB } from "./database.js";

const app = express();
const port = 5000;

app.use(express.json());

// Use the router middleware
app.use(router);

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
setTimeout(closeDB, 2000);

export { startServer };
