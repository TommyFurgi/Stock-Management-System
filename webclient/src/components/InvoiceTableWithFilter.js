import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Table.css';
import '../styles/Filter.css';

function InvoiceTableWithFiter({ invoices = [], clientName = "" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [minNumberOfProducts, setMinNumberOfProducts] = useState(1);
  const [maxNumberOfProducts, setMaxNumberOfProducts] = useState(20);
  const [minTotalQuantity, setMinTotalQuantity] = useState(1);
  const [maxTotalQuantity, setMaxTotalQuantity] = useState(200);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(40000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0.5);
  const [minTotalAmount, setMinTotalAmount] = useState(0);
  const [maxTotalAmount, setMaxTotalAmount] = useState(40000);
  const [dateRange, setDateRange] = useState(['', '']);
  const [sortOption, setSortOption] = useState('date-asc');
  const invoicesPerPage = 25;

  useEffect(() => {
    
    setCurrentPage(1);
  }, [minPrice, maxPrice, minDiscount, maxDiscount, minTotalAmount, maxTotalAmount, dateRange, sortOption, minNumberOfProducts, maxNumberOfProducts, minTotalQuantity, maxTotalQuantity]);

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

  const handleDateChange = (e) => {
    const [startDate, endDate] = e.target.value.split(',');
    setDateRange([startDate, endDate]);
  };

  const handleMinNumberOfProductsChange = (e) => {
    setMinNumberOfProducts(Number(e.target.value));
  };

  const handleMaxNumberOfProductsChange = (e) => {
    setMaxNumberOfProducts(Number(e.target.value));
  };

  const handleMinTotalQuantityChange = (e) => {
    setMinTotalQuantity(Number(e.target.value));
  };

  const handleMaxTotalQuantityChange = (e) => {
    setMaxTotalQuantity(Number(e.target.value));
  };

  const handleMinDiscountChange = (e) => {
    setMinDiscount(Number(e.target.value));
  };

  const handleMaxDiscountChange = (e) => {
    setMaxDiscount(Number(e.target.value));
  };

  const handleMinTotalAmountChange = (e) => {
    setMinTotalAmount(Number(e.target.value));
  };

  const handleMaxTotalAmountChange = (e) => {
    setMaxTotalAmount(Number(e.target.value));
  };

  const sortInvoices = (invoices, option) => {
    return [...invoices].sort((a, b) => {
      switch (option) {
        case 'date-asc':
          return new Date(a.dateOfIssue) - new Date(b.dateOfIssue);
        case 'date-desc':
          return new Date(b.dateOfIssue) - new Date(a.dateOfIssue);
        case 'numberOfProducts-asc':
          return a.numberOfProducts - b.numberOfProducts;
        case 'numberOfProducts-desc':
          return b.numberOfProducts - a.numberOfProducts;
        case 'totalQuantity-asc':
          return a.totalQuantity - b.totalQuantity;
        case 'totalQuantity-desc':
          return b.totalQuantity - a.totalQuantity;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'discount-asc':
          return a.discount - b.discount;
        case 'discount-desc':
          return b.discount - a.discount;
        case 'totalAmount-asc':
          return a.totalAmount - b.totalAmount;
        case 'totalAmount-desc':
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });
  };

  const filteredInvoices = invoices ? invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.dateOfIssue);
    const [minDate, maxDate] = dateRange.map(date => date ? new Date(date) : null);
    return (
      invoice.price >= minPrice &&
      invoice.price <= maxPrice &&
      invoice.numberOfProducts >= minNumberOfProducts &&
      invoice.numberOfProducts <= maxNumberOfProducts &&
      invoice.totalQuantity >= minTotalQuantity &&
      invoice.totalQuantity <= maxTotalQuantity &&
      invoice.discount >= minDiscount &&
      invoice.discount <= maxDiscount &&
      invoice.totalAmount >= minTotalAmount &&
      invoice.totalAmount <= maxTotalAmount &&
      (!minDate || invoiceDate >= minDate) &&
      (!maxDate || invoiceDate <= maxDate)
    );
  }) : [];

  const handleResetFilters = () => {
    setMinPrice(0);
    setMaxPrice(40000);
    setMinNumberOfProducts(1);
    setMaxNumberOfProducts(20);
    setMinTotalQuantity(1);
    setMaxTotalQuantity(200);
    setMinDiscount(0);
    setMaxDiscount(0.5);
    setMinTotalAmount(0);
    setMaxTotalAmount(40000);
    setDateRange(['', '']);
    setSortOption('date-asc');
  };

  const sortedInvoices = sortInvoices(filteredInvoices, sortOption);

  const totalPages = Math.max(Math.ceil(filteredInvoices.length / invoicesPerPage), 1);

  const startIndex = (currentPage - 1) * invoicesPerPage;
  const endIndex = currentPage * invoicesPerPage;
  const displayedInvoices = sortedInvoices.slice(startIndex, endIndex);

  const emptyRowsCount = invoicesPerPage - displayedInvoices.length;

  return (
    <div className="a">
      <div className="head-container">
        <h1>Invoices List</h1>
      </div>
      <div className="data-container">
        <div className="content-list">
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Client name</th>
                <th>Date of Issue</th>
                <th>Number of Products</th>
                <th>Total Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.length > 0 ? (
                displayedInvoices.map(invoice => (
                  <tr key={invoice.id}>
                      <td><Link to={`/invoices/${invoice.id}`} className="link">{invoice.id}</Link></td>
                      <td>{invoice.clientName ? invoice.clientName : (clientName || 'Unknown Client')}</td>
                      <td>{formatDate(invoice.dateOfIssue)}</td>
                      <td>{invoice.numberOfProducts}</td>
                      <td>{invoice.totalQuantity}</td>
                      <td>{invoice.price}</td>
                      <td>{invoice.discount}</td>
                      <td>{invoice.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-row">No invoices found.</td>
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
                <option value="date-asc">Date of issue (Earliest First)</option>
                <option value="date-desc">Date of issue (Latest First)</option>
                <option value="numberOfProducts-asc">Number of Products (Low to High)</option>
                <option value="numberOfProducts-desc">Number of Products (High to Low)</option>
                <option value="totalQuantity-asc">Total Quantity (Low to High)</option>
                <option value="totalQuantity-desc">Total Quantity (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="discount-asc">Discount (Low to High)</option>
                <option value="discount-desc">Discount (High to Low)</option>
                <option value="totalAmount-asc">Total Amount (Low to High)</option>
                <option value="totalAmount-desc">Total Amount (High to Low)</option>
              </select>
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minNumberOfProductsRange">Min Number of Products:</label>
                <span>{minNumberOfProducts}</span>
              </div>
              <input
                type="range"
                id="minNumberOfProductsRange"
                value={minNumberOfProducts}
                min="1"
                max="50"
                step="1"
                onChange={handleMinNumberOfProductsChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxNumberOfProductsRange">Max Number of Products:</label>
                <span>{maxNumberOfProducts}</span>
              </div>
              <input
                type="range"
                id="maxNumberOfProductsRange"
                value={maxNumberOfProducts}
                min="1"
                max="50"
                step="1"
                onChange={handleMaxNumberOfProductsChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minTotalQuantityRange">Min Total Quantity:</label>
                <span>{minTotalQuantity}</span>
              </div>
              <input
                type="range"
                id="minTotalQuantityRange"
                value={minTotalQuantity}
                min="1"
                max="500"
                step="1"
                onChange={handleMinTotalQuantityChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxTotalQuantityRange">Max Total Quantity:</label>
                <span>{maxTotalQuantity}</span>
              </div>
              <input
                type="range"
                id="maxTotalQuantityRange"
                value={maxTotalQuantity}
                min="1"
                max="500"
                step="1"
                onChange={handleMaxTotalQuantityChange}
              />
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
                max="100000"
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
                max="100000"
                step="10"
                onChange={handleMaxPriceChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minDiscountRange">Min Discount:</label>
                <span>{minDiscount}</span>
              </div>
              <input
                type="range"
                id="minDiscountRange"
                value={minDiscount}
                min="0"
                max="1"
                step="0.01"
                onChange={handleMinDiscountChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxDiscountRange">Max Discount:</label>
                <span>{maxDiscount}</span>
              </div>
              <input
                type="range"
                id="maxDiscountRange"
                value={maxDiscount}
                min="0"
                max="1"
                step="0.01"
                onChange={handleMaxDiscountChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="minTotalAmountRange">Min Total Amount:</label>
                <span>{minTotalAmount}</span>
              </div>
              <input
                type="range"
                id="minTotalAmountRange"
                value={minTotalAmount}
                min="0"
                max="100000"
                step="100"
                onChange={handleMinTotalAmountChange}
              />
            </div>
            <div className="filter">
              <div className="label-container">
                <label htmlFor="maxTotalAmountRange">Max Total Amount:</label>
                <span>{maxTotalAmount}</span>
              </div>
              <input
                type="range"
                id="maxTotalAmountRange"
                value={maxTotalAmount}
                min="0"
                max="100000"
                step="100"
                onChange={handleMaxTotalAmountChange}
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

export default InvoiceTableWithFiter;
