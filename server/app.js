import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cardRoutes from "./routes/cardRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const portApi = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});

app.post("/register", async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  User.create(req.body)
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.use(cardRoutes);

app.listen(portApi, () => {
  console.log(`API Server rodando na porta ${portApi}`);
});
