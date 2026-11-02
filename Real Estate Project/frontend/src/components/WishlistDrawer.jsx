import React, { useEffect } from 'react';
import { X, Trash2, Heart, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist,
    moveWishlistToCart,
    moveAllWishlistToCart,
    wishlistCount
  } = useCartWishlist();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isWishlistOpen) {
        closeWishlist();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  // Lock body scroll
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161829]/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={closeWishlist}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <Heart size={18} fill="currentColor" strokeWidth={0} />
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#161829] tracking-tight">Saved Properties</h3>
              <p className="text-xs text-gray-500 font-medium">
                {wishlistCount} {wishlistCount === 1 ? 'item saved' : 'items saved'}
              </p>
            </div>
          </div>
          <button
            onClick={closeWishlist}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#161829] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-20 h-20 rounded-full bg-rose-50/60 border border-rose-100 flex items-center justify-center text-rose-300 mb-4">
                <Heart size={36} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-bold text-[#161829] mb-1">Your wishlist is empty</h4>
              <p className="text-sm text-gray-500 max-w-xs mb-6">
                Save your favorite luxury estates and units to keep track of them or book later.
              </p>
              <button
                onClick={() => {
                  closeWishlist();
                  const el = document.getElementById('trending-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded shadow-xs transition-colors cursor-pointer"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 group">
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
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
                  {item.isNew && (
                    <span className="absolute top-1.5 left-1.5 bg-[#63c0ee] text-[#161829] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      New
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-[14px] text-[#161829] hover:text-[#63c0ee] transition-colors truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-300 hover:text-rose-500 transition-colors p-1 cursor-pointer flex-shrink-0"
                        title="Remove from wishlist"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#63c0ee]">{item.price}</span>
                      <span className="text-[11px] text-gray-400">• {item.category}</span>
                    </div>

                    {/* Star rating */}
                    {item.rating > 0 && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={10}
                            className={
                              star <= item.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200 fill-gray-200'
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => moveWishlistToCart(item)}
                      className="flex-1 bg-[#161829] hover:bg-[#63c0ee] hover:text-[#161829] text-white font-bold text-[12px] py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/70 flex flex-col gap-2">
            <button
              onClick={moveAllWishlistToCart}
              className="w-full bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829] font-bold text-[13px] tracking-wide py-3.5 rounded flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              Move All to Cart <ArrowRight size={16} />
            </button>
            <button
              onClick={clearWishlist}
              className="text-[12px] text-gray-400 hover:text-red-500 text-center py-1 font-medium transition-colors cursor-pointer"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
