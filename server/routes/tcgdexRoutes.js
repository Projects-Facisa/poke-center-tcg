import express from "express";
import {
  fetchCardsByName,
  fetchCardById,
} from "../controllers/tcgdexController.js";

const router = express.Router();

router.get("/fetch-cards", fetchCardsByName);
router.get("/fetch-card/:id", fetchCardById);

export default router;
