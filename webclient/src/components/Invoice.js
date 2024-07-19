import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import "../styles/Profile.css";

function InvoiceDetails() {
  const { id } = useParams(); 
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        // Fetch invoice data
        const invoiceResponse = await axios.get(`http://localhost:5193/api/invoices/${id}`);
        console.log('Invoice API response:', invoiceResponse.data);
        setInvoice(invoiceResponse.data);

        // Fetch client data if available
        if (invoiceResponse.data && invoiceResponse.data.clientId) {
          const clientResponse = await axios.get(`http://localhost:5193/api/clients/${invoiceResponse.data.clientId}`);
          console.log('Client API response:', clientResponse.data);
          setClient(clientResponse.data);
        }

        // Fetch data for each invoice item
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
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overview-container">
        <div className="profile-overview-container">
            <div className="profile-details">
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
                        
                        
                    </div>
                    <Link to={`/clients/${client.id}`} className="profile-link-button">
                        View Full Profile
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}

export default InvoiceDetails;
