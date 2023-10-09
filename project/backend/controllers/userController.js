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
    const { username, password } = req.body;

    console.log("req.body", req.body);
    console.log("username", username);

    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password is required." });

    const hashedPassword = hashPassword(req.body.password);

    // Check if user already exists
    if (await User.findOne({ username }))
      return res.status(409).json({ error: "Username already exists." });

    const user = await User.create({ username, password: hashedPassword });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: "Registration failed. Please try again later.",
      message: error.message,
    });
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
      { user: user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user: user },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Create a user object without the password field
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    // Handle errors, such as database errors
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logs out the user by clearing the refreshToken cookie.
 *
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
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the user to retrieve.
 * @returns {Object} The user object, excluding the password.
 * @throws {Object} Error object containing details of any errors that occurred.
 */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password").populate({
      path: "friends friendRequests sentRequests",
      select: "-password",
    }); // Get all info about the user except the password

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    // Catch error when user is not valid mongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: error.message });
  }
};

/**
 * Updates a user by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If there is an error updating the user.
 */
export const updateUser = async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Finds a user by their username.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The user object.
 * @throws {Object} The error object.
 */
export const findUser = async (req, res) => {
  try {
    const regex = new RegExp(req.params.username, "i");

    const user = await User.find({ username: regex })
      .populate()
      .select("-password -posts");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

