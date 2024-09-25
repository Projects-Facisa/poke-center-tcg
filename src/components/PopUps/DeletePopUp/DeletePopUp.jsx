import React, { useEffect, useState } from "react";
import "./DeletePopUp.css";

const DeletePopUp = ({isOpen,onClose,deleteClient,itemID,}) => {

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteClient(itemID);
    console.log("Produto Deletado");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Você Realmente quer deletar esse item?</h3>
        <div className="button-group">
          <button type="submit" onClick={handleSubmit}>
            Deletar
          </button>
          <button type="button" onClick={handleClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;
