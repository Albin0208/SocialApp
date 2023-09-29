import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

// Routes for authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes for protected resources
router.use(verifyJWT);


export default router;
