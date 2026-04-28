import axios from 'axios';

const USER_API = 'http://localhost:8081/api';
const PRODUCT_API = 'http://localhost:8082/api';
const ORDER_API = 'http://localhost:8083/api';
const CART_API = 'http://localhost:8084/api';
const PAYMENT_API = 'http://localhost:8085/api';

const api = axios.create();

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const userAPI = {
  register: (data) => api.post(`${USER_API}/users/register`, data),
  login: (data) => api.post(`${USER_API}/users/login`, data),
  getUser: (id) => api.get(`${USER_API}/users/${id}`),
  updateUser: (id, data) => api.put(`${USER_API}/users/${id}`, data),
};

export const productAPI = {
  getAll: () => api.get(`${PRODUCT_API}/products`),
  getById: (id) => api.get(`${PRODUCT_API}/products/${id}`),
  getByCategory: (cat) => api.get(`${PRODUCT_API}/products/category/${cat}`),
  search: (keyword) => api.get(`${PRODUCT_API}/products/search?keyword=${keyword}`),
  create: (data) => api.post(`${PRODUCT_API}/products`, data),
  update: (id, data) => api.put(`${PRODUCT_API}/products/${id}`, data),
  delete: (id) => api.delete(`${PRODUCT_API}/products/${id}`),
  addReview: (id, data) => api.post(`${PRODUCT_API}/products/${id}/reviews`, data),
  getReviews: (id) => api.get(`${PRODUCT_API}/products/${id}/reviews`),
};

export const cartAPI = {
  getCart: (userId) => api.get(`${CART_API}/cart/${userId}`),
  addToCart: (userId, item) => api.post(`${CART_API}/cart/${userId}/add`, item),
  updateQuantity: (userId, productId, quantity) =>
    api.put(`${CART_API}/cart/${userId}/update/${productId}`, { quantity }),
  removeItem: (userId, productId) => api.delete(`${CART_API}/cart/${userId}/remove/${productId}`),
  clearCart: (userId) => api.delete(`${CART_API}/cart/${userId}/clear`),
};

export const orderAPI = {
  createOrder: (data) => api.post(`${ORDER_API}/orders`, data),
  getUserOrders: (userId) => api.get(`${ORDER_API}/orders/user/${userId}`),
  getOrder: (id) => api.get(`${ORDER_API}/orders/${id}`),
};

export const paymentAPI = {
  processPayment: (data) => api.post(`${PAYMENT_API}/payments/process`, data),
  getByOrder: (orderId) => api.get(`${PAYMENT_API}/payments/order/${orderId}`),
};
