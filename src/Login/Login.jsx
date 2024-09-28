import React, { useState, useEffect } from "react";
import "./Login.css";
import loginBackground from "../assets/login-background.mp4";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaGoogle, FaFacebook } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginComponent = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [name, setName] = useState({ value: "", dirty: false });
  const [email, setEmail] = useState({ value: "", dirty: false });
  const [password, setPassword] = useState({ value: "", dirty: false });
  const regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:5000/Admin", { withCredentials: true })
      .then((response) => {
        if (response.data.valid) {
          navigate("/Admin", { replace: true });
        }
      })
      .catch((error) => {
        console.log("Usuário não autenticado. Permanecer na página de login.");
      });
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      name.value.trim() === "" ||
      email.value.trim() === "" ||
      password.value.trim() === ""
    ) {
      notifyError("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          name: name.value,
          email: email.value,
          password: password.value,
        }
      );
      notifySuccess("Conta criada com sucesso! Faça login.");
      resetFields();
      setIsSignUpMode(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error === "Este e-mail já está registrado.") {
          notifyError("Este e-mail já está registrado. Tente outro.");
        } else {
          notifyError(err.response.data.error);
        }
      } else {
        notifyError(
          "Erro ao criar conta. Verifique os dados e tente novamente."
        );
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.value.trim() === "" || password.value.trim() === "") {
      notifyError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const result = await axios.post("http://localhost:5000/api/users/login", {
        email: email.value,
        password: password.value,
      });

      const { login, image, name, code } = result.data;

      if (login) {
        notifySuccess("Login bem-sucedido!");
        localStorage.setItem("username", name);
        localStorage.setItem("profileImage", image);
        localStorage.setItem("code", code);
        navigate("/Admin", { replace: true });
      } else {
        notifyError("Dados incorretos. Tente novamente.");
      }
    } catch (err) {
      notifyError("Dados incorretos. Tente novamente.");
    }
  };

  const loginValidate = (data, type) => {
    if (!data.value && data.dirty) {
      return <h4>Campo Obrigatório!</h4>;
    } else if (
      !!data.value &&
      type === "email" &&
      !regexEmail.test(data.value)
    ) {
      return <h4>Email inválido!</h4>;
    }
    return null;
  };

  const handleNameChange = (e) => {
    setName({ value: e.target.value, dirty: true });
  };

  const handleEmailChange = (e) => {
    setEmail({ value: e.target.value, dirty: true });
  };

  const handlePasswordChange = (e) => {
    setPassword({ value: e.target.value, dirty: true });
  };

  const resetFields = () => {
    setEmail({ value: "", dirty: false });
    setPassword({ value: "", dirty: false });
    setName({ value: "", dirty: false });
  };

  return (
    <div className="login-principal">
      <div
        className={`login-page login-container ${
          isSignUpMode ? "right-panel-active" : ""
        }`}
        id="login-container"
      >
        <video autoPlay muted loop className="background-video">
          <source src={loginBackground} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Criar Conta</h1>
            <div className="social-container">
              <a href="#" className="social">
                <FaGithub />
              </a>
              <a href="#" className="social">
                <FaGoogle />
              </a>
              <a href="#" className="social">
                <FaFacebook />
              </a>
            </div>
            <span>ou use seu email para se registrar</span>
            <input
              type="text"
              placeholder="Nome"
              value={name.value}
              onChange={(e) => {
                handleNameChange(e);
              }}
            />
            {loginValidate(name)}
            <input
              type="email"
              value={email.value}
              onChange={(e) => {
                handleEmailChange(e);
              }}
              placeholder="Email"
            />
            {loginValidate(email, "email")}
            <input
              type="password"
              value={password.value}
              onChange={(e) => {
                {
                  handlePasswordChange(e);
                }
              }}
              placeholder="Senha"
            />
            {loginValidate(password)}
            <button type="submit">Criar Conta</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Entrar</h1>
            <div className="social-container">
              <a href="#" className="social">
                <FaGithub />
              </a>
              <a href="#" className="social">
                <FaGoogle />
              </a>
              <a href="#" className="social">
                <FaFacebook />
              </a>
            </div>
            <span>ou use sua conta</span>
            <input
              type="email"
              value={email.value}
              onChange={(e) => {
                handleEmailChange(e);
              }}
              placeholder="Email"
            />
            {loginValidate(email, "email")}
            <input
              type="password"
              value={password.value}
              onChange={(e) => {
                handlePasswordChange(e);
              }}
              placeholder="Senha"
            />
            {loginValidate(password)}
            <a href="#">Esqueceu sua senha?</a>
            <button type="submit">Entrar</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Bem-vindo de volta!</h1>
              <p>
                Para se manter conectado conosco, faça login com suas
                informações pessoais
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => {
                  setIsSignUpMode(false), resetFields();
                }}
              >
                Entrar
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Olá, Amigo!</h1>
              <p>Insira seus dados pessoais e comece sua jornada conosco</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => {
                  setIsSignUpMode(true), resetFields();
                }}
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
