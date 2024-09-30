import React, { useState, useEffect, useRef } from "react";
import "./PromotionItem.css";
import { IoIosMore } from "react-icons/io";
import DeletePopUp from "../PopUps/DeletePopUp/DeletePopUp.jsx";
import axios from "axios";
import RegisterPromotionPopUp from "../PopUps/Promotion/RegisterPromotionPopUp/Register.jsx";

function PromotionItem({ searchFilter = "", sortBy, isAscending, refreshTrigger}) {
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const [popView, setPopView] = useState("");
    const [promotionID, setPromotionID] = useState("");
    const [promotions, setPromotions] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(false);
    const [reload, setReload] = useState(0);

    const openPopUp = () => setPopUpOpen(true);
    const closePopUp = () => {setPopUpOpen(false); setReload(reload + 1)};

    let actionMenuRef = useRef();

    const handlePopUp = (promotion, pop) => {
        setPopView(pop);
        setPromotionID(promotion._id);
        openPopUp();
    };

    useEffect(() => {
        fetchPromotions();

        const handler = (e) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handler);
    }, [refreshTrigger, reload]);



    const fetchPromotions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/promotions/");
            setPromotions(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    };

    const deletePromotion = async (promotionID) => {
        try {
            const response = await axios.delete("http://localhost:5000/promotions/" + promotionID);
        }
        catch (error){
            console.error({error: error.mensage})
        }
    }

    const sortByName = () => {
        setPromotions([...promotions].sort((a, b) => (isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))));
    };

    const sortByPrice = () => {
        setPromotions([...promotions].sort((a, b) => (isAscending ? a.price - b.price : b.price - a.price)));
    };

    const sortByPurchaseDate = () => {
        setPromotions([...promotions].sort((a, b) => {
            const dateA = new Date(a.purchaseDate.split("/").reverse().join("-"));
            const dateB = new Date(b.purchaseDate.split("/").reverse().join("-"));
            return isAscending ? dateA - dateB : dateB - dateA;
        }));
    };

    useEffect(() => {
        if (sortBy === "name") sortByName();
        if (sortBy === "price") sortByPrice();
        if (sortBy === "purchaseDate") sortByPurchaseDate();
    }, [sortBy, isAscending]);



    const filteredPromotions = promotions.filter((promotion) =>
        promotion.Card ? promotion.Card.name.toLowerCase().includes(searchFilter.toLowerCase()) : true);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <>
            {filteredPromotions.map((promotion) => (
                <tr key={promotion._id}>
                    <td>{!promotion.Card ? "Carta não encontrada" : promotion.Card.name}</td>
                    <td>{!promotion.Card.stock ? 0 : promotion.Card.stock}</td>
                    <td>{!promotion.Client ? "Todos" : promotion.Client.name}</td>
                    <td>{"R$" + promotion.price % 1 === 0 ? promotion.price.toFixed(2) + ",00" : promotion.price.toFixed(2)}</td>
                    <td>{new Date(promotion.expireAt).toLocaleString("pt-BR")}</td>
                    <td>
                        <div className="action-menu" ref={actionMenuRef}>
                            <button className="action-btn" onClick={() => toggleMenu(promotion._id)}>
                                <IoIosMore/>
                            </button>
                            {openMenuId === promotion._id && (
                                <div className="action-dropdown" ref={actionMenuRef}>
                                    <button onClick={() => handlePopUp(promotion, 1)}>
                                        Editar
                                    </button>
                                    <button onClick={() => handlePopUp(promotion, 2)}>
                                        Deletar
                                    </button>
                                </div>
                            )}
                        </div>
                    </td>

                </tr>
            ))}
            {popView === 1 ? (
                <RegisterPromotionPopUp
                    isOpen={isPopUpOpen}
                    onClose={closePopUp}
                    itemID={promotionID}
                />
            ) : null}
            {popView === 2 ? (
                <DeletePopUp
                    isOpen={isPopUpOpen}
                    onClose={closePopUp}
                    deleteObject={deletePromotion}
                    itemID={promotionID}
                />
            ) : null}
        </>
    );
}

export default PromotionItem;
