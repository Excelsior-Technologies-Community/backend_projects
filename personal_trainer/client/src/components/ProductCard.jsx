import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartWishlist } from '../context/AppContext';

export const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const wishlisted = isInWishlist(product.id || product._id);

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease',
      height: '100%'
    }}>
      {/* Product Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {product.badge && (
          <span className="badge-tag">
            {product.badge}
          </span>
        )}
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="badge-tag badge-rose">
            Save ${(product.comparePrice - product.price).toFixed(0)}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(10, 12, 16, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: wishlisted ? 'var(--accent-rose)' : '#fff',
          transition: 'var(--transition-fast)'
        }}
        title="Wishlist"
      >
        <Heart size={18} fill={wishlisted ? 'var(--accent-rose)' : 'none'} />
      </button>

      {/* Image Showcase */}
      <div 
        onClick={() => onViewDetails(product)}
        style={{
          position: 'relative',
          height: '240px',
          overflow: 'hidden',
          background: '#151b26',
          cursor: 'pointer'
        }}
      >
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(18,22,31,0.85) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Info Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-neon)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '0.35rem' }}>
          {product.categoryName}
        </div>

        <h3 
          onClick={() => onViewDetails(product)}
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.35,
            color: '#fff',
            marginBottom: '0.6rem',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', color: '#f59e0b' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
                strokeWidth={i < Math.floor(product.rating || 5) ? 0 : 1.5}
              />
            ))}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount || 12})</span>
        </div>

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              ${product.price?.toFixed(2)}
            </div>
            {product.comparePrice && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                ${product.comparePrice?.toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="glow-btn"
            style={{
              padding: '0.6rem 1rem',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
