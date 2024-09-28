import React, { useContext, useRef, useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dropdown.css";
import DefaultImage from "../../assets/user-profile.png";
import { ProfileContext } from "../ProfileImageUploader/ProfileContext";

const Dropdown = () => {
  const { imageProfile } = useContext(ProfileContext);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  let menuRef = useRef();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  return (
    <div className="dropdown-container" ref={menuRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <img
          src={imageProfile || DefaultImage}
          alt="Profile"
          className="profile-image"
        />
      </div>

      <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
        <h3>{username || "Usuário"}</h3>
        <ul>
          <li className="dropdown-item" onClick={handleLogout}>
            <span>
              <CiLogout />
            </span>
            <a>Log Out</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
