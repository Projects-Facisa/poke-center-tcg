import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cardRoutes from "./routes/cardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const portApi = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use(cardRoutes);

app.listen(portApi, () => {
  console.log(`API Server rodando na porta ${portApi}`);
});
