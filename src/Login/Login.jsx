import React, { useState, useEffect } from "react";
import "./Login.css";
import loginBackground from "../assets/login-background.mp4";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GitHubProfileCard from "../components/GithubProfiles/GithubProfiles";

const LoginComponent = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [name, setName] = useState({ value: "", dirty: false });
  const [email, setEmail] = useState({ value: "", dirty: false });
  const [password, setPassword] = useState({ value: "", dirty: false });
  const regexEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();


  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);


  const profiles = [
    { userName: "Severino Neto", avatarUrl: "https://avatars.githubusercontent.com/u/136730703?v=4", gitHubUrl: "https://github.com/svneto" },
    { userName: "Yuri Diego", avatarUrl: "https://avatars.githubusercontent.com/u/136770806?v=4", gitHubUrl: "https://github.com/Yuri-Diego" },
    { userName: "Caio Medeiros", avatarUrl: "https://avatars.githubusercontent.com/u/132417760?v=4", gitHubUrl: "https://github.com/medeiroscaio" },
    { userName: "Silas Miguel", avatarUrl: "https://avatars.githubusercontent.com/u/129446558?v=4", gitHubUrl: "https://github.com/SilasMiguel" },
    { userName: "Marcleidson Fernandes", avatarUrl: "https://avatars.githubusercontent.com/u/131935886?v=4", gitHubUrl: "https://github.com/marclod" },
    { userName: "Murilo Alves", avatarUrl: "https://avatars.githubusercontent.com/u/136763427?v=4", gitHubUrl: "https://github.com/medeiroscaio" },
  ];


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

      const { login, image, name, code, role } = result.data;

      if (login) {
        notifySuccess("Login bem-sucedido!");
        localStorage.setItem("username", name);
        localStorage.setItem("profileImage", image);
        localStorage.setItem("code", code);
        localStorage.setItem("role", role)
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
        <form className="form-github">
          <div className="github-profiles-container">
            <h2>Nosso Time</h2>
            {profiles.map((profile, index) => (
                <GitHubProfileCard
                  key={index}
                  avatarUrl={profile.avatarUrl}
                  userName={profile.userName}
                  gitHubUrl={profile.gitHubUrl}
                />
              ))} 
          </div>
        </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Entrar</h1>
            <span>Insira suas credenciais.</span>
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
            <button type="submit">Entrar</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Sobre nós!</h1>
              <p>
                Somos uma equipe de desenvolvedores dedicados à tecnologia e ao código aberto. Conheça nossos perfis no GitHub:
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => {
                  setIsSignUpMode(false);
                }}
              >
                voltar
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Olá, Amigo!</h1>
              <p>Insira suas Credenciais para logar em nosso sistema.</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => {
                  setIsSignUpMode(true), resetFields();
                }}
              >
                Sobre Nós
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
