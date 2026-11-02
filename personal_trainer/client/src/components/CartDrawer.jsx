import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartWishlist, useAuth } from '../context/AppContext';

export const CartDrawer = ({ isOpen, onClose, setTab, onOpenAuthModal }) => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, cartCount } = useCartWishlist();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Dark Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'cartFadeIn 0.3s ease forwards'
        }}
      />

      {/* Slide-over Drawer Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
        animation: 'cartSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        <style>{`
          @keyframes cartSlideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes cartFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .cart-item-row:hover {
            background: #f9fafb !important;
          }
          .cart-qty-btn:hover {
            background: #f3f4f6 !important;
          }
          .cart-remove-btn:hover {
            color: #ef4444 !important;
          }
          .cart-continue-btn:hover {
            background: #000000 !important;
            color: #ffffff !important;
          }
          .cart-checkout-btn:hover {
            background: #bfff00 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(212, 255, 0, 0.4);
          }
          .cart-view-btn:hover {
            background: #111111 !important;
            color: #ffffff !important;
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '1.2rem 1.5rem',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 900,
            color: '#d4ff00',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontFamily: "'Outfit', sans-serif",
            margin: 0
          }}>
            My Cart
          </h3>

          <span style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}
          </span>
        </div>

        {/* Cart Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {cart.length === 0 ? (
            /* ==================== EMPTY STATE ==================== */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              {/* Cart Icon with X */}
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <ShoppingCart size={56} strokeWidth={1.5} color="#1a1a1a" />
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-6px',
                  width: '22px',
                  height: '22px',
                  background: '#000000',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <X size={13} strokeWidth={2.5} color="#ffffff" />
                </div>
              </div>

              <h4 style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#111111',
                fontFamily: "'Outfit', sans-serif",
                marginBottom: '1.8rem',
                letterSpacing: '-0.01em'
              }}>
                Your cart is empty
              </h4>

              <button
                className="cart-continue-btn"
                onClick={() => {
                  setTab('shop');
                  onClose();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '0.85rem 1.6rem',
                  border: '2px solid #000000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                <span>CONTINUE SHOPPING</span>
              </button>
            </div>
          ) : (
            /* ==================== CART ITEMS ==================== */
            <>
              {/* Free Shipping Meter */}
              <div style={{
                padding: '0.85rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.78rem',
                color: '#374151',
                background: '#fafafa'
              }}>
                {cartSubtotal >= 100 ? (
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    🎉 You've unlocked FREE EXPRESS SHIPPING!
                  </span>
                ) : (
                  <span>
                    Add <strong style={{ color: '#000' }}>${(100 - cartSubtotal).toFixed(2)}</strong> more for free shipping
                  </span>
                )}
                <div style={{
                  width: '100%',
                  height: '3px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  marginTop: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, (cartSubtotal / 100) * 100)}%`,
                    height: '100%',
                    background: '#d4ff00',
                    borderRadius: '2px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Items List */}
              <div style={{ flex: 1, padding: '0' }}>
                {cart.map((item, idx) => (
                  <div
                    key={item.productId}
                    className="cart-item-row"
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1.2rem 1.5rem',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Product Image */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <img
                        src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.35rem'
                      }}>
                        <h4 style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: '#111827',
                          lineHeight: 1.35,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '170px'
                        }}>
                          {item.name}
                        </h4>
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                          style={{
                            color: '#9ca3af',
                            padding: '2px',
                            flexShrink: 0,
                            transition: 'color 0.2s ease',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{
                        fontSize: '0.92rem',
                        color: '#000000',
                        fontWeight: 800,
                        marginBottom: '0.7rem'
                      }}>
                        Rs. {(item.price * item.quantity).toLocaleString()} INR
                        {item.quantity > 1 && (
                          <span style={{
                            fontSize: '0.72rem',
                            color: '#6b7280',
                            fontWeight: 500,
                            marginLeft: '6px'
                          }}>
                            (Rs. {item.price.toLocaleString()} each)
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1.5px solid #e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          style={{
                            padding: '5px 10px',
                            color: '#374151',
                            transition: 'background 0.2s ease',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#111827',
                          padding: '0 12px',
                          borderLeft: '1.5px solid #e5e7eb',
                          borderRight: '1.5px solid #e5e7eb',
                          lineHeight: '28px'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          style={{
                            padding: '5px 10px',
                            color: '#374151',
                            transition: 'background 0.2s ease',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with Subtotal & Checkout — only when items exist */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.4rem 1.5rem',
            borderTop: '1px solid #e5e7eb',
            background: '#fafafa',
            flexShrink: 0
          }}>
            {/* Subtotal Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1.1rem'
            }}>
              <span style={{
                color: '#6b7280',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                Subtotal
              </span>
              <span style={{
                color: '#000000',
                fontSize: '1.25rem',
                fontWeight: 900,
                fontFamily: "'Outfit', sans-serif"
              }}>
                Rs. {cartSubtotal.toLocaleString()} INR
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Checkout CTA */}
              <button
                className="cart-checkout-btn"
                onClick={() => {
                  setTab('cart');
                  onClose();
                }}
                style={{
                  width: '100%',
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  padding: '0.9rem',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>

              {/* View Cart */}
              <button
                className="cart-view-btn"
                onClick={() => {
                  setTab('cart');
                  onClose();
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#374151',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: '1.5px solid #d1d5db',
                  padding: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                VIEW FULL CART
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
