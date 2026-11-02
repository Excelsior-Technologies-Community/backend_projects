import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { Check, CreditCard, AlertCircle } from 'lucide-react';
import RazorpayModal from '../components/RazorpayModal';
import ReceiptModal from '../components/ReceiptModal';

const CustomerPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await api.get('/plans');
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = async (plan) => {
    setFeedback({ type: '', message: '' });

    try {
      const configRes = await api.get('/payments/config');
      const keyId = configRes.keyId;
      const isSimulation = configRes.isSimulationMode;

      const orderRes = await api.post('/payments/create-order', { planId: plan._id });
      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to create order');
      }

      const order = orderRes.order;

      if (!isSimulation && window.Razorpay) {
        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'RBAC Subscription Portal',
          description: `${order.planName} Plan (${order.durationInDays} days)`,
          order_id: order.id,
          handler: async (response) => {
            await handlePaymentSuccess(response);
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#4f46e5',
          },
          modal: {
            ondismiss: async () => {
              await handlePaymentFailure({
                razorpay_order_id: order.id,
                payment_failed: true,
                failure_reason: 'Checkout dismissed',
              });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', async (response) => {
          await handlePaymentFailure({
            razorpay_order_id: order.id,
            payment_failed: true,
            failure_reason: response.error?.description || 'Payment Failed',
          });
        });
        rzp.open();
      } else {
        setOrderData(order);
        setIsSimulatorOpen(true);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Payment initiation failed' });
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const verifyRes = await api.post('/payments/verify', paymentResponse);
      if (verifyRes.success) {
        setIsSimulatorOpen(false);
        setFeedback({
          type: 'success',
          message: 'Payment completed successfully. Your subscription is now active.',
        });

        if (verifyRes.transaction?._id) {
          const receiptRes = await api.get(`/transactions/${verifyRes.transaction._id}/receipt`);
          if (receiptRes.success) {
            setSelectedReceipt(receiptRes.receipt);
          }
        }
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Payment verification failed' });
    }
  };

  const handlePaymentFailure = async (failureData) => {
    try {
      await api.post('/payments/verify', failureData);
      setFeedback({
        type: 'error',
        message: failureData.failure_reason || 'Payment failed or was cancelled.',
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white">Subscription Plans</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Select a plan to start or renew your subscription.
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-3.5 rounded-lg flex items-center gap-2.5 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Clean Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {plans.map((plan) => {
          const isFeatured = plan.name.toLowerCase().includes('pro');

          return (
            <div
              key={plan._id}
              className={`rounded-xl p-6 flex flex-col justify-between border ${
                isFeatured
                  ? 'bg-slate-900 border-indigo-500/80'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-white">{plan.name}</h2>
                  {isFeatured && (
                    <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 rounded text-[11px] font-medium border border-indigo-500/30">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 min-h-[32px] mb-4">
                  {plan.description}
                </p>

                <div className="mb-6 pb-4 border-b border-slate-800">
                  <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/ {plan.durationInDays} days</span>
                </div>

                <div className="space-y-2.5 mb-6">
                  {plan.features?.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSubscribeClick(plan)}
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs transition ${
                  isFeatured
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                Subscribe
              </button>
            </div>
          );
        })}
      </div>

      {isSimulatorOpen && (
        <RazorpayModal
          isOpen={isSimulatorOpen}
          orderData={orderData}
          onClose={() => setIsSimulatorOpen(false)}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default CustomerPlans;
