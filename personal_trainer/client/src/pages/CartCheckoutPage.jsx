import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Tag, 
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useCartWishlist, useAuth, API_URL } from '../context/AppContext';

export const CartCheckoutPage = ({ setTab, onOpenAuthModal }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal, showToast } = useCartWishlist();
  const { user, token } = useAuth();

  const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Checkout Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '452 Gym Avenue, Suite 100',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const tax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const grandTotal = Math.max(0, Math.round((cartSubtotal + tax - discountAmount) * 100) / 100);

  // Apply Coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'COACH20') {
      const disc = Math.round(cartSubtotal * 0.2 * 100) / 100;
      setDiscountAmount(disc);
      setCouponApplied(true);
      showToast('20% Coach Discount Applied!');
    } else {
      showToast('Invalid promo code. Try COACH20', 'error');
    }
  };

  // Place Order Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      onOpenAuthModal();
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
          paymentMethod,
          discount: discountAmount
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setPlacedOrder(data.order);
      clearCart();
      setStep('success');
      showToast('Order confirmed! Welcome to the team.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (step === 'success' && placedOrder) {
    return (
      <div className="container animate-fade" style={{ padding: '4rem 1.5rem 8rem', maxWidth: '700px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3.5rem 2rem', border: '1px solid rgba(163, 230, 53, 0.4)' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(163, 230, 53, 0.15)',
            color: 'var(--accent-neon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={40} />
          </div>

          <span className="badge-tag" style={{ marginBottom: '0.8rem' }}>Order Confirmed</span>
          <h1 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '0.5rem' }}>
            Thank You, {placedOrder.customerName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Your gear order <strong style={{ color: '#fff' }}>#{placedOrder.id}</strong> has been received and sent to our warehouse team.
          </p>

          {/* Receipt Summary Box */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Order ID:</span>
              <strong style={{ color: '#fff' }}>{placedOrder.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Tracking Reference:</span>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 600 }}>{placedOrder.trackingNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Total Amount Paid:</span>
              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>${placedOrder.total?.toFixed(2)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Payment Method:</span>
              <span style={{ color: '#fff' }}>{placedOrder.paymentMethod}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setTab('profile')}
              className="glow-btn"
              style={{ padding: '0.85rem 1.8rem' }}
            >
              View Order History
            </button>
            <button
              onClick={() => setTab('shop')}
              className="secondary-btn"
              style={{ padding: '0.85rem 1.8rem' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="container animate-fade" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '600px' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem' }}>
          <ShoppingBag size={50} color="var(--text-dim)" style={{ marginBottom: '1.2rem' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.6rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Ready to power up your workouts? Check out our professional gym dumbbells, barbells, and athlete nutrition.
          </p>
          <button onClick={() => setTab('shop')} className="glow-btn" style={{ padding: '0.9rem 2rem' }}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Step Indicator Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '0.3rem' }}>
            {step === 'cart' ? 'Shopping Cart & Review' : 'Fast Athletic Checkout'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {step === 'cart' ? `${cart.length} unique items in your basket` : 'Complete your shipping & payment details'}
          </p>
        </div>

        {step === 'checkout' && (
          <button
            onClick={() => setStep('cart')}
            className="secondary-btn"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <ArrowLeft size={16} /> Return to Cart
          </button>
        )}
      </div>

      {/* Grid: Left Items/Form vs Right Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Left Side */}
        {step === 'cart' ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cart.map(item => (
                <div
                  key={item.productId}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-neon)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {item.categoryName}
                    </div>
                    <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.3rem' }}>{item.name}</h3>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    background: '#0e1219',
                    padding: '0.2rem 0.5rem'
                  }}>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      style={{ padding: '0.3rem', color: '#fff' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: '30px', textAlign: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      style={{ padding: '0.3rem', color: '#fff' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{ color: 'var(--text-dim)', padding: '0.4rem' }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Tag size={18} color="var(--accent-neon)" />
                <input
                  type="text"
                  placeholder="Coupon code (Try COACH20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    background: '#0a0d13',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none',
                    textTransform: 'uppercase'
                  }}
                />
                <button type="submit" className="secondary-btn" style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}>
                  Apply Code
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Step = 'checkout' */
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {/* Shipping Info */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                1. Shipping Destination
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Athlete Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Zip Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.2rem' }}>
                2. Payment Method
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {['Credit Card', 'PayPal'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === method ? '2px solid var(--accent-neon)' : '1px solid var(--border-subtle)',
                      background: paymentMethod === method ? 'rgba(163, 230, 53, 0.08)' : '#0a0d13',
                      color: '#fff',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <CreditCard size={18} color={paymentMethod === method ? 'var(--accent-neon)' : 'var(--text-dim)'} />
                    {method}
                  </button>
                ))}
              </div>

              <div style={{ background: '#0a0d13', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Lock size={16} color="var(--accent-neon)" />
                256-Bit SSL Encrypted &amp; Secure Payment Processing
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="glow-btn"
              style={{ width: '100%', padding: '1.1rem', fontSize: '1rem' }}
            >
              {placingOrder ? 'Processing Order...' : `Authorize & Pay $${grandTotal.toFixed(2)}`}
            </button>
          </form>
        )}

        {/* Right Side Order Summary */}
        <aside className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Cart Subtotal:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>${cartSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-neon)' }}>
                <span>Promo Discount (20%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (8%):</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>${tax.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>US Shipping:</span>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 700 }}>FREE</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--border-strong)',
            marginBottom: '1.8rem'
          }}>
            <span style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Grand Total:</span>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-neon)', fontWeight: 900 }}>
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          {step === 'cart' && (
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuthModal();
                } else {
                  setStep('checkout');
                }
              }}
              className="glow-btn"
              style={{ width: '100%', padding: '1rem', fontSize: '0.95rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};
