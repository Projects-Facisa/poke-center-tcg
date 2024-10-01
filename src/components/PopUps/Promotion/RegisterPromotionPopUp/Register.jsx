import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import "./Register.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPromotionPopUp = ({
  isOpen,
  onClose,
  itemID,
  onPromotionRegister,
}) => {
  const [productPrice, setProductPrice] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tamanhoPlaceHolderContainer, setTamanhoPlaceHolderContainer] = useState(0);
  const [clients, setClients] = useState([]);
  const cardsContainerRef = useRef(null);
  const [typeClient, setTypeClient] = useState(null);
  const notifySuccess = (message) => toast.success(message);

  const handleClose = () => {
    setProductPrice("");
    setSelectedCard(null);
    setSearchInput("");
    setExpireDate("");
    setCards([]);
    setErrorMessage("");
    setTypeClient(null);
    onClose();
  };

  const calculateDiscountedPrice = (client, originalPrice) => {
    let discountPercentage = 0;

    if (client.purchaseCount >= 30) {
      discountPercentage = 0.30;
    } else if (client.purchaseCount >= 20) {
      discountPercentage = 0.20;
    } else if (client.purchaseCount >= 10) {
      discountPercentage = 0.10;
    } else {
      discountPercentage = 0.05;
    }

    const discountAmount = originalPrice * discountPercentage;
    return (originalPrice - discountAmount).toFixed(2);
  };

  const setPromotion = async () => {
    if (!selectedCard) {
      setErrorMessage("Por favor, selecione uma carta.");
      return;
    }

    if (typeClient) {
      try {
        const response = await axios.get(`http://localhost:5000/api/client/${typeClient}`);
        const client = response.data.content;
        const discountedPrice = calculateDiscountedPrice(client, selectedCard.price);
        setProductPrice(discountedPrice);
      } catch (error) {
        console.error("Erro ao buscar o cliente:", error);
        setErrorMessage("Erro ao buscar o cliente.");
      }
    } else {
      setProductPrice(selectedCard.price);
    }
  };

  useEffect(() => {
    if (selectedCard && typeClient !== undefined) {
      setPromotion();
    }
  }, [selectedCard, typeClient]);

  const handleSubmit = async () => {
    if (!selectedCard) {
      setErrorMessage("Por favor, selecione uma carta.");
      return;
    }

    if (!typeClient && (!productPrice || parseFloat(productPrice) >= selectedCard.price)) {
      setErrorMessage("Por favor, insira um preço menor do que o atual");
      return;
    }

    if (new Date(expireDate).getTime() <= new Date().getTime()) {
      setErrorMessage("Por favor, insira uma data válida");
      return;
    }

    try {
      const promotionData = {
        cardId: selectedCard._id,
        clientId: typeClient || null,
        price: productPrice,
        expireAt: expireDate,
      };

      if (!itemID) {
        await axios.post("http://localhost:5000/promotions", promotionData);
        notifySuccess("Promoção adicionada");
      } else {
        await axios.put(`http://localhost:5000/promotions/${itemID}`, promotionData);
        notifySuccess("Promoção Atualizada");
      }
      handleClose();
    } catch (error) {
      console.error("Erro ao processar promoção:", error);
      setErrorMessage(error.response?.data?.error || "Erro ao processar promoção");
    }
    onPromotionRegister();
  };

  const handleSearchCard = async (e) => {
    if (e.code === "Enter" || e === "Enter") {
      setSearchInput(e !== "Enter" ? e.target.value : searchInput);
      setErrorMessage("");

      if (!searchInput) {
        setErrorMessage("Por favor, digite um nome para pesquisar.");
        return;
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

        const tamanhoImgCard = 150 * 200.52; //Tamanho do card da imagem

        let tamanhoPlaceHolderContainerr =
          tamanhoCardContainer / tamanhoImgCard; //Quantidade de cards que cabem dentro da div pai

        setTamanhoPlaceHolderContainer(tamanhoPlaceHolderContainerr); //Setando quantidade no state
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, [isOpen, cards]);

  useEffect(() => {
    fetchCards();
    fetchClients();
    if (itemID) {
      getPromotionInfos(itemID);
      handleSearchCard("Enter");
    }
  }, [isOpen]);

  const fetchCards = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cards/");
      setCards(response.data);
      if (response.data.length === 0) {
        setErrorMessage("Nenhuma carta encontrada.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      if (Array.isArray(response.data.content)) {
        setClients(response.data.content);
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error("Erro ao buscar os clientes:", error);
      setClients([]);
    }
  };

  const getPromotionInfos = async (itemID) => {
    try {
      const responsePromotion = await axios.get(
        "http://localhost:5000/promotions/" + itemID
      );
      const responseCard = await axios.get(
        "http://localhost:5000/cards/" + responsePromotion.data.Card._id
      );
      setProductPrice(responsePromotion.data.price);
      setSelectedCard(responseCard.data);
      setSearchInput(responseCard.data.name);
      setExpireDate(
        new Date(responsePromotion.data.expireAt).toISOString().split("T")[0]
      );
      setTypeClient(responsePromotion.data.clientId);
    } catch (error) {
      console.error({ error: error });
    }
  };

  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchInput.toLowerCase()) &&
      card.stock > 0
  );

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content register">
        <IoClose className="x-close" onClick={handleClose} />
        <div className="popup-body">
          <div className="form-section">
            <h2>{!itemID ? "Registrar Promoção" : "Atualizar Promoção"}</h2>
            <form>
              <div className="form-group">
                <div className="input-label">
                  <label>Para quem:</label>
                  <select
                    name="clients"
                    id="clients"
                    value={typeClient || "Todos"}
                    onChange={(e) => setTypeClient(e.target.value === "Todos" ? null : e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-label">
                  <label>Nome da Carta:</label>
                  <input
                    type="text"
                    id="search-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchCard(e)}
                    placeholder="para pesquisar aperte Enter"
                  />
                </div>


                <div className="input-label">
                  <label>Preço da Promoção:</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="input-label">
                  <label>Data de Expiração:</label>
                  <input
                    type="date"
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    required
                  />
                </div>

                <div className="button-group">
                  <button
                    id="searchButton"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {!itemID ? "Registrar" : "Atualizar"}
                  </button>
                </div>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </form>
          </div>

          <div className="cards-section" ref={cardsContainerRef}>
            <div className="cards-container">
              {filteredCards.length === 0
                ? Array.from({
                    length: parseInt(tamanhoPlaceHolderContainer / 1.5),
                  }).map((_, index) => (
                    <div key={index} className="card placeholder">
                      <img
                        src="../src/assets/placeholder.png"
                        alt="placeholder"
                        className="card-image"
                      />
                    </div>
                  ))
                : filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className={`card ${
                        selectedCard?.id === card.id ? "selected" : ""
                      }`}
                      onClick={() => handleCardClick(card)}
                    >
                      <img
                        src={
                          card.image
                            ? `${card.image}`
                            : "../src/assets/placeholder.png"
                        }
                        alt={card.name}
                        className="card-image"
                      />
                      <h2>{card.name}</h2>
                      <span>ID: {card.id}</span>
                      <br />
                      <p className="value">
                        {`R$ 
                        ${card.price % 1 === 0 ? card.price + ",00" : card.price}`}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPromotionPopUp;