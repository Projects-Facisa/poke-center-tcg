import React, { useState } from "react";
import "./Table.css";
import Item from "../components/Item/Item.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import { IoIosAdd } from "react-icons/io";
import Container from "../components/Container/Container.jsx";
import RegisterProductPopUp from "../components/PopUps/RegisterProductPopUp/RegisterProductPopUp.jsx";

function Table() {
  const [search, setSearch] = useState("");
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => setPopUpOpen(false);

  return (
    <Container>
      <div className="table-header">
        <h1>Tabela</h1>
        <div className="header-end">
          <div className="table-header-btns">
            <button className="header-btn" onClick={openPopUp}>
              <p>Cadastrar Cartas</p>
              <span>
                <IoIosAdd />
              </span>
            </button>
          </div>
          <div className="table-search-bar">
            {/* <button className="header-btn search-btn">Filtrar</button> */}
            <SearchBar onSearch={setSearch} />
          </div>
        </div>
      </div>
      <div className="item-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da carta</th>
              <th>Categoria</th>
              <th>Raridade</th>
              <th>Estado do estoque</th>
              <th>Quantidade estoque</th>
              <th>Preço</th>
              <th>Data de compra</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <Item searchFilter={search} />
          </tbody>
        </table>
        <RegisterProductPopUp isOpen={isPopUpOpen} onClose={closePopUp} />
      </div>
    </Container>
  );
}

export default Table;
