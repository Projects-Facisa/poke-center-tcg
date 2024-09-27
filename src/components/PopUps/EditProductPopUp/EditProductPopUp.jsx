import React, { useState, useEffect } from "react";
import "./EditProductPopUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductPopUp = ({ isOpen, onClose, itemID, items, updateItem }) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const notifySuccess = (message) => toast.success(message);

  useEffect(() => {
    if (isOpen && itemID) {
      const item = items.find((item) => item._id === itemID);
      if (item) {
        setProductQuantity(item.stock);
        setProductPrice(item.price.toString());
      }
    }
  }, [isOpen, itemID, items]);

  const handleClose = () => {
    setProductQuantity(0);
    setProductPrice("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productQuantity < 0 || !productPrice) {
      setErrorMessage("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      const updatedData = {
        stock: parseInt(productQuantity),
        price: parseFloat(productPrice),
      };

      await updateItem(itemID, updatedData);
      notifySuccess("Produto Atualizado");
      handleClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error.message);
      setErrorMessage(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content edit">
        <h2>Editar Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quantidade em Estoque:</label>
            <input
              type="number"
              value={productQuantity}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Preço do Produto:</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
              min="0"
              step="0.01"
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

export default EditProductPopUp;
