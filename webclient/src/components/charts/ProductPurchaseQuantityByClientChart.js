import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; 
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const ProductPurchaseQuantityByClientChart = ({ productId }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/Products/product-purchase-quantity-by-client/${productId}`);
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Expected data to be an array');
                }

                const validData = data.filter(item => item.clientName && item.totalQuantity !== undefined);

                if (validData.length === 0) {
                    throw new Error('No valid data available');
                }

                const labels = validData.map(item => item.clientName);
                const quantities = validData.map(item => item.totalQuantity);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Quantity Purchased',
                            data: quantities,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)', 
                            borderColor: 'rgba(75, 192, 192, 1)', 
                            borderWidth: 1, 
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
            <h2>Quantity Purchased by Client</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <Bar data={chartData} />}
        </div>
    );
};

export default ProductPurchaseQuantityByClientChart;
