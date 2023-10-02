import Post from '../models/postModel.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

export const createPost = async (req, res) => {
  try {
    const { content, author } = req.body;
    const newPost = await Post.create({content, author});
    res.status(201).json(newPost);
  }
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}