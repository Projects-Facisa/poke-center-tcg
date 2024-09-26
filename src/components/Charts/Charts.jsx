import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import axios from 'axios'; // Importar axios se não estiver já
import "./Charts.css";

const colors = ["#B0B0B0", "#2ECC71", "#3498DB", "#9B59B6", "#F1C40F"];
const borderColors = ["#7F7F7F", "#27AE60", "#2980B9", "#8E44AD", "#D4AC0D"];

function useECharts(option) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [option]);

  return chartRef;
}

export function ColumnChartComponent() {
  const [data, setData] = useState({ common: 0, uncommon: 0, rare: 0, ultraRare: 0, others: 0 });
  const chartRef = useECharts({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
      backgroundColor: "rgba(50, 50, 50, 0.8)",
      borderColor: "#777",
      borderWidth: 1,
      textStyle: {
        color: "#fff",
      },
      formatter: (params) => {
        const category = params[0].name;
        const value = params[0].value;
        return `<strong>${category}</strong>: ${value} itens`;
      },
    },
    xAxis: {
      type: "category",
      data: ["Common", "Uncommon", "Rare", "Ultra Rare", "Others"],
      axisLabel: {
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#ddd",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: [
          data.common,
          data.uncommon,
          data.rare,
          data.ultraRare,
          data.others
        ].map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index],
            borderColor: borderColors[index],
            borderWidth: 2,
            borderRadius: [5, 5, 0, 0],
          },
        })),
        label: {
          show: true,
          position: "top",
          fontSize: 14,
          color: "#333",
        },
        animationDuration: 1500,
        animationEasing: "cubicOut",
      },
    ],
  });

  useEffect(() => {
    const fetchRarityCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard');
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const text = await response.text();
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
  
        const result = JSON.parse(text);
        
        setData({
          common: result.common || 0,
          uncommon: result.uncommon || 0,
          rare: result.rare || 0,
          ultraRare: result.ultraRare || 0,
          others: result.others || 0
        });
        
        console.log('Dashboard data fetched:', result);
      } catch (error) {
        console.error('Erro ao buscar contagens de raridades:', error);
      }
    };
  
    fetchRarityCounts();
  }, []);

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
}

export function LineChartComponent() {
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
        data: Array(31).fill(0), // Inicializa com zeros
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

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cards');
      
      if (Array.isArray(response.data)) {
        const counts = Array(31).fill(0); // Inicializa um array para contagem de dias

        response.data.forEach(item => {
          // Certifique-se de que o campo 'purchaseDate' existe
          if (item.purchaseDate) {
            const date = new Date(item.purchaseDate); // Acesse o campo purchaseDate
            if (!isNaN(date)) {
              const day = date.getDate();
              if (day >= 1 && day <= 31) {
                counts[day - 1] += 1; // Incrementa a contagem para o dia correspondente
              }
            } else {
              console.warn("Data inválida:", item.purchaseDate);
            }
          } else {
            console.warn("Campo de purchaseDate ausente no item:", item);
          }
        });

        // Atualizar os dados do gráfico com as contagens
        setLineData(prevData => ({
          ...prevData,
          series: [{
            ...prevData.series[0],
            data: counts,
          }],
        }));

      } else {
        console.error("Os dados não são um array:", response.data);
      }
    } catch (error) {
      console.error("Error no carregamento das cartas:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const chartRef = useECharts(lineData);
  
  return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
}