import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/Charts.css';

const ProductsQuantityOverTimeChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5193/api/products/quantity-over-time')
      .then(response => {
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error('Expected data to be an array');
        }

        const labels = data.map(entry => formatDate(entry.date));
        const quantities = data.map(entry => entry.cumulativeQuantity);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Cumulative Quantity Over Time',
              data: quantities,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data for chart');
        console.error('Error fetching data for chart:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); 
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="products-chart-container">
      <h2>Products Cumulative Quantity Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ProductsQuantityOverTimeChart;
