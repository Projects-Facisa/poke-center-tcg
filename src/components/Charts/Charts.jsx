import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import axios from 'axios';
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

const fetchData = async (setData, setLineData) => {
  try {
    const response = await axios.get('http://localhost:5000/cards');

    if (Array.isArray(response.data)) {
      const rarityCounts = {
        common: 0,
        uncommon: 0,
        rare: 0,
        ultraRare: 0,
        others: 0,
      };

      const counts = Array(31).fill(0);

      response.data.forEach(item => {
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

      setData(rarityCounts);
      setLineData(prevData => ({
        ...prevData,
        series: [{
          ...prevData.series[0],
          data: counts,
        }],
      }));
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

export function ColumnChartComponent() {
  const [data, setData] = useState({
    common: 0,
    uncommon: 0,
    rare: 0,
    ultraRare: 0,
    others: 0
  });

  const seriesData = [
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
  }));

  const columnData = {
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
        data: seriesData,
        type: "bar",
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
  };

  const chartRef = useECharts(columnData);

  useEffect(() => {
    fetchData(setData, () => {});
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

  const chartRef = useECharts(lineData);

  useEffect(() => {
    fetchData(() => {}, setLineData);
  }, []);

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
}
