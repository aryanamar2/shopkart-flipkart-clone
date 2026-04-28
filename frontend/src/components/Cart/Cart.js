import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Please login to view your cart</p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add items to it now</p>
        <button onClick={() => navigate('/')}>Shop Now</button>
      </div>
    );
  }

  const savings = cart.items.reduce((acc, item) => acc + (item.price * item.quantity - item.totalPrice), 0);

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>My Cart ({cart.items.length} items)</h2>
        {cart.items.map(item => (
          <div key={item.productId} className="cart-item">
            <div className="item-image">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} /> : <span>📦</span>}
            </div>
            <div className="item-details">
              <h3>{item.productName}</h3>
              <p className="item-price">₹{item.price}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => item.quantity > 1 && updateQuantity(item.productId, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            <div className="item-total">₹{item.totalPrice}</div>
            <button className="remove-btn" onClick={() => removeItem(item.productId)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Price Details</h3>
        <div className="summary-row">
          <span>Price ({cart.items.length} items)</span>
          <span>₹{cart.totalAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Charges</span>
          <span className="free">FREE</span>
        </div>
        <div className="summary-total">
          <span>Total Amount</span>
          <span>₹{cart.totalAmount.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
