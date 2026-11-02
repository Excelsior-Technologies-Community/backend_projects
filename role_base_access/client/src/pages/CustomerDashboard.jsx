import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const [subRes, txRes] = await Promise.all([
          api.get('/subscriptions/my'),
          api.get('/transactions/my'),
        ]);

        if (subRes.success) {
          setSubscription(subRes.currentSubscription);
        }

        if (txRes.success) {
          setRecentTransactions(txRes.transactions.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleOpenReceipt = async (transactionId) => {
    try {
      const data = await api.get(`/transactions/${transactionId}/receipt`);
      if (data.success) {
        setSelectedReceipt(data.receipt);
      }
    } catch (err) {
      alert(err.message || 'Unable to load payment receipt');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const daysLeft = subscription ? calculateDaysRemaining(subscription.expiryDate) : 0;
  const isExpired = subscription && daysLeft <= 0;

  return (
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/customer/plans"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition self-start sm:self-auto"
        >
          <span>Browse Plans</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Subscription Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-white">Current Subscription</h2>
          </div>
          {subscription && !isExpired ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
              {isExpired ? 'Expired' : 'No active subscription'}
            </span>
          )}
        </div>

        {subscription && !isExpired ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">{subscription.planId?.name} Plan</h3>
                <p className="text-xs text-slate-400 mt-0.5">{subscription.planId?.description}</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xl font-bold text-white">₹{subscription.planId?.price}</span>
                <span className="text-xs text-slate-400 ml-1">/ {subscription.planId?.durationInDays} days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">Start Date</span>
                <span className="text-slate-200 font-medium">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">Expiry Date</span>
                <span className="text-slate-200 font-medium">
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px]">Time Remaining</span>
                <span className="text-indigo-400 font-medium">{daysLeft} days remaining</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                to="/customer/plans"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Change or renew plan &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 space-y-3">
            <p>You do not currently have an active subscription plan.</p>
            <Link
              to="/customer/plans"
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
            >
              Choose a Plan
            </Link>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
          <Link
            to="/customer/payments"
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            View all
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">
                      {tx.planId?.name || 'Subscription'}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                      {tx.razorpayOrderId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">
                      ₹{tx.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          tx.paymentStatus === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : tx.paymentStatus === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {tx.paymentStatus === 'captured' ? (
                        <button
                          onClick={() => handleOpenReceipt(tx._id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
