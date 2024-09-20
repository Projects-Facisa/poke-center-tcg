import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log("Verificando token de acesso:", req.cookies.accessToken);

  if (!accessToken) {
    return res
      .status(403)
      .json({ valid: false, message: "Token não fornecido" });
  }

  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ valid: false, message: "Token inválido" });
    }
    req.email = decoded.email;
    next();
  });
};

export const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ valid: false, message: "Token de atualização não fornecido" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ valid: false, message: "Token de atualização inválido" });
    }

    const newAccessToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    next();
  });
};
