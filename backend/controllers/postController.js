import Post from "../models/postModel.js";
import User from "../models/userModel.js";

/**
 * Retrieves all posts from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns an object containing all posts.
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Creates a new post with the given content and author.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves with the post object or rejects with an error.
 */
export const createPost = async (req, res) => {
  try {
    const { content, author, receiver } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        message: "Missing parameters",
      });
    }

    // Fetch the author and the receiver from the database
    const [authorUser, receiverUser] = await Promise.all([
      User.findById(author),
      User.findById(receiver),
    ]);
    
    // Check if the author and receiver are friends
    if (!authorUser.friends.includes(receiver)) {
      return res.status(400).json({
        message: "You can only post on your friends' walls",
      });
    }

    const newPost = await Post.create({ content, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * Get a post by its ID.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves with the post object or rejects with an error.
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
