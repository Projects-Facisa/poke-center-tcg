import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import "./Register.css";
import axios from "axios";

const RegisterPromotionPopUp = ({ isOpen, onClose, itemID}) => {
    const [productPrice, setProductPrice] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [searchInput, setSearchInput] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [tamanhoPlaceHolderContainer, setTamanhoPlaceHolderContainer] = useState(0);

    const cardsContainerRef = useRef(null);

    const handleClose = () => {
        setProductPrice("");
        setSelectedCard(null);
        setExpireDate("")
        setCards([]);
        setErrorMessage("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!selectedCard) {
            setErrorMessage("Por favor, selecione uma carta.");
            return;
        }

        if (!productPrice || productPrice >= selectedCard.price) {
            setErrorMessage("Por favor, insira um preço menor do que o atual");
            return;
        }

        if(new Date(expireDate).getTime() <= new Date(Date.now()).getTime()){
            setErrorMessage("Por favor, insira uma data Válida")
            return;
        }

        if (!itemID) {
            try {
                // Enviar os dados completos para o backend
                const response = await axios.post("http://localhost:5000/promotions", {
                    cardId: selectedCard._id,
                    price: productPrice,
                    expireAt: expireDate,
                });

                console.log(response.data)
                setErrorMessage("promoção adicionada");

                handleClose();
            } catch (error) {
                console.error("Erro ao atualizar promoção:", error);
                setErrorMessage(error.message);
            }
        }
        else {
            try {
                const response = await axios.put("http://localhost:5000/promotions/" + itemID, {
                    cardId: selectedCard._id,
                    price: productPrice,
                    expireAt: expireDate,
                });

                console.log(response.data)
                setErrorMessage("promoção adicionada");

                handleClose();
            }
            catch (error) {
                console.error("Erro ao atualizar promoção:", error);
            }
        }
    };

    const handleSearchCard = async (e) => {
        if (e.code === "Space") {
            setSearchInput(e.target.value.trim());
            setErrorMessage("");
            setCards([]);

            if (!searchInput) {
                setErrorMessage("Por favor, digite um nome para pesquisar.");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/cards/name/" + searchInput)

                if (response.data.length === 0) {
                    setErrorMessage("Nenhuma carta encontrada.");
                } else {
                    setCards(response.data);
                }
            } catch (error) {
                setErrorMessage(error.message);
            }
        }
    };

    // const handleSearchClient = async (e) => {
    //     if (e.key === "Enter") {
    //         const searchInput = e.target.value.trim();
    //         setErrorMessage("");
    //         setCards([]);
    //
    //         if (!searchInput) {
    //             setErrorMessage("Por favor, digite um nome para pesquisar.");
    //             return;
    //         }
    //
    //         try {
    //             const response = await axios.get("http://localhost:5000/client/name/" + searchInput)
    //
    //             if (response.data.length === 0) {
    //                 setErrorMessage("Nenhum cliente encontrado.");
    //             } else {
    //                 setClients(response.data);
    //             }
    //         } catch (error) {
    //             setErrorMessage(error.message);
    //         }
    //     }
    // }

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

    useEffect(() => {
        if (itemID) {
            getPromotionInfos(itemID)
            handleSearchCard("Space")
        }
    }, [isOpen])

    const getPromotionInfos = async(itemID) => {
            try {

                const responsePromotion = await axios.get("http://localhost:5000/promotions/" + itemID);
                console.log(responsePromotion)
                const responseCard = await axios.get("http://localhost:5000/cards/" + responsePromotion.data.Card._id)
                setProductPrice(responsePromotion.data.price);
                setSelectedCard(responseCard.data);
                setSearchInput(responseCard.data.name)
                setExpireDate(new Date(responsePromotion.data.expireAt).toISOString().split("T")[0]);
            }
            catch (error){
                console.error({error: error})
            }

    }

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content register">

                <IoClose className="x-close" onClick={handleClose} />{/*Botão de fechar*/}

                <div className="popup-body">

                    <div className="form-section">
                        <h2>Registrar Promoção</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">

                                <div className="input-label">
                                    <label>Nome da Carta:</label>
                                    <input
                                        type="text"
                                        id="search-input"
                                        onKeyDown={handleSearchCard}
                                        placeholder={!itemID ? "para pesquisar  aperte Enter" : "para pesquisar aperte Space Bar"}
                                    />
                                </div>{/*input-label*/}

                                {/*<div className="input-label">*/}
                                {/*    <label>Nome do Cliente:</label>*/}
                                {/*    <input*/}
                                {/*        type="text"*/}
                                {/*        id="search-input"*/}
                                {/*        onKeyDown={handleSearchClient}*/}
                                {/*        placeholder="Digite o nome do cliente e aperte Enter"*/}
                                {/*    />*/}
                                {/*</div>/!*input-label*!/*/}

                                <div className="input-label">
                                    <label>Preço do Produto:</label>
                                    <input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        required
                                    />
                                </div>{/*input-label*/}

                                <div className="input-label">
                                    <label>Data de Expiração:</label>
                                    <input
                                        type="Date"
                                        value={expireDate}
                                        onChange={(e) => setExpireDate(e.target.value)}
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
                                                    ? `${card.image}`
                                                    : "../src/assets/placeholder.png"
                                            }
                                            alt={card.name}
                                            className="card-image"
                                        />
                                        <h2>{card.name}</h2>
                                        <p>ID: {card.id}</p>
                                        <p>PREÇO: R${card.price % 1 === 0 ? card.price + ",00" : card.price}</p>
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

export default RegisterPromotionPopUp;
