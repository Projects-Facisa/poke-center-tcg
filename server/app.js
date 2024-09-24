import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import tcgdexRoutes from "./routes/tcgdexRoutes.js"
import cardRoutes from "./routes/cardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js"
import promotionRoutes from "./routes/promotionRoutes.js";
import cookieParser from "cookie-parser";
import { verifyUser } from "./middleware/authMiddleware.js";
dotenv.config();

const app = express();
const portApi = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.get("/Admin", verifyUser, (req, res) => {
  res.json({ valid: true, message: "Autorizado a acessar Admin" });
});

connectDB();

app.use("/api/users", authRoutes);
app.use(tcgdexRoutes);
app.use(cardRoutes);
app.use("/promotions", promotionRoutes);
app.use(clientRoutes);

app.listen(portApi, () => {
  console.log(`API Server rodando na porta ${portApi}`);
});
