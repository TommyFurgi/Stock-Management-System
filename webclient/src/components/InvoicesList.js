import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InvoiceTableWithFilter from './InvoiceTableWithFilter';
import '../styles/InvoicesList.css';
import '../styles/Table.css';
import '../styles/Filter.css';

function InvoicesList() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5193/api/invoices')
      .then(response => {
        setInvoices(response.data);
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
      });
  }, []);

  return (
    <div className="table-container">
      <InvoiceTableWithFilter invoices={invoices} clientName={""} />  
    </div>
  );
}

export default InvoicesList;
