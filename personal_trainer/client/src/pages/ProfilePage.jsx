import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Sparkles, 
  Settings, 
  LogOut, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Target, 
  Dumbbell, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useAuth, useCartWishlist, API_URL } from '../context/AppContext';

export const ProfilePage = ({ setTab, onOpenAuthModal }) => {
  const { user, token, logout, updateProfile } = useAuth();
  const { showToast } = useCartWishlist();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'membership', 'settings'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    fitnessGoal: user?.fitnessGoal || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Load User Orders
  useEffect(() => {
    if (token) {
      setLoadingOrders(true);
      fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [token]);

  if (!user) {
    return (
      <div className="container animate-fade" style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '500px' }}>
        <div className="glass-card" style={{ padding: '3.5rem 2rem' }}>
          <User size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.6rem' }}>Access Your Profile</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Please sign in to track your gear orders, active coaching memberships, and training goals.
          </p>
          <button onClick={onOpenAuthModal} className="glow-btn" style={{ padding: '0.8rem 2rem' }}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile(profileForm);
    setSavingProfile(false);
  };

  return (
    <div className="container animate-fade" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Top Profile Header Card */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
            alt={user.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-neon)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>{user.name}</h1>
              <span className="badge-tag">
                {user.role === 'admin' ? '🛡️ Administrator' : '⚡ Athlete'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--text-muted)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
              <span>{user.email}</span>
              {user.phone && <span>• {user.phone}</span>}
              {user.fitnessGoal && <span>• Goal: <strong style={{ color: '#fff' }}>{user.fitnessGoal}</strong></span>}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="secondary-btn"
          style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Tab Navigation Sidebar */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: activeTab === 'orders' ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                color: activeTab === 'orders' ? 'var(--accent-neon)' : 'var(--text-muted)'
              }}
            >
              <Package size={18} /> My Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: activeTab === 'membership' ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                color: activeTab === 'membership' ? 'var(--accent-neon)' : 'var(--text-muted)'
              }}
            >
              <Sparkles size={18} /> Membership Status
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: activeTab === 'settings' ? 'rgba(163, 230, 53, 0.15)' : 'transparent',
                color: activeTab === 'settings' ? 'var(--accent-neon)' : 'var(--text-muted)'
              }}
            >
              <Settings size={18} /> Account Settings
            </button>
          </div>
        </div>

        {/* Tab Main Content Area */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* 1. Orders History */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Order History &amp; Tracking
              </h2>

              {orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <Package size={36} color="var(--text-dim)" style={{ marginBottom: '0.8rem' }} />
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You haven't placed any gear orders yet.</p>
                  <button onClick={() => setTab('shop')} className="glow-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
                    Shop Barbells &amp; Supplements
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order.id} className="glass-card" style={{ padding: '1.8rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--border-subtle)',
                        paddingBottom: '1rem',
                        marginBottom: '1.2rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>
                            Order #{order.id}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span className="badge-tag" style={{
                            background: order.orderStatus === 'Delivered' ? 'rgba(163, 230, 53, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            color: order.orderStatus === 'Delivered' ? 'var(--accent-neon)' : 'var(--accent-cyan)'
                          }}>
                            {order.orderStatus}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                            ${order.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.2rem' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
                              alt={item.name}
                              style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                Qty: {item.quantity} × ${item.price?.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking */}
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: 'var(--text-dim)' }}>Tracking Reference:</span>
                        <span style={{ color: 'var(--accent-neon)', fontWeight: 600 }}>{order.trackingNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Membership Status */}
          {activeTab === 'membership' && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Coaching Membership Details
              </h2>

              {user.membershipStatus === 'active' ? (
                <div>
                  <div style={{
                    background: 'rgba(163, 230, 53, 0.08)',
                    border: '1px solid rgba(163, 230, 53, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    marginBottom: '2rem'
                  }}>
                    <span className="badge-tag" style={{ marginBottom: '0.6rem' }}>Active Member</span>
                    <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.4rem' }}>
                      Pro Athlete Coaching Program
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                      You have full access to custom weekly nutrition plans, direct chat support with Marcus, and 15% store discounts.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div style={{ background: '#0a0d13', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>STORE DISCOUNT</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-neon)' }}>15% OFF ACTIVE</div>
                      </div>
                      <div style={{ background: '#0a0d13', padding: '1rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>COACH CHECK-IN</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Every Friday</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setTab('memberships')}
                    className="secondary-btn"
                  >
                    Manage / Upgrade Tier
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Sparkles size={40} color="var(--accent-neon)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    No Active Coaching Plan
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    Unlock direct feedback from Coach Marcus, structured video exercise routines, and storewide perks.
                  </p>
                  <button onClick={() => setTab('memberships')} className="glow-btn">
                    Explore Coaching Plans
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Account Settings */}
          {activeTab === 'settings' && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Athlete Profile Settings
              </h2>

              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Primary Fitness Goal
                  </label>
                  <input
                    type="text"
                    value={profileForm.fitnessGoal}
                    onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="glow-btn"
                  style={{ alignSelf: 'flex-start', padding: '0.8rem 1.8rem', marginTop: '0.5rem' }}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
