import React, { useState, useRef, useEffect} from "react";
import ProfileImageUploader from "../ProfileImageUploader/ProfileImageUploader";
import { CiImageOn, CiLogout } from "react-icons/ci";
import "./Dropdown.css";

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const [imageProfile, SetimageProfile] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  let menuRef = useRef();

  useEffect(() =>{
    let handler = (e) =>{
      if (!menuRef.current.contains(e.target)){
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return()=>{
      document.removeEventListener("mousedown", handler)
    }
    
  })

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
          Teste
          <br />
          <span>Teste</span>
        </h3>
        <ul>
          <li className="dropdown-item">
            <span>
              <CiImageOn />
            </span>
            <a onClick={() => fileInputRef.current.click()}>Mudar imagem</a>
          </li>
          <li className="dropdown-item">
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
