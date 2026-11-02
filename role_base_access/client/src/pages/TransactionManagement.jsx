import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  IndianRupee,
} from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [search, statusFilter]);

  const fetchTransactions = async () => {
    try {
      let endpoint = `/transactions?search=${encodeURIComponent(search)}`;
      if (statusFilter) endpoint += `&status=${encodeURIComponent(statusFilter)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Error fetching admin transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = async (transactionId) => {
    try {
      const data = await api.get(`/transactions/${transactionId}/receipt`);
      if (data.success) {
        setSelectedReceipt(data.receipt);
      }
    } catch (err) {
      alert(err.message || 'Unable to load receipt');
    }
  };

  // Calculate summary metrics
  const totalVolume = transactions.reduce((sum, tx) => (tx.paymentStatus === 'captured' ? sum + tx.amount : sum), 0);
  const capturedCount = transactions.filter((tx) => tx.paymentStatus === 'captured').length;
  const failedCount = transactions.filter((tx) => tx.paymentStatus === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Transaction & Payment Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Audit payment receipts, track Razorpay order statuses, and search customer purchases.
          </p>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-xs uppercase font-semibold">Captured Revenue</span>
          <p className="text-2xl font-bold text-emerald-400 mt-0.5">₹{totalVolume}</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-xs uppercase font-semibold">Verified Orders</span>
          <p className="text-2xl font-bold text-white mt-0.5">{capturedCount}</p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-xs uppercase font-semibold">Failed Orders</span>
          <p className="text-2xl font-bold text-rose-400 mt-0.5">{failedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by order ID, payment ID, or invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="captured">Captured (Successful)</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed / Cancelled</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No transactions found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan & Order ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <p className="font-semibold text-white">{tx.userId?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{tx.userId?.email || 'N/A'}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-200">{tx.planId?.name || 'Plan'}</span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {tx.razorpayOrderId}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-white text-sm">
                      ₹{tx.amount}
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-300">
                      {tx.razorpayPaymentId || '—'}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.paymentStatus === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.paymentStatus === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      {tx.paymentStatus === 'captured' ? (
                        <button
                          onClick={() => handleOpenReceipt(tx._id)}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl font-medium transition inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
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

export default TransactionManagement;
