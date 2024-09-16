import express from "express";
import {
  getAllCards,
  getCardById,
  addCard,
  updateCard,
  deleteCard,
  fetchCardsByName,
  fetchCardById,
} from "../controllers/cardController.js";

const router = express.Router();

router.get("/fetch-cards", fetchCardsByName);
router.get("/fetch-card/:id", fetchCardById);

router.get("/", getAllCards);
router.get("/:id", getCardById);
router.post("/add-card", addCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
