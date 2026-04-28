import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import './Home.css';

const categories = [
  { name: 'Electronics', icon: '📱', color: '#e3f2fd' },
  { name: 'Fashion', icon: '👗', color: '#fce4ec' },
  { name: 'Home', icon: '🏠', color: '#e8f5e9' },
  { name: 'Appliances', icon: '🔌', color: '#fff3e0' },
  { name: 'Books', icon: '📚', color: '#f3e5f5' },
  { name: 'Sports', icon: '⚽', color: '#e0f7fa' },
  { name: 'Toys', icon: '🧸', color: '#fff8e1' },
  { name: 'Beauty', icon: '💄', color: '#fce4ec' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll().then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to ShopKart</h1>
          <p>Discover millions of products at the best prices</p>
          <button onClick={() => navigate('/products')} className="shop-now-btn">
            Shop Now
          </button>
        </div>
        <div className="hero-image">🛍️</div>
      </div>

      {/* Categories */}
      <div className="section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link to={`/products/category/${cat.name}`} key={cat.name} className="category-card"
              style={{ background: cat.color }}>
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>No products yet. Add some products to get started!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.slice(0, 8).map(product => (
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

      {/* Offers Banner */}
      <div className="offers-section">
        <div className="offer-card blue">
          <h3>🔥 Flash Sale</h3>
          <p>Up to 70% off on Electronics</p>
          <button onClick={() => navigate('/products/category/Electronics')}>Grab Now</button>
        </div>
        <div className="offer-card orange">
          <h3>👗 Fashion Week</h3>
          <p>Trending styles at best prices</p>
          <button onClick={() => navigate('/products/category/Fashion')}>Explore</button>
        </div>
        <div className="offer-card green">
          <h3>🏠 Home Makeover</h3>
          <p>Transform your home today</p>
          <button onClick={() => navigate('/products/category/Home')}>Shop Now</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
