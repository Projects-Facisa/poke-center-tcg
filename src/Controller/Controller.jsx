import { useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { IoIosRadioButtonOn } from "react-icons/io";
import { PiTrashFill } from "react-icons/pi";
import { MdHome } from "react-icons/md";
import "./Controller.css";
import Table from "../Table/Table.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Promotion from "../Promotion/Promotion.jsx";
import {RiDiscountPercentFill} from "react-icons/ri";

function Controller() {
  const [view, setView] = useState(1);

  return (
    <div id="controller">
      <div id="side-bar">
        <button
          onClick={() => setView(1)}
          className={view === 1 ? "active" : ""}
        >
          <MdHome />
        </button>
        <button
          onClick={() => setView(2)}
          className={view === 2 ? "active" : ""}
        >
          <BiSolidDashboard />
        </button>
        <button
          onClick={() => setView(3)}
          className={view === 3 ? "active" : ""}
        >
          <RiDiscountPercentFill />
        </button>
        <button
          onClick={() => setView(4)}
          className={view === 4 ? "active" : ""}
        >
          <IoIosRadioButtonOn />
        </button>
        <button
          onClick={() => setView(5)}
          className={view === 5 ? "active" : ""}
        >
          <PiTrashFill />
        </button>
      </div>
      <div id="content">
        {view === 1 ? <Dashboard /> : ""}
        {view === 2 ? <Table /> : ""}
        {view === 3 ? <Promotion/> : ""}
      </div>
    </div>
  );
}

export default Controller;
