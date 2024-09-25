import React, { useState, useEffect, useRef } from "react";
import Container from "../components/Container/Container.jsx";
import "./ClientsView.css";
import axios from "axios";
import { IoIosMore, IoMdArrowDown, IoMdArrowUp} from "react-icons/io";
import { FaUserCheck } from "react-icons/fa6";
import { SiVerizon } from "react-icons/si";
import { MdShoppingCart } from "react-icons/md";

import EditClientPopUp from "../components/PopUps/EditClientPopUp/EditClientPopUp.jsx";
import RegisterClientPopUp from "../components/PopUps/RegisterClientPopUp/RegisterClientPopUp.jsx";
import DeletePopUp from "../components/PopUps/DeletePopUp/DeletePopUp.jsx";

function ViewUsers(refreshTrigger) {
  const [clients, setClients] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [topClients, setTopClients] = useState([]);
  const [sortBy, setSortBy] = useState("code");
  const [isAscending, setIsAscending] = useState(true);

  const [popView, setPopView] = useState("");
  const [clientID, setClientID] = useState("");

  const [openMenuId, setOpenMenuId] = useState(false);

  let actionMenuRef = useRef();

  useEffect(() => {
    fetchClients();

    let handler = (e) =>{
      if (!actionMenuRef.current.contains(e.target)){
        setOpenMenuId(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, [refreshTrigger]);

  const handlePopUp = (clientID, pop) => {
    setPopView(pop);
    setClientID(clientID);
    openPopUp();
  };

  const getTopClients = (clients) => {
    return clients
      .filter(
        (client) => 
          client &&
          client.purchaseCount !== null && 
          client.purchaseCount !== undefined && 
          client.purchaseCount > 0
      )
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 5);
  };

  useEffect(() => {
    const topFiveClients = getTopClients(clients);
    setTopClients(topFiveClients);
  }, [clients]);

  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => setPopUpOpen(false);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
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
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
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

  const sortedClients = clients.sort((a, b) => {
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
      const response = await fetch(`http://localhost:5000/api/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update Client");
      }
      fetchClient();
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

  return (
    <Container>
      <div className="userview-header">
        <h1>Visualização de Clientes</h1>
      </div>
      <div className="container-grid">
        <div className="client-grid">
          <div className="client-grid-header">
            <div className="infos-box">
              <div className="info">
                <h4>Clientes cadastrados</h4>
                <span>{clients.length}</span>
              </div>
                <div className="icon"><FaUserCheck /></div>
            </div>
            <div className="infos-box">
              <div className="info">
                <h4>Clientes ativos</h4>
                <span>{clients.filter((client) => client.purchaseCount).length}</span>
              </div>
              <div className="icon ativo"><SiVerizon /></div>
            </div>
            <div className="infos-box">
              <div className="info">
                <h4>Total de compras</h4>
                <span>{totalPurchases}</span>
              </div>
              <div className="icon"><MdShoppingCart /></div>
            </div>
          </div>
          <div className="client-grid-body">
            <table>
              <thead>
                <tr>
                <th>
                    <span onClick={() => handleSort("code")} className="clickable-text">
                      Code {renderSortIcon("code")}
                    </span>
                  </th>
                  <th>
                    <span onClick={() => handleSort("name")} className="clickable-text">
                      Nome {renderSortIcon("name")}
                    </span>
                  </th>
                  <th>
                    <span onClick={() => handleSort("born")} className="clickable-text">
                      Idade {renderSortIcon("born")}
                    </span>
                  </th>
                  <th>
                    <span>
                      Email
                    </span>
                  </th>
                  <th>
                    <span onClick={() => handleSort("purchaseCount")} className="clickable-text">
                      Compras {renderSortIcon("purchaseCount")}
                    </span>
                  </th>
                  <th>
                    <span>ação</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr>
                    <td>{client.code}</td>
                    <td>{client.name}</td>
                    <td>{calcAge(client.born)}</td>
                    <td>{client.email}</td>
                    <td>{client.purchaseCount > 0 ? client.purchaseCount : 0}</td>
                    <td>
                    <div className="action-menu" ref={actionMenuRef} >
                      <button className="action-btn"  onClick={() => toggleMenu(client._id)}>
                        <IoIosMore />
                      </button>
                      {openMenuId === client._id && (
                        <div className="action-dropdown" ref={actionMenuRef}>
                          <button onClick={() => handlePopUp(client._id, 1)}> Edit </button>
                          <button onClick={() => handlePopUp(client._id, 2)}> Delete </button>
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
          <div className="newclient">
            <button onClick={openPopUp}>CADASTRAR NOVO CLIENTE</button>
          </div>
          <div className="panel-top5">
            <h3>RANKING DE COMPRAS</h3>
            <ul>
              <li className="li-header">
                <div>Cod.</div>
                <div>Nome</div>
                <div className="purchaseCount">Compras</div>
              </li>
              {topClients.map((client) => (
                <li>
                  <div className="code">{client.code}</div>
                  <div className="name">{client.name}</div>
                  <div className="purchaseCount">{client.purchaseCount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RegisterClientPopUp isOpen={isPopUpOpen && popView === ""} onClose={closePopUp} onClientAdded={refreshTable} />
      </div>
      {popView === 1 ? (
        <EditClientPopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          updateClient={updateClient}
          clients={clients}
          clientID={clientID}
        />
      ) : null}
      {popView === 2 ? (
        <DeletePopUp
          isOpen={isPopUpOpen}
          onClose={closePopUp}
          deleteObject={deleteClient}
          itemID={clientID}
        />
      ) : null}
    </Container>
  );
}

export default ViewUsers;