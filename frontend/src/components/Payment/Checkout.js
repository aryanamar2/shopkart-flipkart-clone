import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, paymentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        userId: user.id,
        paymentMethod,
        shippingStreet: address.street,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pincode,
        items: cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const orderRes = await orderAPI.createOrder(orderData);
      const order = orderRes.data;

      await paymentAPI.processPayment({
        orderId: order.id,
        userId: user.id,
        amount: order.totalAmount,
        method: paymentMethod,
      });

      await clearCart();
      setOrderId(order.id);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Order #{orderId} has been placed.</p>
        <p>Estimated delivery: 3-5 business days</p>
        <div className="success-actions">
          <button onClick={() => navigate('/orders')} className="view-orders-btn">View Orders</button>
          <button onClick={() => navigate('/')} className="continue-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-main">
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Address</div>
          <div className="step-divider">›</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
          <div className="step-divider">›</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
        </div>

        {step === 1 && (
          <div className="checkout-section">
            <h3>Delivery Address</h3>
            <div className="address-form">
              <input placeholder="Street Address" value={address.street}
                onChange={e => setAddress({...address, street: e.target.value})} />
              <div className="form-row">
                <input placeholder="City" value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})} />
                <input placeholder="State" value={address.state}
                  onChange={e => setAddress({...address, state: e.target.value})} />
              </div>
              <input placeholder="Pincode" value={address.pincode}
                onChange={e => setAddress({...address, pincode: e.target.value})} />
              <button className="next-btn"
                onClick={() => {
                  if (!address.street || !address.city || !address.pincode) {
                    toast.error('Please fill all address fields');
                    return;
                  }
                  setStep(2);
                }}>
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              {['COD', 'UPI', 'CARD', 'NETBANKING'].map(method => (
                <label key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)} />
                  <span className="payment-icon">
                    {method === 'COD' ? '💵' : method === 'UPI' ? '📱' : method === 'CARD' ? '💳' : '🏦'}
                  </span>
                  <span>{method === 'COD' ? 'Cash on Delivery' : method === 'UPI' ? 'UPI' : method === 'CARD' ? 'Credit/Debit Card' : 'Net Banking'}</span>
                </label>
              ))}
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(1)}>Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>Review Order</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-section">
            <h3>Review Order</h3>
            <div className="review-address">
              <strong>Delivering to:</strong>
              <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
            </div>
            <div className="review-items">
              {cart.items.map(item => (
                <div key={item.productId} className="review-item">
                  <span>{item.productName}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{item.totalPrice}</span>
                </div>
              ))}
            </div>
            <div className="step-actions">
              <button className="back-btn" onClick={() => setStep(2)}>Back</button>
              <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order ₹${cart.totalAmount.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cart.items.map(item => (
          <div key={item.productId} className="summary-item">
            <span>{item.productName} x{item.quantity}</span>
            <span>₹{item.totalPrice}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total</strong>
          <strong>₹{cart.totalAmount.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
