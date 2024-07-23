import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const ProductTransactionsOverTimeChart = () => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/InvoiceItems/top-sellers`);
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Expected data to be an array');
                }

                const labels = data.map(item => item.productName);
                const quantities = data.map(item => item.quantity);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Quantity Sold',
                            data: quantities,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            fill: true,
                        },
                    ],
                });
                setLoading(false);
            } catch (error) {
                setError('Error fetching data for chart');
                console.error('Error fetching data for chart:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="products-chart-container">
            <h2>Top 8 Best Selling Products</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <Bar data={chartData} />}
        </div>
    );
};

export default ProductTransactionsOverTimeChart;
