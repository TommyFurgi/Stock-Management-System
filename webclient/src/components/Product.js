import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductHistoryTable from './ProductHistoryTable';
import LineChartCreator from "./charts/LineChartCreator";
import BarChartCreator from "./charts/BarChartCreator";
import "../styles/Profile.css";
import "../styles/Charts.css";

const defaultImage = '/images/default_product.png';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [items, setItems] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageURL: '',
    availableFrom: '',
  });
  const [increasedQuantity, setIncreasedQuantity] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5193/api/products/${id}`);
        setProduct(productResponse.data);
        setEditedProduct({
          id: productResponse.data.id,
          name: productResponse.data.name,
          description: productResponse.data.description || '',
          price: productResponse.data.price || 0,
          quantity: productResponse.data.quantity || 0,
          imageURL: productResponse.data.imageURL || '',
          availableFrom: productResponse.data.availableFrom ? productResponse.data.availableFrom.split('T')[0] : '',
        });

        if (productResponse.data && productResponse.data.invoiceItems && productResponse.data.invoiceItems.length > 0) {
          const itemRequests = productResponse.data.invoiceItems.map(itemId => 
            axios.get(`http://localhost:5193/api/invoiceItems/${itemId}`)
          );
          const itemResponses = await Promise.all(itemRequests);
          const itemsData = itemResponses.map(response => response.data);          
          setItems(itemsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors(error.message);
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: name === 'quantity' ? parseInt(value, 10) : value });
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);
  
    if (value === '' || parsedValue >= 0) {
      setIncreasedQuantity(parsedValue);
    }
  };
  

  const updateProductQuantity = async (quantity) => {
    if (quantity == null || quantity === '') {
      alert('Quantity cannot be empty');
      return;
    }
    const parsedValue = parseInt(quantity, 10);
    
    setLoading(true);
    try {
      await axios.put(`http://localhost:5193/api/products/increase-product-quantity-by/${id}`, parsedValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setProduct(prevProduct => ({
        ...prevProduct,
        quantity: prevProduct.quantity + parsedValue
      }));
      setEditedProduct(prevEditedProduct => ({
        ...prevEditedProduct,
        quantity: prevEditedProduct.quantity + parsedValue
      }));
      setIncreasedQuantity(0);
      setErrors({});
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const validate = () => {
    const errors = {};
    if (!editedProduct.name) errors.name = "Name is required.";

    if (editedProduct.price == null || product.price <= 0) {
        errors.price = "Price must be greater than 0.";
    } else if (isNaN(editedProduct.price)) {
        errors.price = "Price must be a valid number.";
    }
    if (editedProduct.quantity == null || !Number.isInteger(editedProduct.quantity) || product.quantity < 0) {
        errors.quantity = "Quantity must be an integer and greater than or equal to 0.";
    }
    return errors;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      axios.put(`http://localhost:5193/api/products/${id}`, editedProduct)
        .then(response => {
          setProduct(editedProduct);
          setEditMode(false);
          setErrors({});
          setLoading(false);
        })
        .catch(error => {
          console.error('Error updating product:', error);
          setLoading(false);
        });
    }
  };

  const handleChartClick = (chartType) => {
    setFullscreenChart(chartType);
    document.body.classList.add('fullscreen-active'); 
  };

  const handleOverlayClick = () => {
      setFullscreenChart(null);
      document.body.classList.remove('fullscreen-active'); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const imageURL = editedProduct.imageURL || defaultImage;

  return (
    <div className="profile-overview-container">
      <div className="profile-details">
        <div className="profile-details-header">
          <img src={imageURL} alt="Product img" />

          {editMode ? (
            <form className="edit-profile-form" onSubmit={handleEditProduct}>
              <h2>Edit Product</h2>
              <p><strong>ID:</strong> {editedProduct.id}</p>
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}

              <strong>Description:</strong>
              <textarea
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="error">{errors.description}</p>}

              <strong>Price:</strong>
              <input
                type="number"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
              />
              {errors.price && <p className="error">{errors.price}</p>}

              <strong>Quantity:</strong>
              <input
                type="number"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && <p className="error">{errors.quantity}</p>}

              <strong>Available From:</strong>
              <input
                type="date"
                name="availableFrom"
                value={editedProduct.availableFrom}
                onChange={handleInputChange}
              />
              {errors.availableFrom && <p className="error">{errors.availableFrom}</p>}

              <strong>Image URL:</strong>
              <input
                type="text"
                name="imageURL"
                value={editedProduct.imageURL}
                onChange={handleInputChange}
              />
              {errors.imageURL && <p className="error">{errors.imageURL}</p>}

              <div className="group-buttons">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <h2>Product Details</h2>
              <p><strong>ID:</strong> {product.id}</p>
              <div className="profile-field">
                <strong>Name:</strong>
                <p>{product.name}</p>
              </div>
              <div className="profile-field">
                <strong>Description:</strong>
                <p>{product.description || '-'}</p>
              </div>
              <div className="profile-field">
                <strong>Price:</strong>
                <p>{product.price}</p>
              </div>
              <div className="profile-field">
                <strong>Quantity:</strong>
                <p>{product.quantity}</p>
              </div>
              <div className="profile-field">
                <strong>Available From:</strong>
                <p>{formatDate(product.availableFrom)}</p>
              </div>

              <div className="buttons-container">
                <button className="edit-button" onClick={() => setEditMode(true)}>Edit Product</button>

                <div className="increase-quantity-container">
                  <input 
                    type="number" 
                    value={increasedQuantity} 
                    onChange={handleQuantityChange} 
                  />
                  <button className="increase-button" onClick={() => updateProductQuantity(increasedQuantity)}>Increase Quantity</button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <div className="items-list">
        <ProductHistoryTable items={items}/>
      </div>
      <div className={`charts-section ${fullscreenChart ? 'blurred' : ''}`}>
        <div className="chart-container" onClick={() => handleChartClick('transactions')}>
          <LineChartCreator 
              title="Number of Transactions Over Time"
              endpoint={`/api/Products/product-transactions-over-time/${id}`}
              dataField="transactionCount"
              dateLabels={true}
              agenda="Number of Transactions"
          />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('profit')}>
          <LineChartCreator 
              title="Profit on Product Over Time"
              endpoint={`/api/Products/product-profit-over-time/${id}`}
              dataField="totalProfit"
              dateLabels={true}
              color="rgba(255, 99, 132, 1)"
              backgroundColor="rgba(255, 99, 132, 0.2)"
              agenda="Total Profit"
          />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('quantity')}>
          <BarChartCreator 
              title="Quantity Purchased by Client"
              endpoint={`/api/Products/product-purchase-quantity-by-client/${id}`}
              labelField="clientName"
              dataField="totalQuantity"
              agenda="Products Purchased"
          />
        </div>
      </div>

      {fullscreenChart && (
        <div className="fullscreen-chart" onClick={handleOverlayClick}>
          <div className="chart-container" onClick={(e) => e.stopPropagation()}>
            {fullscreenChart === 'transactions' && 
            <LineChartCreator 
              title="Number of Transactions Over Time"
              endpoint={`/api/Products/product-transactions-over-time/${id}`}
              dataField="transactionCount"
              dateLabels={true}
              agenda="Number of Transactions"
            />}
            {fullscreenChart === 'profit' && 
            <LineChartCreator 
              title="Profit on Product Over Time"
              endpoint={`/api/Products/product-profit-over-time/${id}`}
              dataField="totalProfit"
              dateLabels={true}
              color="rgba(255, 99, 132, 1)"
              backgroundColor="rgba(255, 99, 132, 0.2)"
              agenda="Total Profit"
            />}
            {fullscreenChart === 'quantity' && 
            <BarChartCreator 
              title="Quantity Purchased by Client"
              endpoint={`/api/Products/product-purchase-quantity-by-client/${id}`}
              labelField="clientName"
              dataField="totalQuantity"
              agenda="Products Purchased"
            />}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductDetails;
