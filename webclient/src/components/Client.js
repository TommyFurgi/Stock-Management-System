import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import InvoiceTableWithFilter from './InvoiceTableWithFilter';
import "../styles/Profile.css";
import "../styles/Table.css";

function ClientDetails() {
  const { id } = useParams(); 
  const [client, setClient] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientsResponse = await axios.get(`http://localhost:5193/api/clients/${id}`);
        setClient(clientsResponse.data);
        setEditedClient(clientsResponse.data);

        if (clientsResponse.data && clientsResponse.data.invoicesId) {
          const invoiceRequests = clientsResponse.data.invoicesId.map(invoiceId => 
            axios.get(`http://localhost:5193/api/invoices/${invoiceId}`));
          const invoiceResponses = await Promise.all(invoiceRequests);
          const invoiceData = invoiceResponses.map(response => response.data);
          setInvoices(invoiceData);
        }

        setLoading(false);
      }
      catch(error) {
        console.error(`Error fetching client with ID ${id}:`, error);
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClient({ ...editedClient, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!editedClient.name) errors.name = "Name is required.";
    if (!editedClient.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(editedClient.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!editedClient.phoneNumber) errors.phoneNumber = "Phone number is required.";
    return errors;
  };

  const handleEditClient = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true); 
      axios.put(`http://localhost:5193/api/clients/${id}`, editedClient)
        .then(response => {
          setClient(editedClient);
          setEditMode(false);
          setErrors({});
          setLoading(false);  
        })
        .catch(error => {
          console.error('Error updating client:', error);
          setLoading(false); 
        });
    }
  };

  return (
    <div className="profile-overview-container">
      <div className="profile-details">
        <div className="profile-details-header">
          <img src="/images/client-avatar.png" alt="Account-image" />
  
          {loading ? (
            <p>Loading client details...</p>
          ) : editMode ? (
            <form className="edit-profile-form" onSubmit={handleEditClient}>
              <h2>Edit Client</h2>
              {client && <p><strong>ID:</strong> {client.id}</p>}
              <strong>Name:</strong>
              <input 
                type="text" 
                name="name" 
                value={editedClient.name} 
                onChange={handleInputChange} 
              />
              {errors.name && <p className="error">{errors.name}</p>}
              <strong>Email:</strong>
              <input 
                type="email" 
                name="email" 
                value={editedClient.email} 
                onChange={handleInputChange} 
              />
              {errors.email && <p className="error">{errors.email}</p>}
              <strong>Phone Number:</strong>
              <input 
                type="text" 
                name="phoneNumber" 
                value={editedClient.phoneNumber} 
                onChange={handleInputChange} 
              />
              {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
              <div className="group-buttons">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <h2>Client Details</h2>
              {client && (
                <>
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
                </>
              )}
              <button className="edit-button" onClick={() => setEditMode(true)}>Edit Client</button>
            </div>
          )}
        </div>
      </div>

      <InvoiceTableWithFilter invoices={invoices} clientName={client?.name || ""} />     
        
    </div>
     
  );
  
  
}

export default ClientDetails;
