import React, { useState, useEffect, useRef } from "react";
import "./Item.css";
import { IoIosMore } from "react-icons/io";
import EditProductPopUp from "../PopUps/EditProductPopUp/EditProductPopUp.jsx";
import DeletePopUp from "../PopUps/DeletePopUp/DeletePopUp.jsx";

function Item({ searchFilter = "", sortBy, isAscending, refreshTrigger }) {
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

    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handler);
  }, [refreshTrigger]);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/cards");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const updateItem = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/cards/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/cards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const sortByName = () => {
    setItems(
      [...items].sort((a, b) =>
        isAscending
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      )
    );
  };

  const sortByCategory = () => {
    setItems(
      [...items].sort((a, b) =>
        isAscending
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category)
      )
    );
  };

  const sortByRarity = () => {
    setItems(
      [...items].sort((a, b) =>
        isAscending
          ? a.rarity.localeCompare(b.rarity)
          : b.rarity.localeCompare(a.rarity)
      )
    );
  };

  const sortByQuantity = () => {
    setItems(
      [...items].sort((a, b) =>
        isAscending ? a.stock - b.stock : b.stock - a.stock
      )
    );
  };

  const sortByPrice = () => {
    setItems(
      [...items].sort((a, b) =>
        isAscending
          ? (a.newPrice ? a.newPrice : a.price) -
            (b.newPrice ? b.newPrice : b.price)
          : (b.newPrice ? b.newPrice : b.price) -
            (a.newPrice ? a.newPrice : a.price)
      )
    );
  };

  const sortByPurchaseDate = () => {
    setItems(
      [...items].sort((a, b) => {
        const dateA = new Date(a.purchaseDate.split("/").reverse().join("-"));
        const dateB = new Date(b.purchaseDate.split("/").reverse().join("-"));
        return isAscending ? dateA - dateB : dateB - dateA;
      })
    );
  };

  useEffect(() => {
    if (sortBy === "name") sortByName();
    if (sortBy === "category") sortByCategory();
    if (sortBy === "rarity") sortByRarity();
    if (sortBy === "quantity") sortByQuantity();
    if (sortBy === "price") sortByPrice();
    if (sortBy === "purchaseDate") sortByPurchaseDate();
  }, [sortBy, isAscending]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const stockCalc = (stock) => {
    return stock >= 10
      ? "em-estoque"
      : stock === 0
      ? "sem-estoque"
      : "baixo-estoque";
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <>
      {filteredItems.map((item) => (
        <tr key={item._id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.category}</td>
          <td>{item.rarity}</td>
          <td>
            <span className={`status ${stockCalc(item.stock)}`}>
              {item.stock >= 10
                ? "Disponível"
                : item.stock === 0
                ? "Esgotado"
                : "Poucas unidades"}
            </span>
          </td>
          <td>{item.stock}</td>
          {item.newPrice ? (
            <td>
              <span className="line-price">{"R$" + item.price.toFixed(2)}</span>
              <span className="new-price">{"R$" + item.newPrice}</span>
            </td>
          ) : (
            <td>
              <span>{"R$" + item.price.toFixed(2)}</span>
            </td>
          )}
          <td>{new Date(item.purchaseDate).toLocaleDateString("pt-BR")}</td>
          <td>
            <div className="action-menu" ref={actionMenuRef}>
              <button
                className="action-btn"
                onClick={() => toggleMenu(item._id)}
              >
                <IoIosMore />
              </button>
              {openMenuId === item._id && (
                <div className="action-dropdown" ref={actionMenuRef}>
                  <button onClick={() => handlePopUp(item._id, 1)}>Edit</button>
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
        <EditProductPopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          updateItem={updateItem}
          itemID={itemID}
          items={items}
        />
      ) : null}
      {popView === 2 ? (
        <DeletePopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          deleteObject={deleteItem}
          itemID={itemID}
        />
      ) : null}
    </>
  );
}

export default Item;
