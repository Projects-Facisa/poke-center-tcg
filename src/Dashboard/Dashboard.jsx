import "./Dashboard.css";
import Container from "../components/Container/Container.jsx";
import React, { useEffect, useState } from "react";
import {
  ColumnChartComponent,
  LineChartComponent,
} from "../components/Charts/Charts.jsx";
import { FaChartColumn } from "react-icons/fa6";
import { TbCards, TbCircleCheck, TbXboxX } from "react-icons/tb";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RiLineChartLine } from "react-icons/ri";
import axios from "axios";

function Dashboard() {
  const [items, setItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [chartData, setChartData] = useState({
    common: 0,
    uncommon: 0,
    rare: 0,
    ultraRare: 0,
    others: 0,
  });
  const [lineData, setLineData] = useState({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      borderColor: "#777",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Cartas Registradas",
        data: Array(31).fill(0),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#3248DB",
        },
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get("http://localhost:5000/cards");
        const itemsData = itemsResponse.data;
        setItems(itemsData);

        // Fetch das promoções
        const promotionsResponse = await axios.get(
          "http://localhost:5000/promotions/"
        );
        setPromotions(promotionsResponse.data);

        const rarityCounts = {
          common: 0,
          uncommon: 0,
          rare: 0,
          ultraRare: 0,
          others: 0,
        };
        const counts = Array(31).fill(0);

        itemsData.forEach((item) => {
          const rarity = item.rarity;
          if (rarity === "Common") {
            rarityCounts.common += 1;
          } else if (rarity === "Uncommon") {
            rarityCounts.uncommon += 1;
          } else if (rarity === "Rare") {
            rarityCounts.rare += 1;
          } else if (rarity === "Ultra Rare") {
            rarityCounts.ultraRare += 1;
          } else {
            rarityCounts.others += 1;
          }

          if (item.purchaseDate) {
            const date = new Date(item.purchaseDate);
            if (!isNaN(date)) {
              const day = date.getDate();
              if (day >= 1 && day <= 31) {
                counts[day - 1] += 1;
              }
            }
          }
        });

        setChartData(rarityCounts);
        setLineData((prevData) => ({
          ...prevData,
          series: [
            {
              ...prevData.series[0],
              data: counts,
            },
          ],
        }));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

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
            <span className="number">
              {items.reduce((total, item) => total + (item.stock || 0), 0)}
            </span>
          </div>
          <div className="icon-square">
            <TbCircleCheck />
          </div>
        </div>
        <div className="square">
          <div className="content">
            <h4>Sem estoque</h4>
            <span className="number">
              {items.filter((item) => item.stock === 0).length}
            </span>
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
          <ColumnChartComponent data={chartData} />
        </div>
        <div className="chart">
          <div className="chart-header">
            <RiLineChartLine />
          </div>
          <LineChartComponent data={lineData} />
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
