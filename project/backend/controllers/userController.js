import User from "../models/userModel.js";
import { comparePasswords, hashPassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The newly created user object.
 */
export const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.status(400).json({ error: "Username is required." });

    if (!req.body.password)
      return res.status(400).json({ error: "Password is required." });
    const password = hashPassword(req.body.password);

    const user = await User.create({ username, password });

    // Respond with a success status code and the user data
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error (unique constraint violation)
      res.status(400).json({ error: "Username already exists." });
    } else {
      // Other errors (database errors, unexpected errors)
      res.status(500).json({
        error: "Registration failed. Please try again later.",
        message: error.message,
      });
    }
  }
};

/**
 * Authenticates a user by checking if the provided username and password match an existing user in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing a message and the accesstoken or an error message.
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username and check if the password matches
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (comparePasswords(password, user.password) === false)
      return res
        .status(401)
        .json({ error: "Authentication failed: Incorrect password" });

    // Set up jwt
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ message: "Login successful", accessToken, user });
  } catch (error) {
    // Handle errors, such as database errors
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logs out the user by clearing the refreshToken cookie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success status code or an error message.
 */
export const logoutUser = (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      // Clear the refreshToken cookie
      res.clearCookie("refreshToken", { httpOnly: true });

      // Send a success response (user is effectively logged out)
      return res.sendStatus(204);
    });
  } catch (error) {
    console.error("Logout failed:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
};

/**
 * Retrieves a user by ID, excluding their password.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the user to retrieve.
 * @returns {Object} The user object, excluding the password.
 * @throws {Object} Error object containing details of any errors that occurred.
 */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Get all info about the user except the password
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("Updating user");
    console.log(req.body);
    await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}