import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, ShoppingCart, Star, Check, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/AppContext';

export const CompareModal = ({ isOpen, onClose, onSelectProduct }) => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    addToCart 
  } = useCartWishlist();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        padding: '1.5rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1100px',
          background: '#0a0d14',
          border: '1px solid #262c3a',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 255, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #1a202c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0d111a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              Product Comparison
            </h2>
            <span style={{
              background: '#d4ff00',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '20px'
            }}>
              {compareList.length} / 4
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                style={{
                  background: 'transparent',
                  border: '1px solid #333d4d',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = '#333d4d';
                }}
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: '#1a202c',
                border: 'none',
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
                e.currentTarget.style.background = '#1a202c';
                e.currentTarget.style.color = '#ffffff';
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', padding: '1.5rem' }}>
          {compareList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(212, 255, 0, 0.1)',
                color: '#d4ff00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.8rem'
              }}>
                ⚖️
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                No Products Selected for Comparison
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
                Click the compare icon on any fitness equipment card to compare specs, flywheel, weight resistance, and prices side by side.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: '#d4ff00',
                  color: '#000000',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e6ff40'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#d4ff00'}
              >
                Browse Equipment
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `180px repeat(${compareList.length}, minmax(220px, 1fr))`,
              gap: '12px',
              minWidth: `${180 + compareList.length * 240}px`
            }}>
              {/* Product Info Row */}
              <div style={{ padding: '0.75rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem' }}>
                Equipment
              </div>
              {compareList.map((item) => (
                <div 
                  key={item.id} 
                  style={{
                    background: '#11151f',
                    border: '1px solid #1f2737',
                    borderRadius: '10px',
                    padding: '1.2rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Remove from comparison"
                  >
                    <X size={13} />
                  </button>

                  <div style={{
                    width: '140px',
                    height: '130px',
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem'
                  }}>
                    <img 
                      src={item.image || item.images?.[0]} 
                      alt={item.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <span style={{ fontSize: '0.7rem', color: '#d4ff00', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    {item.brand || 'Fitness'}
                  </span>
                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0.35rem 0 0.6rem',
                    lineHeight: 1.3
                  }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#d4ff00', marginBottom: '0.75rem' }}>
                    {item.formattedPrice || `Rs. ${item.price?.toLocaleString()} INR`}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(item, 1);
                    }}
                    style={{
                      width: '100%',
                      background: '#d4ff00',
                      color: '#000000',
                      border: 'none',
                      padding: '0.6rem 0.8rem',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                </div>
              ))}

              {/* Rating Row */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Rating
              </div>
              {compareList.map((item) => (
                <div key={`rating-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(item.rating || 5) ? '#f59e0b' : 'none'} 
                      color={i < Math.floor(item.rating || 5) ? '#f59e0b' : '#4b5563'} 
                    />
                  ))}
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginLeft: '4px' }}>
                    ({item.rating || 5}.0)
                  </span>
                </div>
              ))}

              {/* Flywheel Weight */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Flywheel Weight
              </div>
              {compareList.map((item) => (
                <div key={`flywheel-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', textAlign: 'center', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>
                  {item.specs?.['Flywheel'] || '6 Kg Smooth Flywheel'}
                </div>
              ))}

              {/* Resistance Levels */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Resistance System
              </div>
              {compareList.map((item) => (
                <div key={`res-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', textAlign: 'center', color: '#ffffff', fontSize: '0.88rem' }}>
                  {item.specs?.['Resistance'] || '8-Level Magnetic Tension'}
                </div>
              ))}

              {/* Max User Weight */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Max User Weight
              </div>
              {compareList.map((item) => (
                <div key={`weight-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', textAlign: 'center', color: '#ffffff', fontSize: '0.88rem' }}>
                  {item.specs?.['Max Weight'] || '110 Kg'}
                </div>
              ))}

              {/* Display & Monitor */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Console Display
              </div>
              {compareList.map((item) => (
                <div key={`disp-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', textAlign: 'center', color: '#ffffff', fontSize: '0.88rem' }}>
                  {item.specs?.['Display'] || 'LCD Speed, Time, Cal, Pulse'}
                </div>
              ))}

              {/* Warranty */}
              <div style={{ padding: '0.85rem 0', fontWeight: 700, color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #1e2636' }}>
                Warranty
              </div>
              {compareList.map((item) => (
                <div key={`war-${item.id}`} style={{ padding: '0.85rem 0', borderTop: '1px solid #1e2636', textAlign: 'center', color: '#10b981', fontSize: '0.88rem', fontWeight: 700 }}>
                  <Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  1 Year Manufacturer
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #1a202c',
          background: '#0d111a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
            Tip: You can compare up to 4 items simultaneously.
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#222938',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
