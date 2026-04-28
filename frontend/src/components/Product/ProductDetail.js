import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    Promise.all([productAPI.getById(id), productAPI.getReviews(id)])
      .then(([pRes, rRes]) => {
        setProduct(pRes.data);
        setReviews(rRes.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrls?.[0] || '',
      price: product.discountedPrice || product.price,
      quantity: 1,
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    await addToCart({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrls?.[0] || '',
      price: product.discountedPrice || product.price,
      quantity: 1,
    });
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    await productAPI.addReview(id, { ...reviewForm, userId: user.id, userName: user.name });
    const res = await productAPI.getReviews(id);
    setReviews(res.data);
    setReviewForm({ rating: 5, comment: '' });
    toast.success('Review submitted!');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="loading">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-main">
        <div className="image-section">
          <div className="main-image">
            {product.imageUrls?.[selectedImage] ? (
              <img src={product.imageUrls[selectedImage]} alt={product.name} />
            ) : (
              <div className="placeholder-img">📦</div>
            )}
          </div>
          {product.imageUrls?.length > 1 && (
            <div className="image-thumbnails">
              {product.imageUrls.map((url, i) => (
                <img key={i} src={url} alt="" className={selectedImage === i ? 'active' : ''}
                  onClick={() => setSelectedImage(i)} />
              ))}
            </div>
          )}
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>⚡ Buy Now</button>
          </div>
        </div>

        <div className="details-section">
          <p className="product-brand">{product.brand}</p>
          <h1 className="product-name">{product.name}</h1>

          {product.rating > 0 && (
            <div className="rating-row">
              <span className="rating-badge">{product.rating} ★</span>
              <span className="review-count">{product.reviewCount} ratings</span>
            </div>
          )}

          <div className="price-section">
            <span className="current-price">₹{product.discountedPrice || product.price}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="original-price">₹{product.price}</span>
                <span className="discount-text">{product.discountPercent}% off</span>
              </>
            )}
          </div>

          <div className="stock-status">
            {product.inStock ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div><strong>Category:</strong> {product.category}</div>
            {product.subCategory && <div><strong>Sub-Category:</strong> {product.subCategory}</div>}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Ratings & Reviews</h2>

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a Review</h3>
          <div className="rating-select">
            <label>Rating:</label>
            <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </div>
          <textarea placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
            required />
          <button type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.userName}</span>
                  <span className="review-rating">{review.rating} ★</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
