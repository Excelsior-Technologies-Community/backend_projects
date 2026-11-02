import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { Receipt, Search, FileText, CheckCircle, Clock, XCircle, ArrowUpDown } from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMyTransactions();
  }, []);

  const fetchMyTransactions = async () => {
    try {
      const data = await api.get('/transactions/my');
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
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
      alert(err.message || 'Unable to load payment receipt');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const q = search.toLowerCase();
    return (
      tx.razorpayOrderId?.toLowerCase().includes(q) ||
      tx.razorpayPaymentId?.toLowerCase().includes(q) ||
      tx.invoiceNumber?.toLowerCase().includes(q) ||
      tx.planId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payment History & Receipts</h2>
          <p className="text-sm text-slate-400 mt-1">
            Review past subscription payments and download verified payment receipts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by order or invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Invoice / Order ID</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <p className="font-bold text-white font-mono text-xs">{tx.invoiceNumber || 'N/A'}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{tx.razorpayOrderId}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200">{tx.planId?.name || 'Plan'}</span>
                      <span className="text-[11px] text-slate-400 block">{tx.planId?.durationInDays} Days</span>
                    </td>
                    <td className="p-4 font-bold text-white text-sm">
                      ₹{tx.amount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.paymentStatus === 'captured'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.paymentStatus === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.paymentStatus === 'captured' && <CheckCircle className="w-3 h-3" />}
                        {tx.paymentStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {tx.paymentStatus === 'failed' && <XCircle className="w-3 h-3" />}
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
                          <span>View Receipt</span>
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

export default PaymentHistory;
