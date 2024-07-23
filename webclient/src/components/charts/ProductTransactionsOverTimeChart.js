import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const ProductTransactionsOverTimeChart = ({ productId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Products/product-transactions-over-time/${productId}`);
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Expected data to be an array');
                }

                const validData = data.filter(item => item.year && item.month !== undefined && item.transactionCount !== undefined);

                if (validData.length === 0) {
                    throw new Error('No valid data available');
                }

                const labels = validData.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
                const transactionCounts = validData.map(item => item.transactionCount);
                console.log(validData);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Number of Transactions',
                            data: transactionCounts,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
    }, [productId]);

    return (
        <div className="products-chart-container">
            <h2>Transactions Over Time</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <Line data={chartData} />}
        </div>
    );
};

export default ProductTransactionsOverTimeChart;
