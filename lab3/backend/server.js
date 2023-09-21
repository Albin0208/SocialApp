import express from "express";
import router from "./router.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: "GET,POST,PATCH",
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

export { startServer };
