import express from "express";
import { addClient, getAllClients, getOneClient } from "../controllers/ClientController.js";

const router = express.Router();

router.get("/api/clients", getAllClients);
router.get("/api/clients/:code", getOneClient);
router.post("/add-client", addClient);

export default router;
