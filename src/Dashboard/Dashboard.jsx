import "./Dashboard.css";
import Container from "../components/Container/Container.jsx";
import React, { useEffect, useState } from "react";
import {
  ColumnChartComponent,LineChartComponent,
} from "../components/Charts/Charts.jsx";
import { FaChartColumn, FaCheckToSlot } from "react-icons/fa6";
import axios from "axios";
import { TbCards, TbCircleCheck, TbTruckLoading, TbXboxX } from "react-icons/tb";
import { FaCheckCircle, FaCheckSquare, FaTruckLoading } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RiLineChartLine } from "react-icons/ri";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchPromotions();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cards');
      if (Array.isArray(response.data)) {
        console.log("Array preenchido", response.data)
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error no carregamento das cartas:", error);
      setItems([]);
    }
  };

  const fetchPromotions = async () => {
    try {
        const response = await axios.get("http://localhost:5000/promotions/");
        setPromotions(response.data);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
};


  return (
    <Container>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <h3>Analytics overview</h3>
      </div>
      <div className="dashboard-panel">
        <div className="square">
          <div className="content">
            <h4>Total cadastrados</h4>
            <span className="number">{items.length}</span>
          </div>
          <div className="icon-square">
            <TbCards />
          </div>
        </div>
        <div className="square">
          <div className="content">
            <h4>Estoque total</h4>
            <span className="number">{items.reduce((total, item) => total + (item.stock || 0), 0)}</span>
          </div>
          <div className="icon-square">
            <TbCircleCheck />
          </div>
        </div>
        <div className="square">
          <div className="content">
            <h4>Sem estoque</h4>
            <span className="number">{items.filter(item => item.stock === 0).length}</span>
          </div>
          <div className="icon-square">
            <TbXboxX />
          </div>
        </div>
        <div className="square">
          <div className="content">
            <h4>Em promoção</h4>
            <span className="number">{promotions.length}</span>
          </div>
          <div className="icon-square">
            <MdOutlineLocalOffer />
          </div>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <div className="chart-header">
            <FaChartColumn />
          </div>
          <ColumnChartComponent />
        </div>
        <div className="chart">
          <div className="chart-header"> 
            <RiLineChartLine  /> 
            </div> 
            <LineChartComponent /> 
            </div>
      </div>
    </Container>
  );
}

export default Dashboard;
