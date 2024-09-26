import React, { useState, useEffect, useRef } from "react";
import "./PromotionItem.css";
import { IoIosMore } from "react-icons/io";
import EditProductPopUp from "../PopUps/EditProductPopUp/EditProductPopUp.jsx";
import DeletePopUp from "../PopUps/DeletePopUp/DeletePopUp.jsx";
import axios from "axios";
import RegisterPromotionPopUp from "../PopUps/Promotion/RegisterPromotionPopUp/Register.jsx";

function PromotionItem({ searchFilter = "", sortBy, isAscending }) {
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const [popView, setPopView] = useState("");
    const [itemID, setItemID] = useState("");
    const [items, setItems] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(false);

    const openPopUp = () => setPopUpOpen(true);
    const closePopUp = () => setPopUpOpen(false);

    let actionMenuRef = useRef();

    const handlePopUp = (itemID, pop) => {
        setPopView(pop);
        setItemID(itemID);
        openPopUp();
    };

    useEffect(() => {
        fetchItems();

        let handler = (e) =>{
            if (!actionMenuRef.current.contains(e.target)){
                setOpenMenuId(false);
            }
        };

        document.addEventListener("mousedown", handler);
    }, []);



    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/promotions/");
            setItems(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const deleteItem = async (itemID) => {
        try {
            const response = await axios.delete("http://localhost:5000/promotions/" + itemID);
            console.log(response.data);
        }
        catch (error){
            console.error({error: error.mensage})
        }
    }

    const sortByName = () => {
        setItems([...items].sort((a, b) => (isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))));
    };

    const sortByPrice = () => {
        setItems([...items].sort((a, b) => (isAscending ? a.price - b.price : b.price - a.price)));
    };

    const sortByPurchaseDate = () => {
        setItems([...items].sort((a, b) => {
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



    const filteredItems = items.filter((item) =>
        item.Card ? item.Card.name.toLowerCase().includes(searchFilter.toLowerCase()) : "sem carta"
    );

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <>
            {filteredItems.map((item) => (
                <tr key={item._id}>
                    <td>{item.Card ? item.Card.name : "sem nome"}</td>
                    <td>{!item.User ? "Todos" : item.User.name}</td>
                    <td>{"R$" + item.price % 1 === 0 ? item.price.toFixed(2) + ",00" : item.price.toFixed(2)}</td>
                    <td>{new Date(item.expireAt).toLocaleString("pt-BR")}</td>
                    <td>
                        <div className="action-menu" ref={actionMenuRef} >
                            <button className="action-btn"  onClick={() => toggleMenu(item._id)}>
                                <IoIosMore />
                            </button>
                            {openMenuId === item._id && (
                                <div className="action-dropdown" ref={actionMenuRef}>
                                    <button onClick={() => handlePopUp(item._id, 1)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handlePopUp(item._id, 2)}>
                                        Delete
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
                    itemID={itemID}
                />
            ) : null}
            {popView === 2 ? (
                <DeletePopUp
                    isOpen={isPopUpOpen}
                    onClose={closePopUp}
                    deleteItem={deleteItem}
                    itemID={itemID}
                />
            ) : null}
        </>
    );
}

export default PromotionItem;
