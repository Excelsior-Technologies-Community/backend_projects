import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext(null);
const CartWishlistContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  // --- Auth State ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trainer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('trainer_token') || '');

  // --- Cart State ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('trainer_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Wishlist State ---
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('trainer_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Ref to hold "requires-login" callback from App.jsx
  const requireLoginRef = useRef(null);
  const setRequireLoginCallback = (fn) => { requireLoginRef.current = fn; };

  // --- Notification Toast ---
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const clearToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('trainer_user', JSON.stringify(user));
      localStorage.setItem('trainer_token', token);
    } else {
      localStorage.removeItem('trainer_user');
      localStorage.removeItem('trainer_token');
    }
  }, [user, token]);

  useEffect(() => {
    localStorage.setItem('trainer_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trainer_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Auth Methods
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Login failed');
      setUser(data.user);
      setToken(data.token);
      showToast(`Welcome back, ${data.user.name}!`);
      return { success: true, user: data.user };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Registration failed');
      setUser(data.user);
      setToken(data.token);
      showToast('Registration successful! Welcome to the Fitness Elite.');
      return { success: true, user: data.user };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    showToast('You have been logged out.');
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUser(data.user);
      showToast('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false };
    }
  };

  // --- Compare State ---
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('trainer_compare');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('trainer_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Cart Methods
  const addToCart = (product, quantity = 1, openDrawer = true) => {
    const prodId = product.id || product._id || product.productId;
    setCart(prev => {
      const existing = prev.find(item => item.productId === prodId || item.id === prodId);
      if (existing) {
        return prev.map(item =>
          (item.productId === prodId || item.id === prodId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        productId: prodId,
        id: prodId,
        name: product.name,
        price: Number(product.price) || 0,
        formattedPrice: product.formattedPrice || (typeof product.price === 'number' ? `Rs. ${product.price.toLocaleString()} INR` : product.price),
        image: product.image || product.images?.[0] || '',
        images: product.images || (product.image ? [product.image] : []),
        categoryName: product.categoryName || product.brand || 'Fitness',
        quantity
      }];
    });
    showToast(`Added ${product.name} to cart! 🛒`);
    if (openDrawer) {
      setCartDrawerOpen(true);
    }
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => (item.productId === productId || item.id === productId) ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId && item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  // Wishlist Methods
  const toggleWishlist = (product) => {
    // Guard: user must be logged in to use wishlist
    if (!user) {
      if (requireLoginRef.current) {
        // Fire the callback so App.jsx opens login modal with this product pending
        requireLoginRef.current(product);
      }
      return;
    }
    const prodId = product.id || product._id || product.productId;
    const exists = wishlist.some(item => (item.id && item.id === prodId) || (item._id && item._id === prodId) || (item.productId && item.productId === prodId));
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== prodId && item._id !== prodId && item.productId !== prodId));
      showToast(`Removed from wishlist`, 'info');
    } else {
      setWishlist(prev => [...prev, {
        ...product,
        id: prodId,
        productId: prodId,
        image: product.image || product.images?.[0] || '',
        images: product.images || (product.image ? [product.image] : []),
        categoryName: product.categoryName || product.brand || 'Fitness',
        formattedPrice: product.formattedPrice || (typeof product.price === 'number' ? `Rs. ${product.price.toLocaleString()} INR` : product.price)
      }]);
      showToast(`Added to wishlist! ❤️`);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some(item => (item.id && item.id === productId) || (item._id && item._id === productId) || (item.productId && item.productId === productId));
  };

  // Compare Methods
  const toggleCompare = (product) => {
    const prodId = product.id || product._id || product.productId;
    const exists = compareList.some(item => (item.id && item.id === prodId) || (item._id && item._id === prodId));
    if (exists) {
      setCompareList(prev => prev.filter(item => item.id !== prodId && item._id !== prodId));
      showToast(`Removed from comparison`, 'info');
    } else {
      if (compareList.length >= 4) {
        showToast('You can compare up to 4 products at a time', 'error');
        setCompareModalOpen(true);
        return;
      }
      setCompareList(prev => [...prev, {
        ...product,
        id: prodId,
        image: product.image || product.images?.[0] || '',
        images: product.images || (product.image ? [product.image] : [])
      }]);
      showToast(`Added to comparison! ⚖️`);
      setCompareModalOpen(true);
    }
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item.id !== productId && item._id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (productId) => {
    if (!productId) return false;
    return compareList.some(item => (item.id && item.id === productId) || (item._id && item._id === productId));
  };

  // Cart Calculation Helpers
  const cartSubtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      <CartWishlistContext.Provider value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        cartDrawerOpen,
        setCartDrawerOpen,
        openCart: () => setCartDrawerOpen(true),
        closeCart: () => setCartDrawerOpen(false),
        wishlist,
        toggleWishlist,
        isInWishlist,
        setRequireLoginCallback,
        compareList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareModalOpen,
        setCompareModalOpen,
        toast,
        showToast,
        clearToast
      }}>
        {children}
      </CartWishlistContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useCartWishlist = () => useContext(CartWishlistContext);
export const API_URL = API_BASE;
