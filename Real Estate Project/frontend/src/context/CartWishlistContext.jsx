import React, { createContext, useContext, useState, useEffect } from 'react';

const CartWishlistContext = createContext();

export const parsePrice = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  if (!priceVal) return 0;
  const cleaned = priceVal.toString().replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

export const formatPrice = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num || 0);
};

export const CartWishlistProvider = ({ children }) => {
  // Load initial cart and wishlist from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('real_estate_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('real_estate_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load wishlist from localStorage', e);
      return [];
    }
  });

  // UI state for drawers & modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success', // 'cart' | 'wishlist' | 'info' | 'success'
    actionText: '',
    onAction: null
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('real_estate_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('real_estate_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Toast auto-hide
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = ({ title, message, type = 'success', actionText = '', onAction = null }) => {
    setToast({
      show: true,
      title,
      message,
      type,
      actionText,
      onAction
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Cart operations
  const addToCart = (product, selectedSqft = null, qty = 1, openDrawer = false) => {
    const sqft = selectedSqft || (product.sqftOptions && product.sqftOptions[0]) || 'Standard Plan';
    const cartItemId = `${product.id}-${sqft}`;
    const priceNum = parsePrice(product.price);
    const image = product.image1 || product.image || '';

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name || product.title,
            category: product.category || 'Real Estate',
            price: product.price,
            priceNum,
            image,
            sqft,
            quantity: qty
          }
        ];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }

    showToast({
      title: 'Added to Cart',
      message: `${product.name || 'Property'} (${sqft}) has been added.`,
      type: 'cart',
      actionText: 'View Cart',
      onAction: () => setIsCartOpen(true)
    });
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartItemId) => {
    const itemToRemove = cart.find((i) => i.cartItemId === cartItemId);
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    if (itemToRemove) {
      showToast({
        title: 'Removed from Cart',
        message: `${itemToRemove.name} was removed from your cart.`,
        type: 'info'
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    showToast({
      title: 'Cart Cleared',
      message: 'All properties removed from cart.',
      type: 'info'
    });
  };

  // Wishlist operations
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast({
        title: 'Removed from Wishlist',
        message: `${product.name || 'Property'} removed from your wishlist.`,
        type: 'wishlist'
      });
    } else {
      const priceNum = parsePrice(product.price);
      const image = product.image1 || product.image || '';
      const newItem = {
        id: product.id,
        name: product.name || product.title,
        category: product.category || 'Real Estate',
        price: product.price,
        priceNum,
        image,
        image2: product.image2 || image,
        sqftOptions: product.sqftOptions || ['Standard Plan'],
        rating: product.rating || 5,
        isNew: product.isNew || false
      };
      setWishlist((prev) => [...prev, newItem]);
      showToast({
        title: 'Added to Wishlist',
        message: `${product.name || 'Property'} saved to your wishlist.`,
        type: 'wishlist',
        actionText: 'View Wishlist',
        onAction: () => setIsWishlistOpen(true)
      });
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast({
      title: 'Wishlist Cleared',
      message: 'All properties removed from wishlist.',
      type: 'info'
    });
  };

  const moveWishlistToCart = (product, selectedSqft = null) => {
    addToCart(product, selectedSqft, 1, false);
    removeFromWishlist(product.id);
    showToast({
      title: 'Moved to Cart',
      message: `${product.name} moved to your cart.`,
      type: 'cart',
      actionText: 'View Cart',
      onAction: () => setIsCartOpen(true)
    });
  };

  const moveAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item, item.sqftOptions ? item.sqftOptions[0] : null, 1, false);
    });
    setWishlist([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast({
      title: 'All Wishlist Items Moved',
      message: 'All saved properties have been added to your cart.',
      type: 'cart'
    });
  };

  // Calculations
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.priceNum * item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        cartTotalCount,
        cartSubtotal,
        wishlistCount,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        quickViewProduct,
        setQuickViewProduct,
        openQuickView: (product) => setQuickViewProduct(product),
        closeQuickView: () => setQuickViewProduct(null),
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        openCheckout: () => setIsCheckoutModalOpen(true),
        closeCheckout: () => setIsCheckoutModalOpen(false),
        toast,
        showToast,
        hideToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveWishlistToCart,
        moveAllWishlistToCart
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
