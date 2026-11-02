import React, { useState } from 'react';
import { useCartWishlist } from '../context/AppContext';

export const Footer = ({ setTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useCartWishlist();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      if (showToast) showToast('Thank you for subscribing to our updates!');
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3500);
    }
  };

  const navLinkStyle = {
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.88rem',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
    display: 'inline-block'
  };

  return (
    <footer style={{
      background: '#000000',
      borderTop: '1px solid rgba(255, 255, 255, 0.15)',
      padding: '5rem 0 2.5rem',
      color: '#ffffff'
    }}>
      <div className="container">
        {/* 4-Column Main Layout matching Image 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start'
        }}>
          {/* Column 1: Brand & Subscription */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{
              color: '#d4ff00',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '0.7rem'
            }}>
              BEST ONLINE
            </div>

            <h3 style={{
              fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              PERSONAL{' '}
              <span style={{
                display: 'inline-block',
                background: '#d4ff00',
                color: '#000000',
                padding: '0.12rem 0.55rem',
                transform: 'rotate(-2.5deg)',
                fontWeight: 900,
                fontSize: '0.45em',
                verticalAlign: 'middle',
                marginLeft: '6px',
                letterSpacing: '0.04em',
                lineHeight: 1.2
              }}>
                TRAINER
              </span>
              <br />
              SUBSCRIPTION
            </h3>

            <div style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1.4rem'
            }}>
              Join now for 7 days <span style={{ color: '#d4ff00', fontWeight: 900 }}>FREE</span> trial
            </div>

            {/* Newsletter Form */}
            {subscribed ? (
              <div style={{
                color: '#d4ff00',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: 'rgba(212, 255, 0, 0.1)',
                padding: '0.75rem 1rem',
                border: '1px solid #d4ff00'
              }}>
                ✓ Subscribed! Check your inbox for exclusive passes.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '360px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#0a0a0a',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                    minWidth: '160px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#d4ff00',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    letterSpacing: '0.02em',
                    padding: '0.75rem 1.4rem',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'none',
                    transition: 'background 0.2s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e6ff40'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#d4ff00'}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Column 2: Shop: */}
          <div>
            <h4 style={{
              color: '#d4ff00',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              marginBottom: '1.4rem'
            }}>
              Shop:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button
                  onClick={() => setTab('shop')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('shop')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  All Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('shop')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (showToast) showToast('Product comparison list is open.');
                  }}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Compare
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('wishlist')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('cart')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  My Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Account: */}
          <div>
            <h4 style={{
              color: '#d4ff00',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              marginBottom: '1.4rem'
            }}>
              Account:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <button
                  onClick={() => setTab('admin-dashboard')}
                  style={{ ...navLinkStyle, color: '#ccff00', fontWeight: 700 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ccff00'}
                >
                  🔒 Admin Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('about')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('contact')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('about')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Faq's
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('memberships')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('contact')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('about')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTab('about')}
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Share : */}
          <div>
            <h4 style={{
              color: '#d4ff00',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
              marginBottom: '1.4rem'
            }}>
              Share :
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  style={navLinkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4ff00'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching Image 3 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '4rem',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Copyright */}
          <div style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.65)',
            fontWeight: 500
          }}>
            © 2026, Personaltrainer WorkDo, Powered by WorkDo.io
          </div>

          {/* Payment Badges (VISA, MasterCard, AMEX, PayPal, Diners, Discover) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* VISA */}
            <div style={{
              background: '#1a1f71',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '3px',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px'
            }}>
              VISA
            </div>

            {/* MasterCard */}
            <div style={{
              background: '#222222',
              padding: '4px 8px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eb001b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f79e1b', marginLeft: '-5px', opacity: 0.9 }} />
              </div>
            </div>

            {/* AMEX */}
            <div style={{
              background: '#006fcf',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.62rem',
              letterSpacing: '0.04em',
              padding: '4px 8px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px'
            }}>
              AM EX
            </div>

            {/* PayPal */}
            <div style={{
              background: '#003087',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.7rem',
              padding: '4px 9px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              height: '24px'
            }}>
              <span style={{ fontStyle: 'italic', color: '#0079c1' }}>P</span>
              <span style={{ fontStyle: 'italic', color: '#00457c' }}>P</span>
            </div>

            {/* Diners Club / International */}
            <div style={{
              background: '#ffffff',
              color: '#004a98',
              fontWeight: 800,
              fontSize: '0.68rem',
              padding: '4px 8px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px'
            }}>
              <span style={{ fontSize: '0.8rem', marginRight: '2px' }}>◓</span>
            </div>

            {/* Discover */}
            <div style={{
              background: '#ffffff',
              color: '#f6821f',
              fontWeight: 900,
              fontSize: '0.62rem',
              letterSpacing: '0.04em',
              padding: '4px 8px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px'
            }}>
              DISCOVER
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
