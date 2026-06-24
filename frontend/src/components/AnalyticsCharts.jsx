import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsCharts = ({ monthlyTrends = [] }) => {
  const labels = monthlyTrends.map((trend) => trend.month);
  const dataValues = monthlyTrends.map((trend) => trend.count);

  const data = {
    labels,
    datasets: [
      {
        label: 'Reports Filed',
        data: dataValues,
        fill: true,
        borderColor: '#00f0ff',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        tension: 0.4,
        pointBorderColor: '#00f0ff',
        pointBackgroundColor: '#030712',
        pointHoverBackgroundColor: '#00f5d4',
        pointHoverBorderColor: '#00f5d4',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.85)',
        titleColor: '#00f0ff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 240, 255, 0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 10,
          },
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="glass p-6 rounded-2xl border border-dark-border bg-dark-card w-full h-[320px] shadow-neon-blue">
      <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Monthly Waste Trend Reports</h3>
      <div className="w-full h-[220px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsCharts;
