import React, { useState, useEffect } from 'react';
import { X, Heart, Star, ShoppingBag, Check, ShieldCheck, MapPin, Maximize2 } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    isInWishlist,
    toggleWishlist
  } = useCartWishlist();

  const [activeImage, setActiveImage] = useState(null);
  const [selectedSqft, setSelectedSqft] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImage(quickViewProduct.image1 || quickViewProduct.image);
      if (quickViewProduct.sqftOptions && quickViewProduct.sqftOptions.length > 0) {
        setSelectedSqft(quickViewProduct.sqftOptions[0]);
      } else {
        setSelectedSqft('Standard Plan');
      }
      setIsAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSqft, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161829]/70 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left: Images */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-xs mb-3 border border-gray-100">
            <img
              src={activeImage}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {quickViewProduct.isNew && (
              <span className="absolute top-3 left-3 bg-[#63c0ee] text-[#161829] text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Image Thumbs */}
          {quickViewProduct.image2 && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveImage(quickViewProduct.image1)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === quickViewProduct.image1 ? 'border-[#63c0ee] scale-105' : 'border-gray-200 opacity-60'
                }`}
              >
                <img src={quickViewProduct.image1} alt="Thumb 1" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setActiveImage(quickViewProduct.image2)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === quickViewProduct.image2 ? 'border-[#63c0ee] scale-105' : 'border-gray-200 opacity-60'
                }`}
              >
                <img src={quickViewProduct.image2} alt="Thumb 2" className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Property Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#63c0ee]" />
              <span className="text-xs font-semibold text-[#161829] uppercase tracking-wider">
                {quickViewProduct.category || 'Real Estate'}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#161829] leading-tight mb-2 tracking-tight">
              {quickViewProduct.name}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= (quickViewProduct.rating || 4)
                      ? 'text-[#63c0ee] fill-[#63c0ee]'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
              <span className="text-xs text-gray-400 font-medium ml-1.5">
                (Verified Listing)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-4 border-b border-gray-100">
              <span className="text-2xl font-black text-[#63c0ee]">
                {quickViewProduct.price}
              </span>
              {quickViewProduct.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {quickViewProduct.oldPrice}
                </span>
              )}
            </div>

            {/* Sqft / Plan Selector */}
            {quickViewProduct.sqftOptions && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Select Architectural Layout:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickViewProduct.sqftOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSqft(opt)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                        selectedSqft === opt
                          ? 'border-[#63c0ee] bg-[#63c0ee]/10 text-[#161829] font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#63c0ee] hover:bg-[#4eaade] text-[#161829] font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check size={16} strokeWidth={3} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`w-12 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  isFavorited
                    ? 'border-rose-500 bg-rose-50 text-rose-500'
                    : 'border-gray-200 text-gray-500 hover:text-rose-500 hover:border-rose-300'
                }`}
                title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck size={13} className="text-[#63c0ee]" />
              <span>Full Escrow Protection & 100% Legal Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
