import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css'; 

const Menu = () => {
    return (
        <header>
            <nav>
                <Link to="/" className="active">Home</Link>
                <Link to="/clients">Clients</Link>
                <Link to="/products">Products</Link>
            </nav>
        </header>
    );
};

export default Menu;
