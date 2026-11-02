import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { AppProvider, useAuth, useCartWishlist, API_URL } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CompareModal } from './components/CompareModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { MembershipsPage } from './pages/MembershipsPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutContactPages } from './pages/AboutContactPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainLayout = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pendingWishlistProduct, setPendingWishlistProduct] = useState(null);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState('login');

  // Shared Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { 
    toast, 
    clearToast, 
    compareModalOpen, 
    setCompareModalOpen, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    toggleWishlist, 
    setRequireLoginCallback 
  } = useCartWishlist();
  const { user } = useAuth();

  // Register the login-required callback for wishlist
  useEffect(() => {
    setRequireLoginCallback((product) => {
      setPendingWishlistProduct(product);
      setAuthModalDefaultTab('login');
      setAuthModalOpen(true);
    });
    // Cleanup on unmount
    return () => setRequireLoginCallback(null);
  }, [setRequireLoginCallback]);

  // After user logs in, add any pending wishlist product
  useEffect(() => {
    if (user && pendingWishlistProduct) {
      toggleWishlist(pendingWishlistProduct);
      setPendingWishlistProduct(null);
    }
  }, [user]);

  // Fetch Core Store Data
  const fetchData = async () => {
    try {
      const [prodRes, catRes, planRes] = await Promise.all([
        fetch(`${API_URL}/products`).then(r => r.json()),
        fetch(`${API_URL}/categories`).then(r => r.json()),
        fetch(`${API_URL}/membership-plans`).then(r => r.json())
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
      if (planRes.success) setMembershipPlans(planRes.plans);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Square Toast Notification - Bottom Side */}
      {toast && (
        <div
          className="toast-square-bottom"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            maxWidth: '440px',
            minWidth: '300px',
            background: '#0d1117',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderLeft: toast.type === 'error'
              ? '4px solid #ef4444'
              : toast.type === 'info'
              ? '4px solid #06b6d4'
              : '4px solid #ccff00',
            borderRadius: '0px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.9rem',
            padding: '0.85rem 1.1rem',
            backdropFilter: 'blur(12px)',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
            {/* Square Icon Badge */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '0px',
              background: toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.15)'
                : toast.type === 'info'
                ? 'rgba(6, 182, 212, 0.15)'
                : 'rgba(204, 255, 0, 0.15)',
              border: toast.type === 'error'
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : toast.type === 'info'
                ? '1px solid rgba(6, 182, 212, 0.4)'
                : '1px solid rgba(204, 255, 0, 0.4)',
              color: toast.type === 'error'
                ? '#ef4444'
                : toast.type === 'info'
                ? '#06b6d4'
                : '#ccff00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {toast.type === 'error' ? (
                <AlertTriangle size={18} strokeWidth={2.5} />
              ) : toast.type === 'info' ? (
                <Info size={18} strokeWidth={2.5} />
              ) : (
                <CheckCircle2 size={18} strokeWidth={2.5} />
              )}
            </div>

            {/* Message Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#06b6d4' : '#ccff00',
                marginBottom: '2px'
              }}>
                {toast.type === 'error' ? 'SYSTEM ALERT' : toast.type === 'info' ? 'SYSTEM NOTICE' : 'CONFIRMED'}
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#f8fafc',
                lineHeight: 1.35,
                wordBreak: 'break-word'
              }}>
                {toast.message}
              </div>
            </div>
          </div>

          {/* Square Close Button */}
          <button
            onClick={clearToast}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '0px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenCartDrawer={() => setCartDrawerOpen(true)}
      />

      {/* Main Dynamic View */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <HomePage
            setTab={setCurrentTab}
            products={products}
            categories={categories}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentTab === 'shop' && (
          <ShopPage
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentTab === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentTab('shop')}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === 'cart' && (
          <CartCheckoutPage
            setTab={setCurrentTab}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'memberships' && (
          <MembershipsPage
            plans={membershipPlans}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            setTab={setCurrentTab}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            setTab={setCurrentTab}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'wishlist' && (
          <WishlistPage
            setTab={setCurrentTab}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'about' && (
          <AboutContactPages initialTab="about" />
        )}

        {currentTab === 'contact' && (
          <AboutContactPages initialTab="contact" />
        )}

        {(currentTab === 'admin-dashboard' || currentTab === 'admin') && (
          <AdminDashboardPage setTab={setCurrentTab} />
        )}
      </main>

      {/* Modal for Authentication */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingWishlistProduct(null);
        }}
        defaultTab={authModalDefaultTab}
        wishlistProductName={pendingWishlistProduct?.name || null}
        setTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Slide Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        setTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Product Comparison Modal */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Footer */}
      <Footer setTab={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
