import express from "express";
import { getAllClients, getOneClient, addClient, updateClient, deleteClient } from "../controllers/ClientController.js";

const router = express.Router();

router.get("/api/clients", getAllClients);
router.get("/api/clients/:code", getOneClient);
router.post("/add-client", addClient);
router.put("/api/clients/:id", updateClient)
router.delete("/api/clients/:id", deleteClient)

export default router;
