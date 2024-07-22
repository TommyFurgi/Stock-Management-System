import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import Menu from './components/Menu';
import ClientsList from './components/ClientsList';
import Client from './components/Client';
import Home from './components/Home';
import ProductsList from './components/ProductsList';
import Product from './components/Product';
import InvoicesList from './components/InvoicesList';
import Invoice from './components/Invoice';

function App() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r110/three.min.js'); 
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.waves.min.js');
        
        if (window.VANTA && backgroundRef.current) {
          window.VANTA.WAVES({
            el: backgroundRef.current,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 600.00,
            minWidth: 200.00,
            color: 0x5477a4,
            speed: 0.25
          });
        } else {
          console.log("VANTA is not defined or element not found");
        }
      } catch (error) {
        console.error("Failed to load scripts:", error);
      }
    };
  
    initVanta();

    const backgroundElement = backgroundRef.current;
  
    return () => {
      if (window.VANTA && backgroundElement) {
        window.VANTA.WAVES({
          el: backgroundElement
        }).destroy();
      }
    };
  }, []);
  

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        console.log(`${src} loaded successfully`);
        resolve();
      };
      script.onerror = (error) => {
        console.error(`Failed to load ${src}`, error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  };

  return (
    <div className="app">
      <Router>
        <div id="background" ref={backgroundRef} ></div>
        <div className="main-container">
          <Menu />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/:id" element={<Client />} /> 
              <Route path="/products" element={<ProductsList />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/invoices" element={<InvoicesList />} />
              <Route path="/invoices/:id" element={<Invoice />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
