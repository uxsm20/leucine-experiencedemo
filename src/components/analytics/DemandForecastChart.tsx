import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateDemandForecast } from '../../services/analyticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Demand Forecast Analysis',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Units'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
};

export const DemandForecastChart: React.FC = () => {
  const forecastData = generateDemandForecast(30); // Get 30 days of forecast

  const data = {
    labels: forecastData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Actual Demand',
        data: forecastData.map(d => d.actual),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 4,
      },
      {
        label: 'Predicted Demand',
        data: forecastData.map(d => d.predicted),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        pointRadius: 2,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Line options={options} data={data} />
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold">AI-Powered Insights:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Predicted 15% demand increase in next 2 weeks</li>
          <li>Seasonal pattern detected with 92% confidence</li>
          <li>Recommended inventory adjustment: +10%</li>
        </ul>
      </div>
    </div>
  );
};
