import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

export default function ToastNotification() {
  const { toast, hideToast } = useCartWishlist();

  if (!toast.show) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag size={18} className="text-[#63c0ee]" />;
      case 'wishlist':
        return <Heart size={18} className="text-rose-500 fill-rose-500" />;
      case 'info':
        return <Info size={18} className="text-blue-400" />;
      default:
        return <CheckCircle2 size={18} className="text-emerald-500" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full animate-bounceIn">
      <div className="bg-[#161829] text-white p-4 rounded-xl shadow-2xl border border-gray-800 flex items-start gap-3 backdrop-blur-md">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          {renderIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-[14px] leading-tight text-white">{toast.title}</h5>
          <p className="text-xs text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
          
          {toast.actionText && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction();
                hideToast();
              }}
              className="mt-2 text-xs font-bold text-[#63c0ee] hover:text-white transition-colors underline underline-offset-2 cursor-pointer"
            >
              {toast.actionText} →
            </button>
          )}
        </div>

        <button
          onClick={hideToast}
          className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
