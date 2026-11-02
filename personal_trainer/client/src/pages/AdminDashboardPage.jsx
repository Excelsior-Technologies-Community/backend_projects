import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Dumbbell, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  ArrowLeft,
  Search,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth, useCartWishlist, API_URL } from '../context/AppContext';
import { AdminLoginPage } from './AdminLoginPage';

export const AdminDashboardPage = ({ setTab }) => {
  const { token, user, logout } = useAuth();
  const { showToast } = useCartWishlist();

  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'products', 'categories', 'memberships', 'orders', 'users'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Collections State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Modal / Form States for CRUD
  const [productModal, setProductModal] = useState({ open: false, mode: 'create', data: {} });
  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'create', data: {} });
  const [planModal, setPlanModal] = useState({ open: false, mode: 'create', data: {} });

  // Load Admin Data
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, prodRes, catRes, planRes, ordRes, usrRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/products`).then(r => r.json()),
        fetch(`${API_URL}/categories`).then(r => r.json()),
        fetch(`${API_URL}/membership-plans`).then(r => r.json()),
        fetch(`${API_URL}/orders`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/admin/users`, { headers }).then(r => r.json())
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
      if (planRes.success) setMembershipPlans(planRes.plans);
      if (ordRes.success) setOrders(ordRes.orders);
      if (usrRes.success) setUsersList(usrRes.users);
    } catch (err) {
      showToast('Error loading admin portal', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  // --- 1. PRODUCT CRUD OPERATIONS ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEdit = productModal.mode === 'edit';
    const url = isEdit ? `${API_URL}/products/${productModal.data.id}` : `${API_URL}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productModal.data)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setProductModal({ open: false, mode: 'create', data: {} });
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted');
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- 2. CATEGORY CRUD OPERATIONS ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const isEdit = categoryModal.mode === 'edit';
    const url = isEdit ? `${API_URL}/categories/${categoryModal.data.id}` : `${API_URL}/categories`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryModal.data)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setCategoryModal({ open: false, mode: 'create', data: {} });
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Category removed');
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- 3. MEMBERSHIP PLAN CRUD ---
  const handleSavePlan = async (e) => {
    e.preventDefault();
    const isEdit = planModal.mode === 'edit';
    const url = isEdit ? `${API_URL}/membership-plans/${planModal.data.id}` : `${API_URL}/membership-plans`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(planModal.data)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPlanModal({ open: false, mode: 'create', data: {} });
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete membership tier?')) return;
    try {
      const res = await fetch(`${API_URL}/membership-plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Plan removed');
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- 4. ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status set to ${newStatus}`);
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- 5. USER STATUS TOGGLE ---
  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User role updated to ${newRole}`);
        loadAdminData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // If user is not logged in as admin, render dedicated Admin Login Page
  if (!token || !user || user.role !== 'admin') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => loadAdminData()}
        onBackToStore={() => setTab('home')}
      />
    );
  }

  const adminSections = [
    { id: 'overview', label: 'Dashboard', icon: TrendingUp, count: null },
    { id: 'products', label: 'Products', icon: Dumbbell, count: products.length },
    { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
    { id: 'memberships', label: 'Plans', icon: Sparkles, count: membershipPlans.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'users', label: 'Users', icon: Users, count: usersList.length }
  ];

  return (
    <div style={{ maxWidth: '1580px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }} className="animate-fade">
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'rgba(204, 255, 0, 0.1)',
            border: '1px solid rgba(204, 255, 0, 0.3)',
            borderRadius: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ccff00'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Personal Trainer Admin Panel
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Manage e-commerce products, categories, subscription plans, fulfillment, and athletes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTab('home')}
            className="secondary-btn"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', borderRadius: '0px' }}
          >
            <ArrowLeft size={16} /> View Store
          </button>
          <button
            onClick={() => {
              logout();
              showToast('Admin session closed successfully');
            }}
            className="secondary-btn"
            style={{
              fontSize: '0.82rem',
              padding: '0.5rem 1rem',
              borderRadius: '0px',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)'
            }}
          >
            <LogOut size={15} /> Logout Admin
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Left = Admin Categories Sidebar, Right = Results Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* LEFT SIDE: Admin Categories Sidebar */}
        <aside style={{
          background: '#0d1117',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: '3px solid #ccff00',
          borderRadius: '0px',
          padding: '1.25rem 0',
          position: 'sticky',
          top: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Sidebar Section Title */}
          <div style={{
            padding: '0 1.25rem 0.9rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#94a3b8'
            }}>
              Admin Categories
            </span>
            <span style={{
              fontSize: '0.68rem',
              background: 'rgba(204, 255, 0, 0.15)',
              color: '#ccff00',
              padding: '2px 6px',
              fontWeight: 800,
              borderRadius: '0px'
            }}>
              {adminSections.length} SECTIONS
            </span>
          </div>

          {/* Categories Navigation List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 0.75rem' }}>
            {adminSections.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1rem',
                    borderRadius: '0px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? 'rgba(204, 255, 0, 0.12)' : 'transparent',
                    color: isActive ? '#ccff00' : '#cbd5e1',
                    border: 'none',
                    borderLeft: isActive ? '4px solid #ccff00' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} color={isActive ? '#ccff00' : '#94a3b8'} strokeWidth={isActive ? 2.4 : 1.8} />
                    <span>{sec.label}</span>
                  </div>

                  {sec.count !== null && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '0px',
                      background: isActive ? '#ccff00' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#000000' : '#94a3b8'
                    }}>
                      {sec.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics / Status in Sidebar */}
          {stats && (
            <div style={{
              margin: '1.5rem 0.75rem 0',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '0px',
              fontSize: '0.78rem'
            }}>
              <div style={{ color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '6px' }}>
                Store Performance
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Revenue</span>
                <span style={{ color: '#ccff00', fontWeight: 700 }}>${stats.totalRevenue?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Orders</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{orders.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Athletes</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{usersList.length}</span>
              </div>
            </div>
          )}

          {/* Admin Account summary at bottom of sidebar */}
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '0px',
              background: '#161d27',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#ccff00'
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f8fafc', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ color: '#ccff00', fontSize: '0.68rem', fontWeight: 600 }}>
                ● Active Session
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Active Category Results */}
        <main style={{ minWidth: 0, flex: 1 }}>

      {/* 1. OVERVIEW DASHBOARD */}
      {activeSection === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Stat Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-neon)' }}>
                ${stats.totalRevenue?.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Across all orders &amp; passes
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Total Orders
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
                {stats.totalOrders}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Fulfillment queue active
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Active Memberships
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
                {stats.activeSubscribers}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Athletes on recurring plans
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Registered Users
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                {stats.totalUsers}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Store accounts created
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Recent Store Purchases</h3>
              <button onClick={() => setActiveSection('orders')} className="secondary-btn" style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}>
                View All Orders
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '0.75rem' }}>Order ID</th>
                    <th style={{ padding: '0.75rem' }}>Athlete</th>
                    <th style={{ padding: '0.75rem' }}>Items</th>
                    <th style={{ padding: '0.75rem' }}>Total</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(ord => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '0.85rem', color: '#fff', fontWeight: 600 }}>#{ord.id}</td>
                      <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{ord.customerName}</td>
                      <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{ord.items?.length} items</td>
                      <td style={{ padding: '0.85rem', color: 'var(--accent-neon)', fontWeight: 700 }}>${ord.total?.toFixed(2)}</td>
                      <td style={{ padding: '0.85rem' }}>
                        <span className="badge-tag">{ord.orderStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCT CRUD MANAGEMENT */}
      {activeSection === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem' }}>Product Catalog Management</h2>
            <button
              onClick={() => setProductModal({
                open: true,
                mode: 'create',
                data: {
                  name: '',
                  categoryId: categories[0]?.id || 'cat-1',
                  price: 49.99,
                  comparePrice: 65.00,
                  stock: 50,
                  sku: 'GEAR-' + Math.floor(1000 + Math.random() * 9000),
                  badge: 'New Arrival',
                  description: 'Engineered for high intensity athletic performance.',
                  images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80']
                }
              })}
              className="glow-btn"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {products.map(prod => (
              <div key={prod.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.name}
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-neon)', fontWeight: 700 }}>{prod.categoryName}</div>
                <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem', flex: 1 }}>{prod.name}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${prod.price?.toFixed(2)}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Stock: {prod.stock}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    onClick={() => setProductModal({ open: true, mode: 'edit', data: prod })}
                    className="secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '0.5rem', color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CATEGORY CRUD MANAGEMENT */}
      {activeSection === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem' }}>Category Management</h2>
            <button
              onClick={() => setCategoryModal({
                open: true,
                mode: 'create',
                data: {
                  name: '',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                  featured: true
                }
              })}
              className="glow-btn"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map(cat => (
              <div key={cat.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.2rem' }}>{cat.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                    {cat.itemCount || 0} Products Attached
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setCategoryModal({ open: true, mode: 'edit', data: cat })}
                      style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', padding: '0.2rem 0.5rem', background: 'rgba(56,189,248,0.1)', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', padding: '0.2rem 0.5rem', background: 'rgba(244,63,94,0.1)', borderRadius: '4px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEMBERSHIP PLAN CRUD */}
      {activeSection === 'memberships' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem' }}>Athletic Membership Tiers</h2>
            <button
              onClick={() => setPlanModal({
                open: true,
                mode: 'create',
                data: {
                  name: '',
                  tagline: '',
                  price: 49.99,
                  billingCycle: 'monthly',
                  popular: false,
                  badge: '',
                  features: 'Exclusive 15% Store Discount\nWeekly Workout Splits\nWhatsApp Support'
                }
              })}
              className="glow-btn"
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
            >
              <Plus size={16} /> Create Plan
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {membershipPlans.map(plan => (
              <div key={plan.id} className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>{plan.name}</h3>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-neon)' }}>${plan.price}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{plan.tagline}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem', flex: 1 }}>
                  {plan.features?.map((f, i) => (
                    <div key={i} style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>• {f}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    onClick={() => setPlanModal({
                      open: true,
                      mode: 'edit',
                      data: { ...plan, features: Array.isArray(plan.features) ? plan.features.join('\n') : plan.features }
                    })}
                    className="secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    Edit Tier
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="secondary-btn"
                    style={{ fontSize: '0.8rem', padding: '0.5rem', color: 'var(--accent-rose)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ORDER MANAGEMENT */}
      {activeSection === 'orders' && (
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            Fulfillment &amp; Order Pipeline
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Order #{order.id}</h3>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      Customer: <strong style={{ color: '#fff' }}>{order.customerName}</strong> ({order.customerEmail})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-neon)' }}>
                      ${order.total?.toFixed(2)}
                    </div>

                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        background: '#0a0d13',
                        color: '#fff',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items & Address */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', fontSize: '0.88rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Items Ordered</div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ color: '#fff', marginBottom: '0.25rem' }}>
                        • {item.name} × {item.quantity} (${(item.price * item.quantity).toFixed(2)})
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Shipping Address</div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. USER MANAGEMENT */}
      {activeSection === 'users' && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            Registered Users &amp; Athletes
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.75rem' }}>User</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Membership</th>
                  <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.85rem', color: '#fff', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem' }}>
                      <span className="badge-tag" style={{
                        background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: u.role === 'admin' ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <span style={{ color: u.membershipStatus === 'active' ? 'var(--accent-neon)' : 'var(--text-dim)' }}>
                        {u.membershipStatus === 'active' ? '⚡ Active Plan' : 'Free Tier'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="secondary-btn"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Toggle {u.role === 'admin' ? 'to User' : 'to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </main>
      </div>

      {/* --- PRODUCT MODAL --- */}
      {productModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade" style={{ background: '#121622', width: '100%', maxWidth: '520px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>
                {productModal.mode === 'edit' ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setProductModal({ open: false, mode: 'create', data: {} })} style={{ color: 'var(--text-dim)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Product Title</label>
                <input
                  type="text"
                  required
                  value={productModal.data.name || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, name: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category</label>
                <select
                  value={productModal.data.categoryId || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, categoryId: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productModal.data.price || ''}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, price: e.target.value } })}
                    style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={productModal.data.stock || ''}
                    onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, stock: e.target.value } })}
                    style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Image URL</label>
                <input
                  type="url"
                  value={productModal.data.images?.[0] || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, images: [e.target.value] } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={3}
                  value={productModal.data.description || ''}
                  onChange={(e) => setProductModal({ ...productModal, data: { ...productModal.data, description: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <button type="submit" className="glow-btn" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CATEGORY MODAL --- */}
      {categoryModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade" style={{ background: '#121622', width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Category Manager</h3>
              <button onClick={() => setCategoryModal({ open: false, mode: 'create', data: {} })} style={{ color: 'var(--text-dim)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryModal.data.name || ''}
                  onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, name: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Category Image URL</label>
                <input
                  type="url"
                  value={categoryModal.data.image || ''}
                  onChange={(e) => setCategoryModal({ ...categoryModal, data: { ...categoryModal.data, image: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <button type="submit" className="glow-btn" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MEMBERSHIP MODAL --- */}
      {planModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card animate-fade" style={{ background: '#121622', width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Plan Tier Editor</h3>
              <button onClick={() => setPlanModal({ open: false, mode: 'create', data: {} })} style={{ color: 'var(--text-dim)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Plan Name</label>
                <input
                  type="text"
                  required
                  value={planModal.data.name || ''}
                  onChange={(e) => setPlanModal({ ...planModal, data: { ...planModal.data, name: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={planModal.data.price || ''}
                    onChange={(e) => setPlanModal({ ...planModal, data: { ...planModal.data, price: e.target.value } })}
                    style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Badge / Tag</label>
                  <input
                    type="text"
                    value={planModal.data.badge || ''}
                    onChange={(e) => setPlanModal({ ...planModal, data: { ...planModal.data, badge: e.target.value } })}
                    placeholder="Popular / VIP"
                    style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={planModal.data.features || ''}
                  onChange={(e) => setPlanModal({ ...planModal, data: { ...planModal.data, features: e.target.value } })}
                  style={{ width: '100%', padding: '0.7rem', background: '#0a0d13', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff' }}
                />
              </div>

              <button type="submit" className="glow-btn" style={{ marginTop: '0.5rem', padding: '0.8rem' }}>
                Save Membership Tier
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
