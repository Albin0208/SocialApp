import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Define a route for user registration (POST /api/register)
router.post('/register', registerUser);
router.post('/login', loginUser);


export default router;
