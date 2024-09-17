import React, { useState, useEffect, useRef } from "react";
import "./Item.css";
import { IoIosMore } from "react-icons/io";
import EditProductPopUp from "../PopUps/EditProductPopUp/EditProductPopUp.jsx";
import DeletePopUp from "../PopUps/DeletePopUp/DeletePopUp.jsx";

function Item({ searchFilter = "" }) {
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
      const response = await fetch("http://localhost:5000/");
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
      const response = await fetch(`http://localhost:5000/${id}`, {
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
      const response = await fetch(`http://localhost:5000/${id}`, {
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
          <td>{"R$" + item.price.toFixed(2)}</td>
          <td>{new Date(item.purchaseDate).toLocaleDateString("pt-BR")}</td>
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
          deleteItem={deleteItem}
          itemID={itemID}
        />
      ) : null}
    </>
  );
}

export default Item;
