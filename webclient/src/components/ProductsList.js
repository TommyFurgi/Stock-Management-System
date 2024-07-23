import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdClear } from 'react-icons/md';
import '../styles/ProductsList.css';
import '../styles/Table.css';
import '../styles/Filter.css';
import AddNewProduct from './AddNewProduct';
import ProductsQuantityOverTimeChart from './charts/ProductsQuantityOverTimeChart';
import TopSellerProductsChart from './charts/TopSellerProductsChart';
import TopProfitProductsChart from './charts/TopProfitProductsChart';
import '../styles/Charts.css';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [initialMaxPrice, setInitialMaxPrice] = useState(2500); 
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(500);
  const [initialMaxQuantity, setInitialMaxQuantity] = useState(500);
  const [dateRange, setDateRange] = useState(['', '']);
  const [sortOption, setSortOption] = useState('name-asc');
  const [fullscreenChart, setFullscreenChart] = useState(null);
  const productsPerPage = 25;

  useEffect(() => {
    const fetchProductsAndMaxValues = async () => {
      try {
        const [productsResponse, maxValuesResponse] = await Promise.all([
          axios.get('http://localhost:5193/api/products'),
          axios.get('http://localhost:5193/api/products/max-values')
        ]);

        setProducts(productsResponse.data);
        const { maxPrice, maxQuantity } = maxValuesResponse.data;
        setMaxPrice(maxPrice);
        setInitialMaxPrice(maxPrice); 
        setMaxQuantity(maxQuantity);
        setInitialMaxQuantity(maxQuantity); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductsAndMaxValues();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, minPrice, maxPrice, minQuantity, maxQuantity, dateRange, sortOption]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleMinQuantityChange = (e) => {
    setMinQuantity(Number(e.target.value));
  };

  const handleMaxQuantityChange = (e) => {
    setMaxQuantity(Number(e.target.value));
  };

  const handleDateChange = (e) => {
    const [startDate, endDate] = e.target.value.split(',');
    setDateRange([startDate, endDate]);
  };

  const sortProducts = (products, option) => {
    return [...products].sort((a, b) => {
      switch (option) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'quantity-asc':
          return a.quantity - b.quantity;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        case 'date-asc':
          return new Date(a.availableFrom) - new Date(b.availableFrom);
        case 'date-desc':
          return new Date(b.availableFrom) - new Date(a.availableFrom);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const productDate = new Date(product.availableFrom);
    const [minDate, maxDate] = dateRange.map(date => date ? new Date(date) : null);
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.quantity >= minQuantity &&
      product.quantity <= maxQuantity &&
      (!minDate || productDate >= minDate) &&
      (!maxDate || productDate <= maxDate)
    );
  });

  const handleChartClick = (chartType) => {
    setFullscreenChart(chartType);
    document.body.classList.add('fullscreen-active'); 
  };

  const handleOverlayClick = () => {
      setFullscreenChart(null);
      document.body.classList.remove('fullscreen-active'); 
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinPrice(0);
    setMaxPrice(initialMaxPrice)
    setMinQuantity(0);
    setMaxQuantity(initialMaxQuantity)
    setDateRange(['', '']);
    setSortOption('name-asc');
  };
  
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  const totalPages = Math.max(Math.ceil(sortedProducts.length / productsPerPage), 1);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = currentPage * productsPerPage;
  const displayedProducts = sortedProducts.slice(startIndex, endIndex);

  const emptyRowsCount = productsPerPage - displayedProducts.length;
  const emptyRows = Array.from({ length: emptyRowsCount > 0 ? emptyRowsCount : 0 }, (_, index) => index);

  return (
    <div className="table-container">
      <div className="head-container">
        <h1>Products List</h1>
        <div className="search-container">
          <label htmlFor="search">Search product: </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Enter product name..."
          />
          {searchTerm && (
            <MdClear className="clear-icon" onClick={handleClearSearch} />
          )}
        </div>
      </div>
      <div className="data-container">
        <div className="content-list">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Available from</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
                  <tr key={product.id}>
                    <td><Link to={`/products/${product.id}`} className="link">{product.name}</Link></td>
                    <td>{product.quantity}</td>
                    <td>{product.price}</td>
                    <td>{formatDate(product.availableFrom)}</td>
                    <td>{product.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">No products found.</td>
                </tr>
              )}
              {emptyRows.map(index => (
                <tr key={`empty-${index}`}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            )}
            <span>Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            )}
          </div>
        </div>
        <div className="side-container">
          
          <div className="filters">
            <div className="sort-container">
              <label htmlFor="sort">Sort by: </label>
              <select
                id="sort"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="date-asc">Available Date (Earliest First)</option>
                <option value="date-desc">Available Date (Latest First)</option>
              </select>
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minPriceRange">Min Price:</label>
                <span>{minPrice}</span>
              </div>
              <input
                type="range"
                id="minPriceRange"
                value={minPrice}
                min="0"
                max="2500"
                step="10"
                onChange={handleMinPriceChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxPriceRange">Max Price:</label>
                <span>{maxPrice}</span>
              </div>
              <input
                type="range"
                id="maxPriceRange"
                value={maxPrice}
                min="0"
                max="2500"
                step="10"
                onChange={handleMaxPriceChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minQuantityRange">Min Quantity:</label>
                <span>{minQuantity}</span>
              </div>
              <input
                type="range"
                id="minQuantityRange"
                value={minQuantity}
                min="0"
                max="500"
                step="1"
                onChange={handleMinQuantityChange}
              />
              
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxQuantityRange">Max Quantity:</label>
                <span>{maxQuantity}</span>
              </div>
              <input
                type="range"
                id="maxQuantityRange"
                value={maxQuantity}
                min="0"
                max="500"
                step="1"
                onChange={handleMaxQuantityChange}
              />
            </div>
            <div className="filter">
              <label>Date Range:</label>
              <div className="filter-date">
                <input
                  type="date"
                  id="dateRangeStart"
                  value={dateRange[0]}
                  onChange={(e) => handleDateChange({ target: { value: `${e.target.value},${dateRange[1]}` } })}
                />
                <input
                  type="date"
                  id="dateRangeEnd"
                  value={dateRange[1]}
                  onChange={(e) => handleDateChange({ target: { value: `${dateRange[0]},${e.target.value}` } })}
                />
              </div>
            </div>

            <div className="filter">
              <button onClick={handleResetFilters}>Reset Filters</button>
            </div>
          </div>
          <AddNewProduct />
        </div>
      </div>
      <div className={`charts-section ${fullscreenChart ? 'blurred' : ''}`}>
        <div className="chart-container" onClick={() => handleChartClick('transactions')}>
          <ProductsQuantityOverTimeChart />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('profit')}>
          <TopSellerProductsChart />
        </div>
        <div className="chart-container" onClick={() => handleChartClick('quantity')}>
          <TopProfitProductsChart />
        </div>
      </div>

      {fullscreenChart && (
        <div className="fullscreen-chart" onClick={handleOverlayClick}>
          <div className="chart-container" onClick={(e) => e.stopPropagation()}>
            {fullscreenChart === 'transactions' && <ProductsQuantityOverTimeChart />}
            {fullscreenChart === 'profit' && <TopSellerProductsChart />}
            {fullscreenChart === 'quantity' && <TopProfitProductsChart />}
        </div>
        </div>
      )}
    </div>
  );
}

export default ProductsList;
