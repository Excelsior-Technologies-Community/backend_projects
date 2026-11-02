import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle, AlertTriangle, CreditCard, Lock } from 'lucide-react';

const RazorpayModal = ({ orderData, isOpen, onClose, onSuccess, onFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const handleSimulateSuccess = async () => {
    setIsProcessing(true);
    try {
      // Generate simulated test payment id and signature
      const paymentId = `pay_test_${Date.now()}`;
      const signature = `sig_valid_${Date.now()}`;
      await onSuccess({
        razorpay_order_id: orderData.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateFailure = async () => {
    setIsProcessing(true);
    try {
      await onFailure({
        razorpay_order_id: orderData.id,
        payment_failed: true,
        failure_reason: 'Payment declined by issuing bank (Simulated Test Mode)',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelCheckout = async () => {
    await onFailure({
      razorpay_order_id: orderData.id,
      payment_failed: true,
      failure_reason: 'User cancelled Razorpay checkout',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Razorpay Test Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wide">Razorpay Checkout</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-900 rounded">
                  TEST MODE
                </span>
              </div>
              <p className="text-xs text-blue-200">Order ID: {orderData.id}</p>
            </div>
          </div>
          <button
            onClick={handleCancelCheckout}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Selected Plan</span>
              <span className="text-base font-bold text-white">{orderData.planName}</span>
              <span className="text-xs text-indigo-400 block">({orderData.durationInDays} Days Validity)</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Payable Amount</span>
              <span className="text-2xl font-extrabold text-emerald-400">
                ₹{orderData.planPrice}
              </span>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2.5 text-xs text-indigo-300">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              This is the official test checkout simulator. You can test both <strong>Verified Success</strong> and <strong>Failed Payment</strong> handling in real-time.
            </p>
          </div>

          {/* Test Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simulate Successful Payment (₹{orderData.planPrice})</span>
            </button>

            <button
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Simulate Payment Failure / Gateway Error</span>
            </button>

            <button
              onClick={handleCancelCheckout}
              disabled={isProcessing}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Cancel Checkout Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayModal;
