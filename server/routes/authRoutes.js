import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfileImage,
} from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/updateProfileImage", verifyUser, updateProfileImage);

export default router;
