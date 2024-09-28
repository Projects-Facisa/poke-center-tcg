import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, image } = req.body;

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
      role: 'Admin',
      image,
    });
    return res
      .status(201)
      .json({ message: "Administrador registrado com sucesso.", user: newUser });
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
      return res.status(400).json({
        login: false,
        message: "Credenciais inválidas. Verifique seu e-mail ou senha.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        login: false,
        message: "Credenciais inválidas. Verifique seu e-mail ou senha.",
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
      code: user.code,
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

export const getAllUsers = async (req, res) => {
  try{
      const result = await User.find()
      if (result.length){
        res.status(200).json({message: "Lista de Usuários encontrada.", content: result})
      } else {
        res.status(404).json({message: "Nenhum Usuário encontrado."})
    }
  }
  catch{
      res.status(500).json({message: "Erro inesperado."})
  }
}


export const getOneUser = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({code});
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json({message: "Usuário encontrado com sucesso", content: user});

  } catch (error) {
    console.error("Error in getOneUser:", error);
    return res.status(500).json({ message: "Erro ao buscar o usuário", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { code } = req.params;
  const { name, newEmail, password, image } = req.body;

  try {
    const user = await User.findOne({ code });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (name) user.name = name;
    if (newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists && emailExists.email !== email) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }
      user.email = newEmail;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (image) user.image = image;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Usuário atualizado com sucesso.",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Ocorreu um erro ao atualizar o usuário. Tente novamente mais tarde.",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { code } = req.params;

  try {
    const user = await User.findById({ code });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await User.findByIdAndDelete({ code });

    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    res.status(500).json({
      error: "Ocorreu um erro ao deletar o usuário. Tente novamente mais tarde.",
    });
  }
};

export const registerFuncionario = async (req, res) => {
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
      role: 'Funcionario',
      image,
    });
    return res
      .status(201)
      .json({ message: "Funcionario registrado com sucesso.", user: newUser });
  } catch (error) {
    return res.status(500).json({
      error:
        "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.",
    });
  }
};
