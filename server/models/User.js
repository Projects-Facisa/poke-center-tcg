import mongoose from "mongoose";
import { nanoid } from 'nanoid';

const userSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      default: () => nanoid(7),
      unique: true,
      required: true,
    },
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
    role: {
      type: String,
      required: [true, "funcao é obrigatória"]
    },
    image: {
      type: String,
      default: "",
    },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);

export default User;
