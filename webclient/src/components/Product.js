import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductHistoryTable from './ProductHistoryTable';
import "../styles/Profile.css";

const defaultImage = '/images/default_product.png';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [items, setItems] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageURL: '',
    availableFrom: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        // Fetch product data
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

        // Fetch data for each invoice items
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

              <button className="edit-button" onClick={() => setEditMode(true)}>Edit Product</button>
            </div>
          )}
        </div>
      </div>
      <div className="items-list">
        <ProductHistoryTable items={items}/>
      </div>
    </div>
  );
}

export default ProductDetails;
