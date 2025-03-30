import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: { _id: string; count: number }[];
  title?: string;
  color?: string;
  horizontal?: boolean;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title = "",
  color = "rgba(54, 162, 235, 0.8)",
  horizontal = false,
  height = 300,
}) => {
  // Prepare and sort data
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
  const labels = sortedData.map((item) => item._id);
  const counts = sortedData.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        backgroundColor: color,
        borderColor: color.replace("0.8", "1"),
        borderWidth: 1,
      },
    ],
  };

  const options: {
    indexAxis: "x" | "y";
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins: any;
    scales: any;
  } = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: Boolean(title),
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Count: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Box height={height} width="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default BarChart;
