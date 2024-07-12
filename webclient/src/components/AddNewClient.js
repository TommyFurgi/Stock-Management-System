import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddNew.css'; 

function AddNewClient({ setClients, clients }) {
  const [newClient, setNewClient] = useState({ name: '', email: '', phoneNumber: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!newClient.name) errors.name = 'Name is required';
    if (!newClient.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newClient.email)) errors.email = 'Email is invalid';
    if (!newClient.phoneNumber) errors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(newClient.phoneNumber)) errors.phoneNumber = 'Phone number is invalid';
    return errors;
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axios.post('http://localhost:5193/api/clients', newClient)
        .then(response => {
          setClients([...clients, response.data]);
          setNewClient({ name: '', email: '', phoneNumber: '' });
          setErrors({});
        })
        .catch(error => {
          console.error('Error adding new client:', error);
        });
    }
  };

  const handleClearForm = () => {
    setNewClient({ name: '', email: '', phoneNumber: '' });
    setErrors({});
  };

  return (
    <div className="add-new-container">
      <h2>Add New Client</h2>
      <form className="add-new-form" onSubmit={handleAddClient}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
        
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
        
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={newClient.phoneNumber}
          onChange={handleInputChange}
          required
        />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        
        <div className="button-group">
          <button type="submit">Add Client</button>
          <button type="reset" onClick={handleClearForm}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewClient;
