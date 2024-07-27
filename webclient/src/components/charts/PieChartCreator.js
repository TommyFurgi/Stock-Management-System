import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import '../../styles/Charts.css';

const defaultColors = [
    'rgba(255, 99, 132, 0.5)', 
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)', 
    'rgba(75, 192, 192, 0.5)', 
    'rgba(153, 102, 255, 0.5)', 
    'rgba(255, 159, 64, 0.5)', 
    'rgba(135, 135, 135, 0.5)', 
    'rgba(83, 102, 255, 0.5)', 
    'rgba(122, 203, 154, 0.5)', 
    'rgba(245, 136, 130, 0.5)'  
];

const defaultBorderColors = [
    'rgba(255, 99, 132, 1)', 
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)', 
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)', 
    'rgba(255, 159, 64, 1)',
    'rgba(135, 135, 135, 1)',
    'rgba(83, 102, 255, 1)', 
    'rgba(122, 203, 154, 1)', 
    'rgba(245, 136, 130, 1)'  
];

const PieChartCreator = ({ title, endpoint, labelField = '', dataField, backgroundColor = [], borderColor = [] }) => {
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

                const validData = data.filter(item => item[labelField] !== undefined && item[dataField] !== undefined);

                if (validData.length === 0) {
                    throw new Error('No valid data available');
                }

                const labels = validData.map(item => item[labelField]);
                const dataset = validData.map(item => item[dataField]);

                const colors = backgroundColor.length >= labels.length 
                    ? backgroundColor 
                    : Array(labels.length).fill().map((_, i) => defaultColors[i % defaultColors.length]);

                const borders = borderColor.length >= labels.length 
                    ? borderColor 
                    : Array(labels.length).fill().map((_, i) => defaultBorderColors[i % defaultBorderColors.length]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: dataset,
                            backgroundColor: colors,
                            borderColor: borders,
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
    }, [endpoint, labelField, dataField, title, backgroundColor, borderColor]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'center',
                labels: {
                    boxWidth: 10,
                    padding: 15,
                    color: '#333',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const label = tooltipItem.label || '';
                        const value = tooltipItem.raw || '';
                        return `${label}: ${value}`;
                    }
                }
            }
        }
    };

    return (
        <div className="products-chart-container">
            <h2 className="chart-title">{title}</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
            <div className="wrapper"> 
                <Pie data={chartData} options={options} />
            </div>)}
        </div>
    );
};

export default PieChartCreator;
