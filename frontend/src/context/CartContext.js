import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart(user.id);
      setCart(res.data);
    } catch (e) {
      setCart({ items: [], totalAmount: 0 });
    }
  };

  const addToCart = async (item) => {
    if (!user) return;
    const res = await cartAPI.addToCart(user.id, item);
    setCart(res.data);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await cartAPI.updateQuantity(user.id, productId, quantity);
    setCart(res.data);
  };

  const removeItem = async (productId) => {
    const res = await cartAPI.removeItem(user.id, productId);
    setCart(res.data);
  };

  const clearCart = async () => {
    await cartAPI.clearCart(user.id);
    setCart({ items: [], totalAmount: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
