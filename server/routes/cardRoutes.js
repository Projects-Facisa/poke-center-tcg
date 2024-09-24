import express from "express";
import {
  getAllCards,
  getCardById,
  addCard,
  updateCard,
  deleteCard,
  getCardByName,
} from "../controllers/cardController.js";

const router = express.Router();

router.get("/", getAllCards);
router.get("/:id", getCardById);
router.get("/name/:name", getCardByName);
router.post("/add-card", addCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
