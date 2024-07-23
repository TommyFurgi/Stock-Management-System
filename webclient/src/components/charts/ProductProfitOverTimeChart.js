import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const ProductTransactionsOverTimeChart = ({ productId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const transformData = (data) => {
        const labels = data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
        const profits = data.map(item => item.totalProfit);

        return {
            labels,
            datasets: [
                {
                    label: 'Total Profit',
                    data: profits,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                },
            ],
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: profitData } = await axios.get(`/api/Products/product-profit-over-time/${productId}`);

                if (!Array.isArray(profitData) || profitData.length === 0) {
                    throw new Error('No valid data available');
                }

                setChartData(transformData(profitData));
            } catch (error) {
                setError('Error fetching data for chart');
                console.error('Error fetching data for chart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    return (
        <div className="products-chart-container">
            <h2>Profit on Product Over Time</h2>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <Line data={chartData} />}
        </div>
    );
};

export default ProductTransactionsOverTimeChart;
