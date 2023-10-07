import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  findUser,
} from "../controllers/userController.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "../controllers/friendRequestController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { handleRefreshToken } from "../controllers/refreshTokenController.js";

const router = express.Router();

// Routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);

// Routes for protected resources
router.use(verifyJWT);
router.patch("/:id", updateUser);
router.get("/username/:username", findUser);
router.get("/:id", getUser);

router.post("/:receiverId/send-request", sendFriendRequest);
router.post("/:senderId/accept-friend-request", acceptFriendRequest);
router.post("/:senderId/decline-friend-request", declineFriendRequest);

export default router;
