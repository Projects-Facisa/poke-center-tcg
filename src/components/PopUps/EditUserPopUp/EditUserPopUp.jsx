import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./EditUserPopUp.css";

const EditUserPopUp = ({ isOpen, onClose, onUserAdded, users, userID, updateUser}) => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (isOpen && userID) {
          const user = users.find((user) => user._id === userID);
          if (user) {
            setUserName(user.name);
            setUserEmail(user.email);
          }
        }
      }, [isOpen, userID, users]);

    const handleClose = () => {
        setUserName("");
        setUserEmail("");
        setErrorMessage("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const updatedData = {
            name: userName,
            email: userEmail,
          };
    
          await updateUser(userID, updatedData);
          handleClose();
        } catch (error) {
          console.error("Erro ao atualizar cliente:", error.message);
          setErrorMessage(error.message);
        }
      };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup-content edit">
                <h2>Editar Cliente</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>E-mail:</label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Atualizar</button>
                        <button type="button" onClick={handleClose}>
                            Fechar
                        </button>
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default EditUserPopUp;