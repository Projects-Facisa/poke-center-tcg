import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import "./RegisterProductPopUp.css";

const RegisterProductPopUp = ({ isOpen, onClose }) => {
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [tamanhoPlaceHolderContainer, setTamanhoPlaceHolderContainer] = useState(0);
  
  const cardsContainerRef = useRef(null);
  
  const handleClose = () => {
    setProductQuantity(0);
    setProductPrice("");
    setSelectedCard(null);
    setCards([]);
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCard) {
      setErrorMessage("Por favor, selecione uma carta.");
      return;
    }

    if (productQuantity < 0 || !productPrice) {
      setErrorMessage("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      // Buscar detalhes completos da carta pelo ID
      const response = await fetch(
        `http://localhost:5000/fetch-card/${selectedCard.id}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os detalhes da carta.");
      }
      const cardDetails = await response.json();

      // Enviar os dados completos para o backend
      const addCardResponse = await fetch("http://localhost:5000/add-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: cardDetails.id,
          name: cardDetails.name,
          image: cardDetails.image,
          rarity: cardDetails.rarity,
          category: cardDetails.category,
          stock: productQuantity,
          price: productPrice,
          purchaseDate: new Date(),
        }),
      });

      const result = await addCardResponse.json();

      if (!addCardResponse.ok) {
        throw new Error(result.error || "Erro ao adicionar a carta.");
      }

      console.log(result.message);
      handleClose();
    } catch (error) {
      console.error("Erro ao adicionar carta:", error.message);
      setErrorMessage(error.message);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      const searchInput = e.target.value.trim();
      setErrorMessage("");
      setCards([]);

      if (!searchInput) {
        setErrorMessage("Por favor, digite um nome para pesquisar.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/fetch-cards?name=${encodeURIComponent(
            searchInput
          )}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar as cartas.");
        }
        const fetchedCards = await response.json();
        if (fetchedCards.length === 0) {
          setErrorMessage("Nenhuma carta encontrada.");
        } else {
          setCards(fetchedCards);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  useEffect(() => {
    const handleResize = () => {
      if (cardsContainerRef.current) {
        const largura = cardsContainerRef.current.offsetWidth;
        const altura = 0.8 * window.innerHeight;

        const tamanhoCardContainer = largura * altura; //Tamanho quadrado² do container pai

        const tamanhoImgCard = 150 * 200.52 //Tamanho do card da imagem

        let tamanhoPlaceHolderContainerr = tamanhoCardContainer / tamanhoImgCard; //Quantiade de cards que cabem dentro da div pai

        setTamanhoPlaceHolderContainer(tamanhoPlaceHolderContainerr) //Setando quantidade no state
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, [isOpen, cards]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content register">

        <IoClose className="x-close" onClick={handleClose} />{/*Botão de fechar*/}

        <div className="popup-body">

          <div className="form-section">
            <h2>Registrar Produto</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">

                <div className="input-label">
                  <label>Nome da Carta:</label>
                  <input
                    type="text"
                    id="search-input"
                    onKeyDown={handleSearch}
                    placeholder="Digite o nome da carta e aperte Enter"
                    />
                </div>{/*input-label*/}
        
                <div className="input-label">
                  <label>Quantidade em Estoque:</label>
                  <input
                    type="number"
                    onChange={(e) => setProductQuantity(Number(e.target.value))}
                    required
                    />
                </div>{/*input-label*/}
            
                <div className="input-label">
                  <label>Preço do Produto:</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                  />
                </div>{/*input-label*/}
                
                <div className="button-group"> <button type="submit">Registrar</button> </div>

              </div> {/*form-group*/}
              
              {errorMessage && (<div className="error-message">{errorMessage}</div>)}{/*FeedBack*/}

            </form>
          </div>{/*form-section*/}

          <div className="cards-section" ref={cardsContainerRef}>
            <div className="cards-container">
              {cards.length === 0 ? (
                /*If Ternário ===>>> PlaceHolder*/
                Array.from({ length: parseInt(tamanhoPlaceHolderContainer / 1.5 )}).map(() => (
                  <div className="card placeholder">
                    <img
                      src="../src/assets/placeholder.png"
                      alt="placeholder"
                      className="card-image"
                    />
                  </div>
                ))
              ) : (
                /*Else do If Ternário ===>>> Cartas*/
                cards.map((card) => (
                  <div
                    key={card.id}
                    className={`card ${selectedCard?.id === card.id ? "selected" : ""}`}
                    onClick={() => handleCardClick(card)}
                    >
                    <img
                      src={
                        card.image
                          ? `${card.image}/high.png`
                          : "../src/assets/placeholder.png"
                      }
                      alt={card.name}
                      className="card-image"
                    />
                    <h2>{card.name}</h2>
                    <p>ID: {card.id}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProductPopUp;
