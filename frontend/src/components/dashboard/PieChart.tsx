import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/material";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { _id: string; count: number }[];
  title?: string;
  colors?: string[];
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = "",
  colors = [],
  height = 300,
}) => {
  // Sort data by count (descending)
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const labels = sortedData.map((item) => item._id);
  const counts = sortedData.map((item) => item.count);

  // Default color palette if none provided
  const defaultColors = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors.length > 0 ? colors : defaultColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      title: {
        display: Boolean(title),
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Box height={height} width="100%" display="flex" justifyContent="center">
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default PieChart;
