import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
    },
    image: {
      type: String,
      default: "",
    },
  },
  { collection: "register" }
);

const User = mongoose.model("User", userSchema);

export default User;
