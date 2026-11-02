import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCartWishlist, formatPrice } from '../context/CartWishlistContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    openCheckout
  } = useCartWishlist();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeInspectionThreshold = 25000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeInspectionThreshold) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161829]/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#63c0ee]/15 flex items-center justify-center text-[#63c0ee]">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#161829] tracking-tight">Shopping Cart</h3>
              <p className="text-xs text-gray-500 font-medium">
                {cartTotalCount} {cartTotalCount === 1 ? 'property / package' : 'properties / packages'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#161829] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free VIP Consultation / Inspection Progress Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 px-5 py-3 border-b border-sky-100">
          <div className="flex items-center justify-between text-xs font-semibold text-[#161829] mb-1.5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#63c0ee]" />
              {cartSubtotal >= freeInspectionThreshold ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Free VIP Property Inspection Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#63c0ee]">{formatPrice(freeInspectionThreshold - cartSubtotal)}</strong> for Free VIP Inspection
                </span>
              )}
            </span>
            <span className="text-gray-500 text-[11px] font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#63c0ee] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 mb-4">
                <ShoppingBag size={36} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-bold text-[#161829] mb-1">Your cart is empty</h4>
              <p className="text-sm text-gray-500 max-w-xs mb-6">
                Explore our trending properties, luxury residences, and premium suites to begin.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('trending-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded shadow-xs transition-colors cursor-pointer"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-4 group">
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer flex-shrink-0"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {item.sqft}
                      </span>
                      <span className="text-[11px] text-[#63c0ee] font-semibold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-gray-50/50">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} strokeWidth={2.5} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#161829]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-extrabold text-[15px] text-[#161829]">
                        {formatPrice(item.priceNum * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-gray-400">
                          {formatPrice(item.priceNum)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/70">
            <div className="space-y-2 mb-4 text-xs font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#161829] font-bold text-sm">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Legal Verification & Escrow Service</span>
                <span className="text-emerald-600 font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/80 pt-2 text-sm font-extrabold text-[#161829]">
                <span>Estimated Total</span>
                <span className="text-[#63c0ee] text-base">{formatPrice(cartSubtotal)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  closeCart();
                  openCheckout();
                }}
                className="w-full bg-[#161829] hover:bg-[#20233b] text-white font-bold text-[13px] tracking-wide py-3.5 rounded flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <button
                onClick={clearCart}
                className="text-[12px] text-gray-400 hover:text-red-500 text-center py-1 font-medium transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200 text-[11px] text-gray-500">
              <ShieldCheck size={14} className="text-[#63c0ee]" />
              <span>100% Secure Transaction & Real Estate Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
