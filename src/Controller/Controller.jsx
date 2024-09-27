import { useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { IoIosRadioButtonOn } from "react-icons/io";
import { PiTrashFill } from "react-icons/pi";
import { MdHome } from "react-icons/md";
import "./Controller.css";
import Table from "../Table/Table.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Promotion from "../Promotion/Promotion.jsx";
import { RiDiscountPercentFill } from "react-icons/ri";
import ClientsView from "../ClientsView/ClientsView.jsx";
import { FaUserGear, FaUserGroup } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <FaUserGroup />
        </button>
        <button
          onClick={() => setView(5)}
          className={view === 5 ? "active" : ""}
        >
          <FaUserGear />
        </button>
        <ToastContainer />
      </div>
      <div id="content">
        {view === 1 ? <Dashboard /> : ""}
        {view === 2 ? <Table /> : ""}
        {view === 3 ? <Promotion /> : ""}
        {view === 4 ? <ClientsView /> : ""}
      </div>
    </div>
  );
}

export default Controller;
