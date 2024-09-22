import React, { useState, useEffect } from "react";
import Container from "../components/Container/Container.jsx";
import "./ClientsView.css";
import axios from "axios";
import { IoIosMore} from "react-icons/io";
import { FaUserCheck } from "react-icons/fa6";
import { SiVerizon } from "react-icons/si";
import { MdShoppingCart } from "react-icons/md";

function ViewUsers() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/clients')
      .then(response => {
        if (Array.isArray(response.data.content)) { 
          setClients(response.data.content);
        } else {
          setClients([]); 
        }
      })
      .catch(error => {
        console.error("Erro ao buscar os clientes:", error);
        setClients([]);
      });
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
                <span>{clients.filter((client) => client.isActive).length}</span>
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
                    <span>code</span>
                  </th>
                  <th>
                    <span>nome</span>
                  </th>
                  <th>
                    <span>Idade</span>
                  </th>
                  <th>
                    <span>email</span>
                  </th>
                  <th>
                    <span>compras</span>
                  </th>
                  <th>
                    <span>ação</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr>
                    <td>{client.code}</td>
                    <td>{client.name}</td>
                    <td>{calcAge(client.born)}</td>
                    <td>{client.email}</td>
                    <td>{client.purchaseCount}</td>
                    <td>
                      <div>
                        <button>
                          <IoIosMore />
                        </button>
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
            <button>CADASTRAR NOVO CLIENTE</button>
          </div>
          <div className="panel-top5">
            <h3>RANKING DE COMPRAS</h3>
            <ul>
              <li className="li-header">
                <div>Cod.</div>
                <div>Nome</div>
                <div className="purchaseCount">Compras</div>
              </li>
              {clients.map((client) => (
                <li>
                  <div className="code">{client.code}</div>
                  <div className="name">{client.name}</div>
                  <div className="purchaseCount">{client.purchaseCount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ViewUsers;
