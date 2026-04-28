import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const statusColors = {
  PENDING: '#ff9f00',
  CONFIRMED: '#2874f0',
  SHIPPED: '#9c27b0',
  DELIVERED: '#388e3c',
  CANCELLED: '#d32f2f',
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.getUserOrders(user.id).then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <button onClick={() => navigate('/')}>Shop Now</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="order-status" style={{ background: statusColors[order.status] }}>
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                {order.items?.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-image">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} /> : <span>📦</span>}
                    </div>
                    <div className="order-item-details">
                      <p className="order-item-name">{item.productName}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <p className="order-item-price">₹{item.totalPrice}</p>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Total: <strong>₹{order.totalAmount}</strong></span>
                <span>Payment: {order.paymentMethod}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
