import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
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

export function ColumnChartComponent({ data }) {
  const seriesData = [
    data.common,
    data.uncommon,
    data.rare,
    data.ultraRare,
    data.others,
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

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
}

export function LineChartComponent({ data }) {
  const chartRef = useECharts(data);

  return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
}
