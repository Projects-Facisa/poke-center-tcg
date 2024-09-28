import { useState, useEffect } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { MdHome } from "react-icons/md";
import "./Controller.css";
import Table from "../Table/Table.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Promotion from "../Promotion/Promotion.jsx";
import { RiDiscountPercentFill } from "react-icons/ri";
import ClientsView from "../ClientsView/ClientsView.jsx";
import UsersView from "../UserView/UsersView.jsx";
import { FaUserGear, FaUserGroup } from "react-icons/fa6";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ViewProvider, useView } from "../Controller/ViewContext.jsx";

function ControllerContent() {
  const { view, setView } = useView();
  const [roleLogged, setRoleLogged] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRoleLogged(storedRole);
    console.log(roleLogged);

    if (storedRole && storedRole !== "Admin") {
      setView(2);
      setView(2);
    }
  }, [setView]);

  if (roleLogged === null) {
    return null;
  }

  const renderContent = () => {
    switch (view) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Table />;
      case 3:
        return <Promotion />;
      case 4:
        return <ClientsView />;
      case 5:
        return <UsersView />;
      default:
        return null;
    }
  };

  if (roleLogged === "Admin") {
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
        <div id="content">{renderContent()}</div>
      </div>
    );
  } else {
    return (
      <div id="controller">
        <div id="side-bar">
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
        <div id="content">{renderContent()}</div>
      </div>
    );
  }
}

function Controller() {
  return (
    <ViewProvider>
      <ControllerContent />
    </ViewProvider>
  );
}

export default Controller;
