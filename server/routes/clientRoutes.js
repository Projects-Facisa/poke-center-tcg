import express from "express";
import { addClient, getAllClients, getOneClient, deleteClient } from "../controllers/ClientController.js";

const router = express.Router();

router.get("/api/clients", getAllClients);
router.get("/api/clients/:code", getOneClient);
router.post("/add-client", addClient);
router.delete("/api/clients/:id", deleteClient)

export default router;
