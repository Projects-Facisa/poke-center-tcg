import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfileImage,
  getAllUsers,
  registerFuncionario,
  updateUser,
} from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { getOneClient } from "../controllers/ClientController.js";

const router = express.Router();

router.get("/listall", getAllUsers);
router.get("listone", getOneClient);

router.put("/atualizar", updateUser);

router.post("/funcionario", registerFuncionario);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/updateProfileImage", verifyUser, updateProfileImage);

export default router;
