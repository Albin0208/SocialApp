import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/userController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { handleRefreshToken } from '../controllers/refreshTokenController.js';

const router = express.Router();

// Routes for authentication
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser)

// Routes for protected resources
router.use(verifyJWT);


export default router;
