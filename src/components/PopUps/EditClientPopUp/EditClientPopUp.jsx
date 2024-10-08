import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./EditClientPopUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditClientPopUp = ({
  isOpen,
  onClose,
  clients,
  clientID,
  updateClient
}) => {
  const [clientName, setClientName] = useState("");
  const [clientAge, setClientAge] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const notifySuccess = (message) => toast.success(message);

  useEffect(() => {
    if (isOpen && clientID) {
      const client = clients.find((client) => client._id === clientID);
      if (client) {
        setClientName(client.name);
        setClientAge(client.born.split("T")[0]);
        setClientEmail(client.email);
      }
    }
  }, [isOpen, clientID, clients]);

  const handleClose = () => {
    setClientName("");
    setClientAge("");
    setClientEmail("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        name: clientName,
        born: clientAge,
        email: clientEmail
      };
      console.log("Dados a serem enviados:", updatedData, clientID); // Verifique os dados aqui

      await updateClient(clientID, updatedData);
      notifySuccess("Cliente Atualizado");
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
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Data de Nascimento:</label>
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

export default EditClientPopUp;
