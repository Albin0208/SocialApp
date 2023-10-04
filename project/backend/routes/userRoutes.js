import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  findUser,
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { handleRefreshToken } from "../controllers/refreshTokenController.js";

const router = express.Router();

// Routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);

router.patch("/:id", updateUser);
router.get("/:id", getUser);
router.get("/username/:username", findUser)
router.use(verifyJWT);
// Routes for protected resources

export default router;
