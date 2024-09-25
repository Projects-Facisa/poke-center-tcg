import "./Dashboard.css";
import Container from "../components/Container/Container.jsx";
import React from "react";
import {
  ColumnChartComponent,
} from "../components/Charts/Charts.jsx";
import { FaChartColumn } from "react-icons/fa6";

function Dashboard() {
  return (
    <Container>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <h3>Analytics overview</h3>
      </div>
      <div className="dashboard-panel">
        <div className="square">
          <span className="number">85963</span>
          <span className="text">Total cadastrados</span>
        </div>
        <div className="square">
          <span className="number">7564</span>
          <span className="text">Estoque total</span>
        </div>
        <div className="square">
          <span className="number">13654</span>
          <span className="text">Sem estoque</span>
        </div>
        <div className="square">
          <span className="number">5</span>
          <span className="text">Em promoção</span>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <div className="chart-header">
            <FaChartColumn />
          </div>
          <ColumnChartComponent />
        </div>
        {/* <div className="chart">
          <div className="chart-header">
            <RiLineChartLine />
          </div>
          <LineChartComponent />
        </div> */}
      </div>
    </Container>
  );
}

export default Dashboard;
