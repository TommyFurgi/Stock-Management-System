import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const LineChartCreator = ({ title, endpoint, labelField = '', dataField, agenda, backgroundColor = 'rgba(75, 192, 192, 0.5)', borderColor = 'rgba(75, 192, 192, 1)', dateLabels = false }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(endpoint);
                const data = response.data;

                if (!Array.isArray(data)) {
                    throw new Error('Expected data to be an array');
                }

                const validData = data.filter(item => (dateLabels ? (item.year !== undefined && item.month !== undefined) : item[labelField] !== undefined) && item[dataField] !== undefined);

                if (validData.length === 0) {
                    throw new Error('No valid data available');
                }

                const labels = dateLabels ? validData.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`) : validData.map(item => item[labelField]);
                const dataset = validData.map(item => item[dataField]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: agenda,
                            data: dataset,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
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
    }, [endpoint, labelField, dataField, agenda, title, backgroundColor, borderColor, dateLabels]);

    return (
        <div className="products-chart-container">
            <h2>{title}</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && <Bar data={chartData} />}
        </div>
    );
};

export default LineChartCreator;
