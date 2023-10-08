import fs from "fs";
import crypto from "crypto";
import { exec } from "child_process";

const ENV_FILE_PATH = "./backend/.env";

/**
 * Generates a random secret string using the crypto module.
 * @returns {string} A random secret string.
 */
function generateSecret() {
  return crypto.randomBytes(64).toString("hex");
}

/**
 * Sets up the environment by generating secrets and creating a .env file if it doesn't exist.
 */
function setupEnvironment() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    try {
      // Generate secrets
      const ACCESS_TOKEN_SECRET = generateSecret();
      const REFRESH_TOKEN_SECRET = generateSecret();

      // Create .env file content
      const envContent = `
        ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
        REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      `;

      // Write content to .env file
      fs.writeFileSync(ENV_FILE_PATH, envContent);
      console.log("Generated .env file with secrets.");
    } catch (error) {
      console.error(`Error generating .env file: ${error.message}`);
      return;
    }
  } else {
    console.error("Error generating .env file: file already exists.");
  }
}

/**
 * Starts the frontend and backend servers.
 */
function startServers() {
  try {
    // Start backend server
    console.log("Starting backend server...");
    exec("cd backend && npm start");

    // Start frontend server
    console.log("Starting frontend server...");
    exec("cd frontend && npm start");
  } catch (error) {
    console.error(`Error starting servers: ${error.message}`);
  }
}

/**
 * Main function that checks the command line arguments and calls the appropriate function.
 */
function main() {
  if (process.argv.includes("--generate-env")) {
    setupEnvironment();
  } else if (process.argv.includes("--start-servers")) {
    startServers();
  } else {
    console.error("Error: no arguments specified.");
  }
}

main();
