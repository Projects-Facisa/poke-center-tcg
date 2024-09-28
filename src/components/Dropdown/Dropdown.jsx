import React, { useState, useRef, useEffect } from "react";
import ProfileImageUploader from "../ProfileImageUploader/ProfileImageUploader";
import { CiSettings, CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dropdown.css";
import { useView } from "../../Controller/ViewContext.jsx";

const Dropdown = () => {
  const { setView } = useView();
  const [open, setOpen] = useState(false);
  const [imageProfile, SetimageProfile] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  let menuRef = useRef();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
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
  });
  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      SetimageProfile(storedImage);
    }
  }, []);
  const toggleDropdown = () => {
    if (!modalIsOpen) {
      setOpen(!open);
    }
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
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

  const handleSetView = (viewNumber) => {
    setView(viewNumber);
    setOpen(false);
  };

  return (
    <div className="dropdown-container" ref={menuRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        <ProfileImageUploader
          imageProfile={imageProfile}
          SetimageProfile={SetimageProfile}
          fileInputRef={fileInputRef}
          modalIsOpen={modalIsOpen}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
        />
      </div>

      <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
        <h3>
          {username || "Usuário"}
          <br />
          <span>{role}</span>
        </h3>
        
        <ul>
          <li className="dropdown-item" onClick={() => handleSetView(5)}>
            <span>
              <CiSettings />
            </span>
            <a>Configurações</a>
          </li>
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
