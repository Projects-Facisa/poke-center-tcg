import "./UserPanel.css";
import React, { useState, useEffect } from "react";
import { FaRegUser } from "react-icons/fa";

function getDate() {
  const today = new Date();
  let month = today.toLocaleString("pt-BR", { month: "short" });
  month = month.replace(".", "");
  const year = today.getFullYear();
  const date = today.getDate();
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const dayName = days[today.getDay()];
  return `${date} ${month} ${year}, ${dayName}`;
}

function getTime() {
  const time = new Date();
  const hours = ("0" + time.getHours()).slice(-2);
  const minutes = ("0" + time.getMinutes()).slice(-2);
  const seconds = ("0" + time.getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

function getGreeting() {
  const horaAtual = new Date().getHours();
  return horaAtual >= 5 && horaAtual < 12
    ? "Bom dia!"
    : horaAtual >= 12 && horaAtual < 18
    ? "Boa tarde"
    : "Boa noite";
}

const UserPanel = () => {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentTime, setCurrentTime] = useState(getTime());
  const [currentGreeting, setCurrentGreeting] = useState(getGreeting());

  useEffect(() => {
    setCurrentGreeting(getGreeting());
  }, []);

  useEffect(() => {
    const changeDate = setInterval(() => setCurrentDate(getDate()), 60000);
    return () => clearInterval(changeDate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="user-control">
      <div id="user-welcome">
        <span id="welcome">{currentGreeting}, Usuário!</span>
        <span>{currentDate}</span>
      </div>
      <div className="user-info">
        <span id="hour">{currentTime}</span>
        <span id="user-icon">
          <FaRegUser />
        </span>
      </div>
    </div>
  );
};

export default UserPanel;
