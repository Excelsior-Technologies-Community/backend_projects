import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import CategoriesPage from './pages/CategoriesPage';
import LocationsPage from './pages/LocationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import StaticCMSPage from './pages/StaticCMSPage';
import FavoritesPage from './pages/FavoritesPage';

// Global Drawers & Modals
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import QuickViewModal from './components/QuickViewModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import ToastNotification from './components/ToastNotification';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartWishlistProvider>
          <div className="App relative min-h-screen bg-white flex flex-col justify-between">
            <Header />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/terms" element={<StaticCMSPage pageKey="terms" />} />
                <Route path="/privacy" element={<StaticCMSPage pageKey="privacy" />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </main>

            <Footer />

            {/* Global Cart & Wishlist Drawers & Modals */}
            <CartDrawer />
            <WishlistDrawer />
            <QuickViewModal />
            <CheckoutModal />
            <AuthModal />
            <ToastNotification />
          </div>
        </CartWishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
