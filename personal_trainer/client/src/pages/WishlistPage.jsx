import React, { useState } from 'react';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight,
  Info,
  Dumbbell
} from 'lucide-react';
import { useCartWishlist } from '../context/AppContext';

export const WishlistPage = ({ setTab, onSelectProduct }) => {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="container animate-fade" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '550px' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem' }}>
          <Heart size={48} color="var(--text-dim)" style={{ marginBottom: '1.2rem' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.6rem' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Save barbell sets, recovery massage guns, or whey protein here to track them for later purchase.
          </p>
          <button onClick={() => setTab('shop')} className="glow-btn" style={{ padding: '0.9rem 2rem' }}>
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge-tag badge-rose" style={{ marginBottom: '0.5rem' }}>Saved Gear</span>
        <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.4rem' }}>
          My Wishlist ({wishlist.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Items you're eyeing for your workout routine. Move them to your cart when you're ready to lift.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {wishlist.map(product => {
          const displayImg = product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80';
          const displayPrice = product.formattedPrice || (typeof product.price === 'number' ? `Rs. ${product.price.toLocaleString()} INR` : product.price);

          return (
            <div key={product.id || product.productId} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div 
                onClick={() => onSelectProduct && onSelectProduct(product)}
                style={{
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                <img
                  src={displayImg}
                  alt={product.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                />
              </div>

              <div style={{ fontSize: '0.75rem', color: '#d4ff00', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                {product.brand || product.categoryName || 'Fitness Equipment'}
              </div>

              <h3 
                onClick={() => onSelectProduct && onSelectProduct(product)}
                style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.8rem', cursor: 'pointer', flex: 1, fontWeight: 700 }}
              >
                {product.name}
              </h3>

              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '1.2rem' }}>
                {displayPrice}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    addToCart(product, 1, true);
                    toggleWishlist(product);
                  }}
                  className="glow-btn"
                  style={{ padding: '0.65rem', fontSize: '0.85rem' }}
                >
                  <ShoppingCart size={15} /> Move to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer'
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
