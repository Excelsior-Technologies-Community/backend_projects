import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  ArrowLeftRight, 
  Star, 
  Check, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus,
  ExternalLink
} from 'lucide-react';
import { useCartWishlist } from '../context/AppContext';

export const ProductPreviewModal = ({ product, isOpen, onClose, onSelectProduct }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    toggleCompare, 
    isInCompare,
    showToast 
  } = useCartWishlist();

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Reset quantity when opened
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [isOpen, product]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const wishlisted = isInWishlist(product.id);
  const compared = isInCompare(product.id);
  const displayImage = product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      images: [displayImage],
      categoryName: product.brand || product.categoryName || 'Equipment',
      description: product.description
    }, quantity);

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return createPortal(
    <div 
      className="animate-fade"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '920px',
          background: '#0c0f17',
          border: '1px solid #232b3b',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(212, 255, 0, 0.12)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 20,
            background: 'rgba(26, 32, 44, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d4ff00';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(26, 32, 44, 0.8)';
            e.currentTarget.style.color = '#ffffff';
          }}
          title="Close Preview"
        >
          <X size={18} />
        </button>

        {/* Modal Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) 1.25fr',
          gap: '2rem',
          padding: '2rem'
        }}>
          {/* Left Column: Image Showcase */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            maxHeight: '440px',
            padding: '1.5rem',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
          }}>
            {/* Badge */}
            {product.badge && (
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: '#d4ff00',
                color: '#000000',
                fontSize: '0.72rem',
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                zIndex: 5
              }}>
                {product.badge}
              </span>
            )}

            <img 
              src={displayImage}
              alt={product.name}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                transition: 'transform 0.4s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          </div>

          {/* Right Column: Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Brand */}
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#d4ff00',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem'
            }}>
              {product.brand || 'Elite Fitness'}
            </div>

            {/* Product Title */}
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.3,
              marginBottom: '0.65rem'
            }}>
              {product.name}
            </h2>

            {/* Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 5) ? '#f59e0b' : 'none'}
                    strokeWidth={i < Math.floor(product.rating || 5) ? 0 : 1.5}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {product.rating || 5}.0 (Verified Customer Ratings)
              </span>
            </div>

            {/* Price section */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.85rem',
              marginBottom: '1.2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #1e2636'
            }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff' }}>
                {product.formattedPrice || `Rs. ${product.price?.toLocaleString()} INR`}
              </span>
              {product.comparePrice && (
                <>
                  <span style={{ fontSize: '1.05rem', color: '#64748b', textDecoration: 'line-through' }}>
                    {product.formattedComparePrice || `Rs. ${product.comparePrice?.toLocaleString()} INR`}
                  </span>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Save Rs. {(product.comparePrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.88rem',
              lineHeight: 1.6,
              color: '#cbd5e1',
              marginBottom: '1.25rem'
            }}>
              {product.description}
            </p>

            {/* Specs Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#131824', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Resistance</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{product.specs?.['Resistance'] || '8-Level Magnetic'}</span>
              </div>
              <div style={{ background: '#131824', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Flywheel</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{product.specs?.['Flywheel'] || '6 Kg Smooth Flywheel'}</span>
              </div>
              <div style={{ background: '#131824', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Max User Weight</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{product.specs?.['Max Weight'] || '110 Kg'}</span>
              </div>
              <div style={{ background: '#131824', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Console</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{product.specs?.['Display'] || 'Digital LCD Screen'}</span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto', marginBottom: '1rem' }}>
              {/* Qty Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#151b27',
                border: '1px solid #232d3f',
                borderRadius: '6px',
                height: '46px'
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    width: '36px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span style={{
                  minWidth: '32px',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: '#ffffff'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    width: '36px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: '46px',
                  background: addedAnimation ? '#10b981' : '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  if (!addedAnimation) e.currentTarget.style.background = '#e6ff40';
                }}
                onMouseLeave={(e) => {
                  if (!addedAnimation) e.currentTarget.style.background = '#d4ff00';
                }}
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} strokeWidth={3} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={17} /> Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '46px',
                  height: '46px',
                  background: wishlisted ? 'rgba(239, 68, 68, 0.15)' : '#151b27',
                  border: `1px solid ${wishlisted ? '#ef4444' : '#232d3f'}`,
                  borderRadius: '6px',
                  color: wishlisted ? '#ef4444' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={wishlisted ? "In Wishlist" : "Add to Wishlist"}
              >
                <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} strokeWidth={2.2} />
              </button>

              {/* Compare Button */}
              <button
                onClick={() => toggleCompare(product)}
                style={{
                  width: '46px',
                  height: '46px',
                  background: compared ? 'rgba(212, 255, 0, 0.15)' : '#151b27',
                  border: `1px solid ${compared ? '#d4ff00' : '#232d3f'}`,
                  borderRadius: '6px',
                  color: compared ? '#d4ff00' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={compared ? "In Comparison" : "Add to Compare"}
              >
                <ArrowLeftRight size={18} strokeWidth={2.2} />
              </button>
            </div>

            {/* View Full Detail Page Link */}
            {onSelectProduct && (
              <button
                onClick={() => {
                  onClose();
                  onSelectProduct({
                    ...product,
                    image: displayImage,
                    images: [displayImage]
                  });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '4px 0',
                  transition: 'color 0.2s ease',
                  alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <ExternalLink size={14} /> View full product page specifications
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
