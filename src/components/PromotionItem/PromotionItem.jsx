import React, { useState, useEffect, useRef } from "react";
import "./PromotionItem.css";
import { IoIosMore } from "react-icons/io";
import DeletePopUp from "../PopUps/DeletePopUp/DeletePopUp.jsx";
import axios from "axios";
import RegisterPromotionPopUp from "../PopUps/Promotion/RegisterPromotionPopUp/Register.jsx";
import dayjs from "dayjs";

function PromotionItem({
  searchFilter = "",
  sortBy,
  isAscending,
  refreshTrigger,
}) {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [popView, setPopView] = useState("");
  const [promotionID, setPromotionID] = useState("");
  const [promotions, setPromotions] = useState([]);
  const [birthdayPromotions, setBirthdayPromotions] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [reload, setReload] = useState(0);

  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => {
    setPopUpOpen(false);
    setReload(reload + 1);
  };

  let actionMenuRef = useRef();

  const handlePopUp = (promotion, pop) => {
    setPopView(pop);
    setPromotionID(promotion._id);
    openPopUp();
  };

  useEffect(() => {
    fetchPromotions();
    fetchBirthdayPromotions();
  }, [refreshTrigger, reload]);

  useEffect(() => {
    sortPromotions();
  }, [promotions, birthdayPromotions, sortBy, isAscending]);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/promotions/");
      setPromotions(response.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const fetchBirthdayPromotions = async () => {
    try {
      const clientsResponse = await axios.get(
        "http://localhost:5000/api/clients"
      );
      const clients = clientsResponse.data.content;

      const today = new Date();
      const todayMonthDay = today.toISOString().substr(5, 5);

      console.log("Hoje (MM-DD):", todayMonthDay);

      const birthdayPromos = clients
        .filter((client) => {
          const birthDate = new Date(client.born);
          const birthMonthDay = birthDate.toISOString().substr(5, 5);

          console.log(
            `Cliente: ${client.name}, Nascimento (MM-DD): ${birthMonthDay}`
          );

          return birthMonthDay === todayMonthDay;
        })
        .map((client) => ({
          _id: `birthday-${client._id}`,
          Card: null,
          Client: client,
          price: null,
          discountPercentage: 20,
          expireAt: new Date().setHours(23, 59, 59, 999),
        }));

      console.log("Promoções de Aniversário:", birthdayPromos);

      setBirthdayPromotions(birthdayPromos);
    } catch (error) {
      console.error("Erro em fetchBirthdayPromotions:", error);
    }
  };

  const sortPromotions = () => {
    const combinedPromotions = [...promotions, ...birthdayPromotions];

    combinedPromotions.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = a.Card?.name || "Todas as cartas";
        const nameB = b.Card?.name || "Todas as cartas";
        return isAscending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (sortBy === "price") {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return isAscending ? priceA - priceB : priceB - priceA;
      } else if (sortBy === "expireDate") {
        const dateA = new Date(a.expireAt);
        const dateB = new Date(b.expireAt);
        return isAscending ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    setAllPromotions(combinedPromotions);
  };

  const deletePromotion = async (promotionID) => {
    try {
      await axios.delete("http://localhost:5000/promotions/" + promotionID);
      fetchPromotions();
    } catch (error) {
      console.error({ error: error.message });
    }
  };

  const filteredPromotions = allPromotions.filter((promotion) => {
    const cardName = promotion.Card
      ? promotion.Card.name.toLowerCase()
      : "todas as cartas";
    return cardName.includes(searchFilter.toLowerCase());
  });

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <>
      {filteredPromotions.map((promotion) => (
        <tr key={promotion._id}>
          <td>{promotion.Card ? promotion.Card.name : "Todas as cartas"}</td>
          <td>{promotion.Card ? promotion.Card.stock || 0 : "---"}</td>
          <td>{promotion.Client ? promotion.Client.name : "Todos"}</td>
          <td>
            {promotion.discountPercentage
              ? `${promotion.discountPercentage}% de desconto`
              : "R$" +
                (promotion.price % 1 === 0
                  ? promotion.price.toFixed(2) + ",00"
                  : promotion.price.toFixed(2))}
          </td>
          <td>{new Date(promotion.expireAt).toLocaleString("pt-BR")}</td>
          <td>
            {!promotion._id.startsWith("birthday-") && (
              <div className="action-menu" ref={actionMenuRef}>
                <button
                  className="action-btn"
                  onClick={() => toggleMenu(promotion._id)}
                >
                  <IoIosMore />
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
            )}
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
