import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function PriceChart({ flightData }) {
  const data = {
    labels: flightData.map(data => data.date), // Assuming 'date' is formatted appropriately
    datasets: [
      {
        label: 'Forward Flights',
        data: flightData.map(data => data.forwardPrice),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
      },
      {
        label: 'Backward Flights',
        data: flightData.map(data => data.backwardPrice),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price ($)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return <Line data={data} options={options} />;
}

export default PriceChart;
