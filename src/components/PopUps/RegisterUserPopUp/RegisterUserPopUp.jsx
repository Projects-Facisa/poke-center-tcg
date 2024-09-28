import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "./RegisterUserPopUp.css";

const RegisterUserPopUp = ({ isOpen, onClose, onUserAdded }) => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        setUserName("");
        setUserEmail("");
        setErrorMessage("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName || !userEmail || !isNaN(userName[0])) {
            setErrorMessage("Por favor, preencha todos os campos corretamente.");
            return;
        }

        try {
            const newUser = {
                name: userName,
                email: userEmail
            };

            await onUserAdded(newUser);
            handleClose();

            const addUserResponse = await fetch("http://localhost:5000/api/users/funcionario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newUser.name,
                    email: newUser.email
                }),
            });

            const result = await addUserResponse.json();

            if (!addUserResponse.ok) {
                throw new Error(result.error || "Erro ao adicionar Usuário.");
            }

            console.log(result.message);
            console.log("Senha gerada: ", result.generatedPassword); // Mostra a senha gerada
            onUserAdded();
            handleClose();

        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error.message);
            setErrorMessage(error.message);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup-content edit">
                <h2>Cadastrar Usuário</h2>
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
                        <button type="submit">Cadastrar</button>
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

export default RegisterUserPopUp;
