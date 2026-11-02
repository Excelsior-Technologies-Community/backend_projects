import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Building, Lock } from 'lucide-react';
import { useCartWishlist, formatPrice } from '../context/CartWishlistContext';

export default function CheckoutModal() {
  const {
    cart,
    cartSubtotal,
    isCheckoutModalOpen,
    closeCheckout,
    clearCart
  } = useCartWishlist();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    notes: '',
    paymentMethod: 'card'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = 'RE-' + Math.floor(100000 + Math.random() * 900000);
    setBookingId(id);
    setIsSubmitted(true);
    clearCart();
  };

  const handleClose = () => {
    setIsSubmitted(false);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#161829]/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#63c0ee]/15 flex items-center justify-center text-[#63c0ee]">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-[16px] text-[#161829]">
                {isSubmitted ? 'Reservation Confirmed' : 'Secure Property Reservation'}
              </h3>
              <p className="text-xs text-gray-400">Escrow Protected & Verified by Real Estate Club</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-black text-[#161829] mb-2 tracking-tight">
                Reservation Successful!
              </h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                Your reservation request <strong className="text-[#161829]">#{bookingId}</strong> has been secured in our escrow system. A designated senior property advisor will reach out to schedule your physical or virtual private tour.
              </p>

              <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 max-w-md mx-auto text-left mb-6 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact:</span>
                  <span className="font-bold text-[#161829]">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-bold text-[#161829]">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reference:</span>
                  <span className="font-bold text-[#63c0ee]">#{bookingId}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-[#161829] hover:bg-opacity-90 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-lg shadow-md transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order summary mini */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500 font-medium">Cart Total:</span>
                  <span className="font-extrabold text-[#161829] ml-2 text-sm">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> Zero Escrow Fees
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#63c0ee] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eleanor@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#63c0ee] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#63c0ee] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Viewing Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#63c0ee] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reservation Deposit Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#63c0ee] bg-sky-50/50 text-[#161829]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="hidden"
                    />
                    <CreditCard size={16} className="text-[#63c0ee]" />
                    <span className="font-semibold">Credit Card / Token</span>
                  </label>
                  <label
                    className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${
                      formData.paymentMethod === 'wire'
                        ? 'border-[#63c0ee] bg-sky-50/50 text-[#161829]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wire"
                      checked={formData.paymentMethod === 'wire'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'wire' })}
                      className="hidden"
                    />
                    <Building size={16} className="text-[#63c0ee]" />
                    <span className="font-semibold">Bank Wire / Escrow</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Special Inquiries or Requests</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific architectural, financing, or private tour requirements..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#63c0ee] transition-colors"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#161829] hover:bg-[#20233b] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Confirm & Reserve {formatPrice(cartSubtotal)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
