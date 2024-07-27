import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTableWithFilter from './InvoiceTableWithFilter';
import LineChartCreator from "./charts/LineChartCreator"
import '../styles/Charts.css';
import '../styles/InvoicesList.css';
import '../styles/Table.css';
import '../styles/Filter.css';

function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [fullscreenChart, setFullscreenChart] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5193/api/invoices')
      .then(response => {
        setInvoices(response.data);
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
      });
  }, []);

  const handleChartClick = (chartType) => {
    setFullscreenChart(chartType);
    document.body.classList.add('fullscreen-active'); 
  };

  const handleOverlayClick = () => {
      setFullscreenChart(null);
      document.body.classList.remove('fullscreen-active'); 
  };

  return (
    <div className="table-container">
      <InvoiceTableWithFilter invoices={invoices} clientName={""} />  

      <div className={`charts-section ${fullscreenChart ? 'blurred' : ''}`}>
        <div className="chart-container" onClick={() => handleChartClick('quantity')}>
          <LineChartCreator 
              title="Cumulative Invoices Over Time"
              endpoint={`/api/invoices/cumulative-invoices-over-time`}
              dataField="cumulativeCount"
              dateLabels={true}
              agenda="Number of Invoices"
          />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('profit')}>
          <LineChartCreator 
                title="Total Profit Over the Time"
              endpoint={`/api/Invoices/total-profit-over-time`}
              dataField="totalProfit"
              dateLabels={true}
              color="rgba(255, 99, 132, 1)"
              backgroundColor="rgba(255, 99, 132, 0.2)"
              agenda="Overal Profit by the Time"
          />
        </div>
      </div>

      {fullscreenChart && (
        <div className="fullscreen-chart" onClick={handleOverlayClick}>
          <div className="chart-container" onClick={(e) => e.stopPropagation()}>
            {fullscreenChart === 'quantity' && 
            <LineChartCreator 
                title="Cumulative Invoices Over Time"
                endpoint={`/api/invoices/cumulative-invoices-over-time`}
                dataField="cumulativeCount"
                dateLabels={true}
                agenda="Number of Invoices"
            />}

            {fullscreenChart === 'profit' && 
            <LineChartCreator 
                title="Total Profit Over the Time"
                endpoint={`/api/Invoices/total-profit-over-time`}
                dataField="totalProfit"
                dateLabels={true}
                color="rgba(255, 99, 132, 1)"
                backgroundColor="rgba(255, 99, 132, 0.2)"
                agenda="Overal Profit by the Time"
            />} 
        </div>
        </div>
      )}
    </div>
  );
}

export default InvoicesList;
