import React, {useState} from "react";
import "./Promotion.css";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import {IoIosAdd, IoMdArrowUp, IoMdArrowDown} from "react-icons/io";
import Container from "../components/Container/Container.jsx";
import PromotionItem from "../components/PromotionItem/PromotionItem.jsx";
import RegisterPromotionPopUp from "../components/PopUps/Promotion/RegisterPromotionPopUp/Register.jsx";

function Promotion() {
    const [search, setSearch] = useState("");
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const [sortBy, setSortBy] = useState("expireDate");
    const [isAscending, setIsAscending] = useState(true);
    const [reload, setReload] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const openPopUp = () => setPopUpOpen(true);
    const closePopUp = () => {setPopUpOpen(false)};

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
            return isAscending ? <IoMdArrowUp/> : <IoMdArrowDown/>;
        }
        return null;
    };

    const refreshTable = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <Container>
            <div className="table-header">
                <h1>Promoções</h1>
                <div className="header-end">
                    <div className="table-header-btns">
                        <button className="header-btn" onClick={openPopUp}>
                            <p>Cadastrar Promoção</p>
                            <span>
                                <IoIosAdd/>
                            </span>
                        </button>
                    </div>
                    <div className="table-search-bar">
                        {/* <button className="header-btn search-btn">Filtrar</button> */}
                        <SearchBar onSearch={setSearch}/>
                    </div>
                </div>
            </div>
            <div className="item-table">
                <table>
                    <thead>
                    <tr>
                        <th>
                <span onClick={() => handleSort("name")} className="clickable-text">
                  Nome da carta {renderSortIcon("name")}
                </span>
                        </th>
                        <th>
                <span onClick={() => handleSort("clientName")} className="clickable-text">
                  Cliente {renderSortIcon("clientName")}
                </span>
                        </th>
                        <th>
                <span onClick={() => handleSort("price")} className="clickable-text">
                  Preço {renderSortIcon("price")}
                </span>
                        </th>
                        <th>
                <span onClick={() => handleSort("expireDate")} className="clickable-text">
                  Data de Expiração {renderSortIcon("expireDate")}
                </span>
                        </th>
                        <th>Ação</th>
                    </tr>
                    </thead>
                    <tbody>
                    <PromotionItem searchFilter={search} sortBy={sortBy} isAscending={isAscending} refreshTrigger={refreshTrigger}/>
                    </tbody>
                </table>
                <RegisterPromotionPopUp isOpen={isPopUpOpen} onClose={closePopUp} onPromotionRegister={refreshTable}/>
            </div>
        </Container>
    );
}

export default Promotion;