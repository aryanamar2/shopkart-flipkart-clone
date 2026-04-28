import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products/search?q=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">ShopKart</Link>
        
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        <div className="nav-links">
          {user ? (
            <>
              <div className="user-menu">
                <FaUser />
                <span>{user.name}</span>
                <div className="dropdown">
                  <Link to="/orders">My Orders</Link>
                  <Link to="/add-product">Add Product</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
          
          <Link to="/cart" className="cart-link">
            <FaShoppingCart />
            <span>Cart</span>
            {cart.items.length > 0 && <span className="cart-count">{cart.items.length}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
