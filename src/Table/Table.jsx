import React, { useState } from "react";
import "./Table.css";
import Item from "../components/Item/Item.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import { IoIosAdd, IoMdArrowUp , IoMdArrowDown  } from "react-icons/io";
import Container from "../components/Container/Container.jsx";
import RegisterProductPopUp from "../components/PopUps/RegisterProductPopUp/RegisterProductPopUp.jsx";

function Table() {
  const [search, setSearch] = useState("");
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [sortBy, setSortBy] = useState("purchaseDate");
  const [isAscending, setIsAscending] = useState(true);

  const openPopUp = () => setPopUpOpen(true);
  const closePopUp = () => setPopUpOpen(false);

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
      return isAscending ? <IoMdArrowUp  /> : <IoMdArrowDown  />;
    }
    return null;
  };

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
              <th>
                ID
              </th>
              <th>
                <span onClick={() => handleSort("name")} className="clickable-text">
                  Nome da carta {renderSortIcon("name")}
                </span>
              </th>
              <th>
                <span onClick={() => handleSort("category")} className="clickable-text">
                  Categoria {renderSortIcon("category")}
                </span>
              </th>
              <th>
                <span onClick={() => handleSort("rarity")} className="clickable-text">
                  Raridade {renderSortIcon("rarity")}
                </span>
              </th>
              <th>
                  Estado do estoque
              </th>
              <th>
                <span onClick={() => handleSort("quantity")} className="clickable-text">
                  Quantidade estoque {renderSortIcon("quantity")}
                </span>
              </th>
              <th>
                <span onClick={() => handleSort("price")} className="clickable-text">
                  Preço {renderSortIcon("price")}
                </span>
              </th>
              <th>
                <span onClick={() => handleSort("purchaseDate")} className="clickable-text">
                  Data de compra {renderSortIcon("purchaseDate")}
                </span>
              </th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <Item searchFilter={search} sortBy={sortBy} isAscending={isAscending} />
          </tbody>
        </table>
        <RegisterProductPopUp isOpen={isPopUpOpen} onClose={closePopUp} />
      </div>
    </Container>
  );
}

export default Table;
