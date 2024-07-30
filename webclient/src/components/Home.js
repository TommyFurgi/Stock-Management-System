import React from 'react';
import '../styles/Home.css';

function Home() {
    return (
        <div className="home-container">
          <h1>About Project</h1>
          
          <p>
            <b>Stock Management System</b> is a sophisticated web application designed to provide comprehensive 
            management and analytical capabilities for businesses. Built with a modern tech stack, including React 
            for the frontend and C# with Entity Framework (EF) for the backend, this system leverages a SQLite3 
            database to store and manage data efficiently.
          </p>

          <p>
            The key features of the <b>Stock Management System</b> include:
          </p>

          <ul>
            <li>
              <b>Client Management:</b> Add, update, and manage client information seamlessly. Maintain detailed 
              records of client interactions and transactions.
            </li>
            <li>
              <b>Product Management:</b> Efficiently add, update, and organize products. Keep track of stock levels, 
              pricing, and product details.
            </li>
            <li>
              <b>Invoice Management:</b> Generate and manage invoices for clients. Keep track of billing history and 
              payment statuses.
            </li>
            <li>
              <b>Data Visualization:</b> Use integrated charts and graphs to analyze data trends. Visualize key metrics 
              to make informed business decisions.
            </li>
            <li>
              <b>Backend API:</b> The backend, developed in C# with EF, provides robust API endpoints for interacting 
              with the SQLite3 database. This ensures efficient data handling and integration capabilities.
            </li>
            <li>
              <b>SQLite3 Database:</b> Utilize a lightweight and efficient SQLite3 database for storing and managing 
              data. Ensure data integrity and quick access to records.
            </li>
            <li>
              <b>Secure Data Handling:</b> Implement security measures to protect sensitive client and product data. 
              Ensure secure transactions and data storage.
            </li>
            <li>
              <b>Scalable Architecture:</b> Designed to scale with your business, the system can handle increasing 
              amounts of data and users without compromising performance.
            </li>
          </ul>

          <p>
            The <b>Stock Management System</b> is perfect for businesses looking to streamline their inventory 
            management and enhance their data analysis capabilities. Whether you are managing a small business or a 
            large enterprise, this system provides the tools and features necessary to improve operational efficiency 
            and support data-driven decision-making.
          </p>

          <p>
            With a focus on usability and functionality, our system ensures that you can manage clients, products, 
            and invoices with ease. The integrated data visualization features provide valuable insights, helping you 
            to identify trends, track performance, and make strategic decisions.
          </p>

        </div>
    );
}

export default Home;
