import User from "../models/userModel.js";
import { comparePasswords, hashPassword } from "../utils/helpers.js";
import jwt from "jsonwebtoken"
import 'dotenv/config'

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The newly created user object.
 */
export const registerUser = async (req, res) => {
  const { username } = req.body;

  if (!req.body.password)
    return res.status(400).json({ error: 'Password is required.' });

  try {
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
      res
        .status(500)
        .json({ error: "Registration failed. Please try again later.", message: error.message });
    }
  }
};

/**
 * Authenticates a user by checking if the provided username and password match an existing user in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing a message and the authenticated user object, or an error message.
 */
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username and check if the password matches
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (comparePasswords(password, user.password) === false)
      return res.status(401).json({ error: "Incorrect password" });

    // Set up jwt
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });


    // Passwords match, user is authenticated
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    // Handle errors, such as database errors
    res.status(500).json({ error: error.message });
  }
};
