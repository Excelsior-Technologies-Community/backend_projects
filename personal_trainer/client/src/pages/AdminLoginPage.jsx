import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth, useCartWishlist } from '../context/AppContext';

export const AdminLoginPage = ({ onLoginSuccess, onBackToStore }) => {
  const { login, logout } = useAuth();
  const { showToast } = useCartWishlist();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);

      if (res.success) {
        if (res.user?.role === 'admin') {
          showToast(`Welcome to Admin Console, ${res.user.name || 'Admin'}!`, 'success');
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          // Log out non-admin from admin portal
          logout();
          setError('Access Denied: This portal is strictly restricted to administrator accounts.');
          showToast('Access Denied: Admin role required', 'error');
        }
      } else {
        setError(res.message || 'Invalid administrator credentials. Access refused.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@trainer.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      position: 'relative'
    }}>
      {/* Background glow accent */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(204, 255, 0, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#0d1117',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderTop: '3px solid #ccff00',
        borderRadius: '0px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(204, 255, 0, 0.08)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '1.5rem 2rem 1.2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: '#ccff00',
              boxShadow: '0 0 8px #ccff00'
            }} />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#94a3b8'
            }}>
              Restricted Console
            </span>
          </div>

          <button
            onClick={onBackToStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={14} /> Back to Store
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem 2rem 2.2rem' }}>
          {/* Logo & Headline */}
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '0px',
              background: 'rgba(204, 255, 0, 0.1)',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
              color: '#ccff00'
            }}>
              <ShieldCheck size={30} strokeWidth={2.2} />
            </div>

            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#f8fafc',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.01em',
              marginBottom: '0.4rem',
              textTransform: 'uppercase'
            }}>
              Admin Authentication
            </h1>

            <p style={{
              fontSize: '0.84rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}>
              Separate administrative access gate for catalog, inventory, order processing, and system management.
            </p>
          </div>

          {/* Quick Autofill Helper Banner */}
          <div style={{
            background: 'rgba(204, 255, 0, 0.05)',
            border: '1px solid rgba(204, 255, 0, 0.2)',
            borderRadius: '0px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.8rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              <div style={{ fontWeight: 700, color: '#ccff00', marginBottom: '2px' }}>
                🔑 Demo Admin Access
              </div>
              <span style={{ color: '#94a3b8' }}>admin@trainer.com</span> • <span style={{ color: '#94a3b8' }}>admin123</span>
            </div>

            <button
              type="button"
              onClick={handleFillDemoAdmin}
              style={{
                background: '#ccff00',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '0px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e6ff40'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ccff00'}
            >
              <KeyRound size={12} /> Auto-Fill
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderLeft: '4px solid #ef4444',
              borderRadius: '0px',
              padding: '0.75rem 1rem',
              color: '#fca5a5',
              fontSize: '0.82rem',
              marginBottom: '1.3rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#cbd5e1',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.45rem'
              }}>
                Administrator Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  type="email"
                  required
                  placeholder="admin@trainer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.7rem',
                    background: '#090d12',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ccff00'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.45rem'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Security Key / Password
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.8rem 0.85rem 2.7rem',
                    background: '#090d12',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '0px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ccff00'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '12px',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#64748b',
              marginTop: '0.2rem'
            }}>
              <CheckCircle2 size={13} color="#ccff00" />
              <span>256-bit encrypted administrative session</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.95rem',
                background: '#ccff00',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.92rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                border: 'none',
                borderRadius: '0px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#e6ff40'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#ccff00'; }}
            >
              <ShieldCheck size={18} />
              {loading ? 'Authenticating Admin...' : 'Authenticate & Enter Console'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div style={{
          padding: '1rem 2rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          textAlign: 'center',
          fontSize: '0.76rem',
          color: '#64748b'
        }}>
          Personal Trainer Platform • Enterprise Console v2.4
        </div>
      </div>
    </div>
  );
};
