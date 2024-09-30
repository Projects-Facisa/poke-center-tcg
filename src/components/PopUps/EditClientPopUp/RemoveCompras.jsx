import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./EditClientPopUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RemoveCompras = ({ isOpen, onClose, clients, clientID, updateClient }) => {
  const [clientPurchases, setClientPurchases] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const notifySuccess = (message) => toast.success(message);

  useEffect(() => {
    if (isOpen && clientID) {
      const client = clients.find((client) => client._id === clientID);
    }
  }, [isOpen, clientID, clients]);

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentClient = clients.find((client) => client._id === clientID);
    const newPurchaseCount = (currentClient.purchaseCount || 0) - parseInt(clientPurchases, 10);

    if (newPurchaseCount < 0) {
      setErrorMessage("O número de compras não pode ser negativo.");
      return;
    }

    const updatedData = {
      purchaseCount: newPurchaseCount
    };

    try {
      await updateClient(clientID, updatedData);
      notifySuccess("Compras removidas com sucesso!");
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
        <h2>Remover Compras</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Compras:</label>
            <input
              type="number"
              value={clientPurchases}
              onChange={(e) => setClientPurchases(e.target.value)}
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

export default RemoveCompras;
