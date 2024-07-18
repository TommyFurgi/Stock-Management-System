import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdClear } from 'react-icons/md';
import '../styles/ClientsList.css';
import '../styles/Table.css';
import AddNewClient from './AddNewClient';

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch data from API
    axios.get('http://localhost:5193/api/clients')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="table-container">
      
      <div className="head-container">
        <h1>Clients List</h1>
        <div className="search-container">
          <label htmlFor="search">Search client: </label>
          <input 
            type="text" 
            id="search" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Enter client name..." 
          />
          {searchTerm && (
            <MdClear className="clear-icon" onClick={handleClearSearch} />
          )}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase())).map(filteredClient => (
            <tr key={filteredClient.id}>
              <td><Link to={`/clients/${filteredClient.id}`} className="link">{filteredClient.name}</Link></td>
              <td>{filteredClient.email}</td>
              <td>{filteredClient.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddNewClient />
    </div>
  );
}

export default ClientsList;
