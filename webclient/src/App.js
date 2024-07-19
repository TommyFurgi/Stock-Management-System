import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './styles/App.css';
import Menu from './components/Menu';
import ClientsList from './components/ClientsList';
import Client from './components/Client';
import Home from './components/Home';
import ProductsList from './components/ProductsList';
import Product from './components/Product';
import InvoicesList from './components/InvoicesList'
import Invoice from './components/Invoice'

function App() {

  useEffect(() => {
    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.fog.min.js');
        
        if (window.VANTA) {
          console.log("VANTA loaded successfully");
          window.VANTA.FOG({
            el: "#background",
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 600.00,
            minWidth: 200.00,
            highlightColor: 0x3f7bff,
            lowlightColor: 0x1eff00,
            baseColor: 0xfff9eb,
            speed: 0.5
          });
        } else {
          console.log("VANTA is not defined");
        }
      } catch (error) {
        console.error("Failed to load scripts:", error);
      }
    };
  
    initVanta();
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
      <Helmet>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.fog.min.js"></script>
      </Helmet>
      <Router>
        <div id="background" ></div>
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
