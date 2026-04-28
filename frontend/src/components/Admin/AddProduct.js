import React, { useState } from 'react';
import { productAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const categories = ['Electronics', 'Fashion', 'Home', 'Appliances', 'Books', 'Sports', 'Toys', 'Beauty'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPercent: 0,
    quantity: '', brand: '', category: '', subCategory: '',
    imageUrls: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        discountPercent: parseInt(form.discountPercent),
        quantity: parseInt(form.quantity),
        imageUrls: form.imageUrls ? form.imageUrls.split(',').map(u => u.trim()) : [],
      };
      await productAPI.create(productData);
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (err) {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const set = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" placeholder="e.g. iPhone 15 Pro" required
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input type="text" placeholder="e.g. Apple" required
                value={form.brand} onChange={e => set('brand', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select required value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Sub Category</label>
              <input type="text" placeholder="e.g. Smartphones"
                value={form.subCategory} onChange={e => set('subCategory', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" placeholder="e.g. 79999" required min="0"
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Discount %</label>
              <input type="number" placeholder="e.g. 10" min="0" max="100"
                value={form.discountPercent} onChange={e => set('discountPercent', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Quantity *</label>
              <input type="number" placeholder="e.g. 100" required min="0"
                value={form.quantity} onChange={e => set('quantity', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea placeholder="Describe the product..." required rows="3"
                value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Image URLs (comma separated)</label>
              <input type="text" placeholder="https://image1.jpg, https://image2.jpg"
                value={form.imageUrls} onChange={e => set('imageUrls', e.target.value)} />
            </div>
          </div>

          {form.price && form.discountPercent > 0 && (
            <div className="price-preview">
              <span>Original: ₹{form.price}</span>
              <span>After Discount: ₹{(form.price * (1 - form.discountPercent / 100)).toFixed(2)}</span>
              <span className="savings">You save: ₹{(form.price * form.discountPercent / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
