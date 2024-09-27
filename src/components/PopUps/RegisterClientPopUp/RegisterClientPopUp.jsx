import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import "./RegisterClientPopUp.css";

const RegisterClientPopUp = ({ isOpen, onClose, onClientAdded }) => {
    const [clientName, setClientName] = useState("");
    const [clientAge, setClientAge] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        setClientName("");
        setClientAge("");
        setClientEmail("");
        setErrorMessage("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clientName || clientAge < 0 || !clientEmail || !isNaN(clientName[0])) {
            setErrorMessage("Por favor, preencha todos os campos corretamente.");
            return;
        }

        try {
            const newClient = {
                name: clientName.split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" "),
                age: new Date(clientAge),
                email: clientEmail
            };

            await onClientAdded(newClient);
            handleClose();

            const addClientResponse = await fetch("http://localhost:5000/add-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newClient.name,
                    born: newClient.age,
                    email: newClient.email
                }),
            });

            const result = await addClientResponse.json();

            if (!addClientResponse.ok) {
                throw new Error(result.error || "Erro ao adicionar Cliente.");
            }

            console.log(result.message);
            onClientAdded();
            handleClose();

        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error.message);
            setErrorMessage(error.message);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="popup-overlay">
            <div className="popup-content edit">
                <h2>Cadastrar Cliente</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Idade:</label>
                        <input
                            type="date"
                            value={clientAge}
                            onChange={(e) => setClientAge(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>E-mail:</label>
                        <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
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

export default RegisterClientPopUp;