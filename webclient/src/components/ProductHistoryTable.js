import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Table.css';
import '../styles/Filter.css';

const getMaxQuantity = (items) => {
  return items.reduce((max, item) => {
    return item.quantity > max ? item.quantity : max;
  }, 0);
};

const getMaxPrice = (items) => {
  return items.reduce((max, item) => {
    return item.price > max ? item.price : max;
  }, 0);
};

const getMaxTotalPrice = (items) => {
  return items.reduce((max, item) => {
    return item.quantity * item.price > max ? item.quantity * item.price: max;
  }, 0);
};

function InvoiceItemsTable({ items = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [minQuantity, setMinQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(getMaxQuantity(items));
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(getMaxPrice(items));
  const [minTotalPrice, setMinTotalPrice] = useState(0);
  const [maxTotalPrice, setMaxTotalPrice] = useState(getMaxTotalPrice(items));
  const [dateRange, setDateRange] = useState(['', '']);
  const [sortOption, setSortOption] = useState('date-asc');
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, minQuantity, maxQuantity, minTotalPrice, maxTotalPrice, dateRange, sortOption]);

    
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDateChange = (e) => {
    const [startDate, endDate] = e.target.value.split(',');
    setDateRange([startDate, endDate]);
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

  const handleMinTotalPriceChange = (e) => {
    setMinTotalPrice(Number(e.target.value));
  };

  const handleMaxTotalPriceChange = (e) => {
    setMaxTotalPrice(Number(e.target.value));
  };

  const sortItems = (items, option) => {
    return [...items].sort((a, b) => {
      switch (option) {
        case 'date-asc':
          return new Date(a.dateOfIssue) - new Date(b.dateOfIssue);
        case 'date-desc':
          return new Date(b.dateOfIssue) - new Date(a.dateOfIssue);
        case 'quantity-asc':
          return a.quantity - b.quantity;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'totalPrice-asc':
          return a.price * a.quantity - b.price * b.quantity;
        case 'totalPrice-desc':
          return b.price * b.quantity - a.price * a.quantity;
        default:
          return 0;
      }
    });
  };
  
  const filteredItems = items ? items.filter(item => {
    const totalPrice = item.price * item.quantity;
    const itemsDate = new Date(items.dateOfIssue);
    const [minDate, maxDate] = dateRange.map(date => date ? new Date(date) : null);
    return (
      item.price >= minPrice &&
      item.price <= maxPrice &&
      item.quantity >= minQuantity &&
      item.quantity <= maxQuantity &&
      totalPrice >= minTotalPrice &&
      totalPrice <= maxTotalPrice &&
      (!minDate || itemsDate >= minDate) &&
      (!maxDate || itemsDate <= maxDate)
    );
  }) : [];

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(getMaxPrice(items));
    setMinQuantity(1);
    setMaxQuantity(getMaxQuantity(items));
    setMinTotalPrice(0);
    setMaxTotalPrice(getMaxTotalPrice(items));
    setSortOption('date-asc');
  };

  const sortedItems= sortItems(filteredItems, sortOption);

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const displayedItems = sortedItems.slice(startIndex, endIndex);

  const emptyRowsCount = itemsPerPage - displayedItems.length;

  return (
    <div className="a">
      <div className="head-container">
        <h1>History List</h1>
      </div>
      <div className="data-container">
        <div className="content-list">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice id</th>
                <th>Client name</th>
                <th>Date of issue</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length > 0 ? (
                displayedItems.map(item => (
                  <tr key={item.id}>
                        <td><Link to={`/invoices/${item.invoiceId}`} className="link">{item.invoiceId}</Link></td>
                        <td><Link to={`/clients/${item.clientId}`} className="link">{item.clientName}</Link></td>
                        <td>{formatDate(item.dateOfIssue)}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price * item.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">No items found.</td>
                </tr>
              )}
              {emptyRowsCount > 0 && (
                Array.from({ length: emptyRowsCount }, (_, index) => (
                  <tr key={`empty-${index}`}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))
              )}
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
                <option value="date-asc">Date of issue (Asc)</option>
                <option value="date-desc">Date of issue (Desc)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="quantity-asc">Quantity (Low to High)</option>
                <option value="quantity-desc">Quantity (High to Low)</option>
                <option value="totalPrice-asc">Total price (Low to High)</option>
                <option value="totalPrice-desc">Total price (High to Low)</option>
              </select>
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minPriceRange">Min Price:</label>
                <span>{minPrice}</span>
              </div>
              <input
                type="range"
                id="minPrice"
                value={minPrice}
                min="1"
                max="1500"
                step="1"
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
                id="maxPrice"
                value={maxPrice}
                min="1"
                max="1500"
                step="1"
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
                min="1"
                max="50"
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
                min="1"
                max="50"
                step="1"
                onChange={handleMaxQuantityChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minTotalPriceRange">Min Total Price:</label>
                <span>{minTotalPrice}</span>
              </div>
              <input
                type="range"
                id="minTotalPriceRange"
                value={minTotalPrice}
                min="0"
                max="25000"
                step="10"
                onChange={handleMinTotalPriceChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minTotalPriceRange">Max Total Price:</label>
                <span>{maxTotalPrice}</span>
              </div>
              <input
                type="range"
                id="maxTotalPriceRange"
                value={maxTotalPrice}
                min="0"
                max="25000"
                step="10"
                onChange={handleMaxTotalPriceChange}
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
        </div>
      </div>
    </div>
  );
}

export default InvoiceItemsTable;
