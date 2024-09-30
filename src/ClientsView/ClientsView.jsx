import React, { useState, useEffect, useRef, useContext } from "react";
import Container from "../components/Container/Container.jsx";
import "./ClientsView.css";
import axios from "axios";
import {
  IoIosMore,
  IoMdArrowDown,
  IoMdArrowUp,
  IoIosAdd,
} from "react-icons/io";
import { FaUserCheck } from "react-icons/fa6";
import { SiVerizon } from "react-icons/si";
import { MdShoppingCart } from "react-icons/md";
import SearchBar from "../components/SearchBar/SearchBar.jsx";

import EditClientPopUp from "../components/PopUps/EditClientPopUp/EditClientPopUp.jsx";
import RegisterClientPopUp from "../components/PopUps/RegisterClientPopUp/RegisterClientPopUp.jsx";
import DeletePopUp from "../components/PopUps/DeletePopUp/DeletePopUp.jsx";
import AddCompras from "../components/PopUps/EditClientPopUp/AddCompras.jsx";
import RemoveCompras from "../components/PopUps/EditClientPopUp/RemoveCompras.jsx";

import { LoadingContext } from "../Controller/LoadingContext.jsx";
import { TailSpin } from "react-loader-spinner";

function ViewUsers() {
  const [clients, setClients] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [topClients, setTopClients] = useState([]);
  const [sortBy, setSortBy] = useState("code");
  const [isAscending, setIsAscending] = useState(true);

  const [popView, setPopView] = useState("");
  const [clientID, setClientID] = useState("");
  const { loading, loadingIsFalse, loadingIsTrue } = useContext(LoadingContext);

  const [openMenuId, setOpenMenuId] = useState(false);
  const actionMenuRef = useRef();

  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => {
    setPopUpOpen(false);
    setPopView(""); // Reset popView ao fechar
  };

  useEffect(() => {
    fetchClients();

    const handler = (e) => {
      if (!actionMenuRef.current.contains(e.target)) {
        setOpenMenuId(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handlePopUp = (clientID, pop) => {
    setPopView(pop);
    setClientID(clientID);
    openPopUp();
  };

  const getTopClients = (clients) => {
    return clients
      .filter((client) => client && client.purchaseCount > 0)
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 5);
  };

  useEffect(() => {
    const topFiveClients = getTopClients(clients);
    setTopClients(topFiveClients);
  }, [clients]);

  const fetchClients = async () => {
    loadingIsTrue();
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
    } finally {
      loadingIsFalse();
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const calcTotalPurchases = (clients) => {
    return clients.reduce((total, client) => {
      return total + (client.purchaseCount || 0);
    }, 0);
  };

  const totalPurchases = calcTotalPurchases(clients);

  const calcAge = (bornDate) => {
    const today = new Date();
    const birthDate = new Date(bornDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const refreshTable = () => {
    fetchClients();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setIsAscending(!isAscending);
    } else {
      setSortBy(column);
      setIsAscending(true);
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return isAscending ? <IoMdArrowUp /> : <IoMdArrowDown />;
    }
    return null;
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (isAscending) {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const updateClient = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update Client");
      }
      fetchClients();
    } catch (error) {
      console.error("Error updating Client:", error);
    }
  };

  const deleteClient = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete client");
      }
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) {
    return (
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="black"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        wrapperClass=""
      />
    );
  }

  return (
    <Container>
      <div className="table-header">
        <h1>Clientes</h1>
        <div className="header-end">
          <div className="table-header-btns">
            <button className="header-btn" onClick={() => handlePopUp("", 0)}>
              <p>Cadastrar Cliente</p>
              <span>
                <IoIosAdd />
              </span>
            </button>
          </div>
          <div className="table-search-bar">
            <SearchBar input={"Pesquisar um Cliente..."} />
          </div>
        </div>
      </div>
      <div className="container-grid">
        <div className="client-grid">
          <div className="client-grid-header">
            <div className="infos-box">
              <div className="info">
                <h4>Clientes cadastrados</h4>
                <span>{clients.length}</span>
              </div>
              <div className="icon">
                <FaUserCheck />
              </div>
            </div>
            <div className="infos-box">
              <div className="info">
                <h4>Clientes ativos</h4>
                <span>
                  {clients.filter((client) => client.purchaseCount).length}
                </span>
              </div>
              <div className="icon ativo">
                <SiVerizon />
              </div>
            </div>
            <div className="infos-box">
              <div className="info">
                <h4>Total de compras</h4>
                <span>{totalPurchases}</span>
              </div>
              <div className="icon">
                <MdShoppingCart />
              </div>
            </div>
          </div>
          <div className="client-grid-body">
            <table>
              <thead>
                <tr>
                  <th>
                    <span
                      onClick={() => handleSort("code")}
                      className="clickable-text"
                    >
                      Code {renderSortIcon("code")}
                    </span>
                  </th>
                  <th>
                    <span
                      onClick={() => handleSort("name")}
                      className="clickable-text"
                    >
                      Nome {renderSortIcon("name")}
                    </span>
                  </th>
                  <th>
                    <span
                      onClick={() => handleSort("born")}
                      className="clickable-text"
                    >
                      Idade {renderSortIcon("born")}
                    </span>
                  </th>
                  <th>Email</th>
                  <th>
                    <span
                      onClick={() => handleSort("purchaseCount")}
                      className="clickable-text"
                    >
                      Compras {renderSortIcon("purchaseCount")}
                    </span>
                  </th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.code}</td>
                    <td>{client.name}</td>
                    <td>{calcAge(client.born)}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.purchaseCount > 0 ? client.purchaseCount : 0}
                    </td>
                    <td>
                      <div className="action-menu" ref={actionMenuRef}>
                        <button
                          className="action-btn"
                          onClick={() => toggleMenu(client._id)}
                        >
                          <IoIosMore />
                        </button>
                        {openMenuId === client._id && (
                          <div className="action-dropdownn" ref={actionMenuRef}>
                            <button onClick={() => handlePopUp(client._id, 1)}>
                          
                              Editar
                            </button>
                            <button onClick={() => handlePopUp(client._id, 2)}>
                              {" "}
                              Deletar{" "}
                            </button>
                            <button id="add-compras" onClick={() => handlePopUp(client._id, 3)}>
                              {" "}
                              Adicionar Compras{" "}
                            </button>
                            <button id="remover-compras" onClick={() => handlePopUp(client._id, 4)}>
                              {" "}
                              Remover Compras{" "}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="newclient-grid">
          <div className="panel-top5">
            <h3>RANKING DE COMPRAS</h3>
            <ul>
              <li className="li-header">
                <div>Cod.</div>
                <div>Nome</div>
                <div className="purchaseCount">Compras</div>
              </li>
              {topClients.map((client) => (
                <li key={client._id}>
                  <div className="code">{client.code}</div>
                  <div className="name">{client.name}</div>
                  <div className="purchaseCount">{client.purchaseCount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {popView === 0 && (
        <RegisterClientPopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          onClientAdded={refreshTable}
        />
      )}
      {popView === 1 && (
        <EditClientPopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          updateClient={updateClient}
          clients={clients}
          clientID={clientID}
        />
      )}
      {popView === 2 && (
        <DeletePopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          deleteObject={deleteClient}
          itemID={clientID}
        />
      )}
      {popView === 3 && (
        <AddCompras
        isOpen={isPopUpOpen}
        onClose={closePopUp}
        updateClient={updateClient}
        clients={clients}
        clientID={clientID}
        />
      )}
      {popView === 4 && (
        <RemoveCompras
        isOpen={isPopUpOpen}
        onClose={closePopUp}
        updateClient={updateClient}
        clients={clients}
        clientID={clientID}
        />
      )}
    </Container>
  );
}

export default ViewUsers;
