import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddNew.css'; 

function AddNewProduct({ setProducts, products }) {
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', date: '', description: '', imageURL: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const validate = () => {
    const errors = {};
    if (!newProduct.name) errors.name = 'Name is required';
    if (!newProduct.quantity || isNaN(newProduct.quantity) || newProduct.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!newProduct.price || isNaN(newProduct.price) || newProduct.price <= 0) errors.price = 'Valid price is required';
    return errors;
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (!newProduct.date) {
        newProduct.date = new Date().toISOString();
      }
      axios.post('http://localhost:5193/api/products', newProduct)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({ name: '', quantity: '', price: '', date: '', description: '', imageURL: '' });
          setErrors({});
        })
        .catch(error => {
          console.error('Error adding new product:', error);
        });
    }
  };

  const handleClearForm = () => {
    setNewProduct({ name: '', quantity: '', price: '', date: '', description: '', imageURL: '' });
    setErrors({});
  };

  return (
    <div className="add-new-container-product">
      <h2>Add New Product</h2>
      <form className="add-new-form" onSubmit={handleAddProduct}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={newProduct.quantity}
          onChange={handleInputChange}
          required
        />
        {errors.quantity && <span className="error">{errors.quantity}</span>}

        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        {errors.price && <span className="error">{errors.price}</span>}

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={newProduct.date}
          onChange={handleInputChange}
          required
        />
        {errors.date && <span className="error">{errors.date}</span>}

        <label>Description:</label>
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        {errors.description && <span className="error">{errors.description}</span>}

        <label>Image URL:</label>
        <input
          type="text"
          name="imageURL"
          value={newProduct.imageURL}
          onChange={handleInputChange}
        />
        {errors.imageURL && <span className="error">{errors.imageURL}</span>}

        <div className="button-group">
          <button type="submit">Add Product</button>
          <button type="reset" onClick={handleClearForm}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewProduct;
