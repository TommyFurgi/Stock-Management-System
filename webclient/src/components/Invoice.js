import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import InvoiceItemsTable from './InvoiceItemsTable';
import BarChartCreator from "./charts/BarChartCreator";
import PieChartCreator from "./charts/PieChartCreator";
import '../styles/Charts.css';
import "../styles/Invoice.css";
import "../styles/Profile.css";

function InvoiceDetails() {
  const { id } = useParams(); 
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenChart, setFullscreenChart] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        // Fetch invoice data
        const invoiceResponse = await axios.get(`http://localhost:5193/api/invoices/${id}`);
        setInvoice(invoiceResponse.data);

        // Fetch client data if available
        if (invoiceResponse.data && invoiceResponse.data.clientId) {
          const clientResponse = await axios.get(`http://localhost:5193/api/clients/${invoiceResponse.data.clientId}`);
          setClient(clientResponse.data);
        }

        // Fetch data for each invoice items
        if (invoiceResponse.data && invoiceResponse.data.invoiceItems && invoiceResponse.data.invoiceItems.length > 0) {
          const itemRequests = invoiceResponse.data.invoiceItems.map(itemId => 
            axios.get(`http://localhost:5193/api/invoiceItems/${itemId}`)
          );
          const itemResponses = await Promise.all(itemRequests);
          const itemsData = itemResponses.map(response => response.data);
          setInvoiceItems(itemsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChartClick = (chartType) => {
    setFullscreenChart(chartType);
    document.body.classList.add('fullscreen-active'); 
  };

  const handleOverlayClick = () => {
      setFullscreenChart(null);
      document.body.classList.remove('fullscreen-active'); 
  };

  return (
    <div className="invoice-details-container">
      <div className="invoice-details-inner">
        <div className="owner-details">
            <div className="profile-details-header">
                <img src="/images/client-avatar.png" alt="Account-image" />
                <div className="profile-info">
                    <h2>Invoice Client Details</h2>
                    <p><strong>ID:</strong> {client.id}</p>
                    <div className="profile-field">
                        <strong>Name:</strong>
                        <p>{client.name}</p>
                    </div>
                    <div className="profile-field">
                        <strong>Email:</strong>
                        <p>{client.email}</p>
                    </div>
                    <div className="profile-field">
                        <strong>Phone Number:</strong>
                        <p>{client.phoneNumber}</p>
                    </div>
                    
                  <Link to={`/clients/${client.id}`} className="profile-link-button">
                    View Full Profile
                  </Link>
                </div>
                
            </div>
              
        </div>
        <div className="invoice-details">
          <h2>Invoice Details</h2>
          <div className="description-field">
              <strong>Invoice ID:</strong>
              <p>{invoice.id}</p>
          </div>
          <div className="description-field">
              <strong>Date of Issue:</strong>
              <p>{formatDate(invoice.dateOfIssue)}</p>
          </div>
          <div className="description-field">
              <strong>Number of Products:</strong>
              <p>{invoice.numberOfProducts}</p>
          </div>
          <div className="description-field">
              <strong>Total Quantity:</strong>
              <p>{invoice.totalQuantity}</p>
          </div>
          <div className="description-field">
              <strong>Price:</strong>
              <p>{invoice.price}</p>
          </div>
          <div className="description-field">
              <strong>Discount:</strong>
              <p>{invoice.discount}</p>
          </div>
          <div className="description-field">
              <strong>Final cost:</strong>
              <p>{invoice.totalAmount}</p>
          </div>
        </div>
      </div>
      <div className="invoice-items-list">
        <InvoiceItemsTable items={invoiceItems}/>
      </div>
      
      <div className={`charts-section ${fullscreenChart ? 'blurred' : ''}`}>
        <div className="chart-container" onClick={() => handleChartClick('price-bar-chart')}>
          <BarChartCreator 
              title="Product Prices on Invoice"
              endpoint={`/api/InvoiceItems/items-prices/${id}`}
              labelField="productName"
              dataField="price"
              agenda="Invoice Pricing Details"
          />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('price-pie-chart')}>
          <PieChartCreator 
              title="Product Prices Overview"
              endpoint={`/api/InvoiceItems/items-prices/${id}`}
              labelField="productName"
              dataField="price"
          />
        </div>
      </div>

      {fullscreenChart && (
        <div className="fullscreen-chart" onClick={handleOverlayClick}>
          <div className="chart-container" onClick={(e) => e.stopPropagation()}>
            {fullscreenChart === 'price-bar-chart' && 
            <BarChartCreator 
              title="Product Prices on Invoice"
              endpoint={`/api/InvoiceItems/items-prices/${id}`}
              labelField="productName"
              dataField="price"
              agenda="Invoice Pricing Details"
            />}
            {fullscreenChart === 'price-pie-chart' && 
            <PieChartCreator 
              title="Product Prices Overview"
              endpoint={`/api/InvoiceItems/items-prices/${id}`}
              labelField="productName"
              dataField="price"
            />}

          </div>
        </div>
      )}
      
    </div>
  );
}

export default InvoiceDetails;
