import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AppContext';

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login', setTab, wishlistProductName }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Sync login/register tab when modal reopens with a different defaultTab
  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultTab === 'login');
      setError('');
    }
  }, [isOpen, defaultTab]);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(registerForm);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setError('');
    setShowPassword(false);
  };

  /* ─── shared input style ─── */
  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.6rem',
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    color: '#111827',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.4rem'
  };

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    left: '12px',
    transform: 'translateY(-50%)',
    color: '#9ca3af'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem',
      animation: 'authFadeIn 0.25s ease'
    }}>
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-input:focus {
          border-color: #d4ff00 !important;
          box-shadow: 0 0 0 3px rgba(212, 255, 0, 0.15) !important;
        }
        .auth-tab-btn {
          transition: all 0.25s ease !important;
        }
        .auth-tab-btn:hover {
          color: #111827 !important;
        }
        .auth-submit-btn:hover:not(:disabled) {
          background: #bfff00 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212, 255, 0, 0.4);
        }
        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-link:hover {
          color: #000000 !important;
          text-decoration: underline !important;
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'authSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        {/* ─── Top Accent Bar ─── */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #d4ff00, #a3e635, #d4ff00)',
          backgroundSize: '200% 100%'
        }} />

        {/* ─── Close Button ─── */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#f3f4f6',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* ─── Header ─── */}
        <div style={{ padding: '2rem 2rem 0', textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#111111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Dumbbell size={26} color="#d4ff00" />
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#111827',
            fontFamily: "'Outfit', sans-serif",
            marginBottom: '0.3rem'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: wishlistProductName ? '0.75rem' : '1.5rem' }}>
            {isLogin
              ? 'Sign in to access your training & orders'
              : 'Join thousands achieving their fitness goals'
            }
          </p>

          {/* Wishlist Context Banner */}
          {wishlistProductName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: '#92400e',
              fontWeight: 600,
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '1rem' }}>❤️</span>
              <span>Sign in to save <strong>"{wishlistProductName}"</strong> to your wishlist</span>
            </div>
          )}
        </div>

        {/* ─── Tab Toggle ─── */}
        <div style={{
          display: 'flex',
          margin: '0 2rem',
          background: '#f3f4f6',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '1.5rem'
        }}>
          <button
            className="auth-tab-btn"
            onClick={() => switchTab(true)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: isLogin ? '#ffffff' : 'transparent',
              color: isLogin ? '#111827' : '#9ca3af',
              boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            className="auth-tab-btn"
            onClick={() => switchTab(false)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: !isLogin ? '#ffffff' : 'transparent',
              color: !isLogin ? '#111827' : '#9ca3af',
              boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {/* ─── Content ─── */}
        <div style={{ padding: '0 2rem 2rem' }}>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.7rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* ═══════════ LOGIN FORM ═══════════ */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={iconStyle} />
                  <input
                    className="auth-input"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={iconStyle} />
                  <input
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      padding: '2px'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  marginTop: '0.3rem',
                  letterSpacing: '0.02em'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#9ca3af' }}>
                Don't have an account?{' '}
                <span
                  className="auth-link"
                  onClick={() => switchTab(false)}
                  style={{ color: '#374151', fontWeight: 700, cursor: 'pointer', transition: 'color 0.2s' }}
                >
                  Create one
                </span>
              </p>

              <div style={{ marginTop: '0.5rem', paddingTop: '0.8rem', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                <span
                  onClick={() => {
                    onClose();
                    if (setTab) setTab('admin-dashboard');
                  }}
                  style={{
                    fontSize: '0.78rem',
                    color: '#6b7280',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  🔒 Looking for Admin Panel? Go to Separate Admin Login
                </span>
              </div>
            </form>
          ) : (
            /* ═══════════ REGISTER FORM ═══════════ */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={iconStyle} />
                  <input
                    className="auth-input"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={iconStyle} />
                  <input
                    className="auth-input"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={iconStyle} />
                  <input
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password (min 6 chars)"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '12px',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      padding: '2px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: '#d4ff00',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  marginTop: '0.3rem',
                  letterSpacing: '0.02em'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#9ca3af' }}>
                Already have an account?{' '}
                <span
                  className="auth-link"
                  onClick={() => switchTab(true)}
                  style={{ color: '#374151', fontWeight: 700, cursor: 'pointer', transition: 'color 0.2s' }}
                >
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
