import React, { useState } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft, 
  Plus, 
  Minus, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { useCartWishlist, useAuth, API_URL } from '../context/AppContext';

export const ProductDetailPage = ({ product, onBack, setTab }) => {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCartWishlist();
  const { user, token } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'specs', 'reviews'
  
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState([
    {
      id: 'rev-demo-1',
      userName: 'Marcus Aurelius',
      rating: 5,
      comment: 'Top quality craftsmanship! Worth every dollar for serious lifting.',
      createdAt: '2026-03-10T12:00:00.000Z'
    }
  ]);

  const wishlisted = isInWishlist(product.id || product._id);
  const images = product.images?.length ? product.images : (product.image ? [product.image] : ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80']);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('Please sign in to submit a review', 'info');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setLocalReviews(prev => [data.review, ...prev]);
        setNewReview({ rating: 5, comment: '' });
        showToast('Review submitted successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container animate-fade" style={{ padding: '2rem 1.5rem 6rem' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255,255,255,0.04)'
        }}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main Product Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3.5rem',
        marginBottom: '4rem'
      }}>
        {/* Gallery */}
        <div>
          <div style={{
            height: '440px',
            borderRadius: '20px',
            overflow: 'hidden',
            background: '#151b26',
            position: 'relative',
            marginBottom: '1rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <img
              src={images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {product.badge && (
              <span className="badge-tag" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedImage === idx ? '2px solid var(--accent-neon)' : '1px solid var(--border-subtle)',
                    padding: 0
                  }}
                >
                  <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-neon)', textTransform: 'uppercase' }}>
              {product.categoryName}
            </span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>SKU: {product.sku}</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
                  strokeWidth={i < Math.floor(product.rating || 5) ? 0 : 1.5}
                />
              ))}
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
              {product.rating?.toFixed(1) || '5.0'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ({product.reviewsCount || localReviews.length} athlete reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.8rem' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>
              ${product.price?.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                ${product.comparePrice?.toFixed(2)}
              </span>
            )}
            {product.stock > 0 ? (
              <span className="badge-tag" style={{ marginLeft: 'auto' }}>In Stock ({product.stock} units)</span>
            ) : (
              <span className="badge-tag badge-rose" style={{ marginLeft: 'auto' }}>Sold Out</span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              background: '#121620',
              padding: '0.3rem 0.6rem'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '0.4rem', color: '#fff' }}
              >
                <Minus size={16} />
              </button>
              <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, color: '#fff' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '0.4rem', color: '#fff' }}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="glow-btn"
              style={{ flex: 1, minWidth: '180px', padding: '0.9rem' }}
            >
              <ShoppingCart size={18} /> Add To Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="secondary-btn"
              style={{
                padding: '0.9rem',
                color: wishlisted ? 'var(--accent-rose)' : '#fff',
                borderColor: wishlisted ? 'var(--accent-rose)' : 'var(--border-subtle)'
              }}
              title="Save to Wishlist"
            >
              <Heart size={20} fill={wishlisted ? 'var(--accent-rose)' : 'none'} />
            </button>
          </div>

          {/* Trust Value Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Truck size={20} color="var(--accent-neon)" />
              <span>Fast Tracked USA Shipping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <RotateCcw size={20} color="var(--accent-neon)" />
              <span>30-Day Performance Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}>
          {['description', 'specifications', 'reviews'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '0.75rem 0',
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                color: activeTab === t ? 'var(--accent-neon)' : 'var(--text-muted)',
                position: 'relative'
              }}
            >
              {t} {t === 'reviews' && `(${localReviews.length})`}
              {activeTab === t && (
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--accent-neon)',
                  boxShadow: '0 0 10px var(--accent-neon)'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
            <p style={{ marginBottom: '1rem' }}>{product.description}</p>
            <p>
              Designed in collaboration with elite IFBB bodybuilders and strength coaches to withstand extreme punishment, daily repetitions, and explosive athletic power output.
            </p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '0.8rem 1.2rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{key}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Submit Review Form */}
            <form onSubmit={handleAddReview} style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.05rem' }}>Write an Athlete Review</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rating:</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  style={{
                    background: '#0a0d13',
                    color: '#fff',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px'
                  }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5 Outstanding)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                </select>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Share your experience with the durability, taste, or workout results..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#0a0d13',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none',
                  marginBottom: '1rem',
                  fontFamily: 'inherit'
                }}
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="glow-btn"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {localReviews.map(rev => (
                <div key={rev.id} style={{
                  padding: '1.2rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{rev.userName}</span>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
