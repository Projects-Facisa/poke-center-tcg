import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json("No record existed");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).json("The password is incorrect");
    }

    res.status(200).json("Success");
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor" });
  }
};
