import express from 'express';
import { createPost, getPosts } from '../controllers/postController.js';

const router = express.Router();

router.post('/create', createPost);
router.get('/', getPosts);

export default router;
