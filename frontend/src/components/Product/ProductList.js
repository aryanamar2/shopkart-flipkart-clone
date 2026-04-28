import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { productAPI } from '../../services/api';
import './ProductList.css';

const ProductList = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    setLoading(true);
    const fetch = category
      ? productAPI.getByCategory(category)
      : query
      ? productAPI.search(query)
      : productAPI.getAll();

    fetch.then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, query]);

  const sorted = [...products]
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'price-desc') return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="product-list-page">
      <div className="filters-sidebar">
        <h3>Filters</h3>
        <div className="filter-section">
          <h4>Sort By</h4>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="filter-section">
          <h4>Price Range</h4>
          <input type="range" min="0" max="100000" step="500"
            value={priceRange[1]}
            onChange={e => setPriceRange([0, Number(e.target.value)])} />
          <p>Up to ₹{priceRange[1].toLocaleString()}</p>
        </div>
      </div>

      <div className="products-section">
        <div className="results-header">
          <h2>{category ? `${category}` : query ? `Results for "${query}"` : 'All Products'}</h2>
          <span>{sorted.length} products found</span>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : sorted.length === 0 ? (
          <div className="no-results">No products found</div>
        ) : (
          <div className="products-grid">
            {sorted.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <div className="product-image">
                  {product.imageUrls?.[0] ? (
                    <img src={product.imageUrls[0]} alt={product.name} />
                  ) : (
                    <div className="placeholder-img">📦</div>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="discount-badge">{product.discountPercent}% OFF</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="brand">{product.brand}</p>
                  <div className="price-row">
                    <span className="price">₹{product.discountedPrice || product.price}</span>
                    {product.discountPercent > 0 && (
                      <span className="original-price">₹{product.price}</span>
                    )}
                  </div>
                  {product.rating > 0 && (
                    <div className="rating">
                      <span className="rating-badge">{product.rating} ★</span>
                      <span className="review-count">({product.reviewCount})</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
