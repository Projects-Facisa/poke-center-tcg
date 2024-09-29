import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateProfileImage,
  getAllUsers,
  registerFuncionario,
  updateUser,
  getOneUser,
  deleteUser,
} from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/listall", getAllUsers);
router.get("/listone/:code", getOneUser);

router.put("/atualizar/:id", updateUser);

router.delete("/deletar/:id", deleteUser)

router.post("/funcionario", registerFuncionario);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/updateProfileImage", verifyUser, updateProfileImage);

export default router;
