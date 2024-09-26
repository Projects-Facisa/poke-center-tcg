import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, image } = req.body;

  console.log("Dados recebidos no register:", req.body);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Preencha todos os campos obrigatórios." });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
    });
    return res
      .status(201)
      .json({ message: "Usuário registrado com sucesso.", user: newUser });
  } catch (error) {
    return res.status(500).json({
      error:
        "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Usuário não encontrado:", email);
      return res.status(404).json({
        login: false,
        message: "Usuário não encontrado. Verifique seu e-mail.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Senha incorreta para o email:", email);
      return res.status(400).json({
        login: false,
        message: "Senha incorreta. Verifique sua senha.",
      });
    }
    const accessToken = jwt.sign(
      { email: user.email, permissions: user.permissions },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 604800000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      login: true,
      name: user.name,
      image: user.image,
      message: "Login realizado com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      error:
        "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logout realizado com sucesso." });
};

export const updateProfileImage = async (req, res) => {
  const { image } = req.body;
  const email = req.email;

  try {
    if (!image) {
      return res.status(400).json({ error: "Imagem não fornecida" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    user.image = image;
    await user.save();

    return res
      .status(200)
      .json({ message: "Imagem de perfil atualizada com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar a imagem de perfil" });
  }
};
