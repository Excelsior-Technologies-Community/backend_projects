import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import {
  Users,
  Shield,
  CreditCard,
  IndianRupee,
  Receipt,
  Activity,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await api.get('/logs/stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
        <h1 className="text-xl font-semibold text-white">Admin Overview</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          System metrics, subscriptions, and security activity.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Total Users</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</span>
            <span className="text-xs text-emerald-400">{stats?.activeUsers || 0} active</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Active Subscriptions</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white">{stats?.totalActiveSubs || 0}</span>
            <span className="text-xs text-slate-400">plans</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Successful Payments</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white">{stats?.totalCapturedTransactions || 0}</span>
            <span className="text-xs text-slate-400">orders</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Total Revenue</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white">₹{stats?.totalRevenue || 0}</span>
            <span className="text-xs text-slate-400">INR</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Transactions & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
            <Link
              to="/admin/transactions"
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              View all
            </Link>
          </div>

          <div className="p-2">
            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {stats.recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="p-3 flex items-center justify-between text-xs hover:bg-slate-800/40 rounded-lg transition"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {tx.userId?.name || 'Customer'}
                        <span className="text-slate-400 font-normal ml-1">
                          ({tx.planId?.name || 'Plan'})
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {tx.razorpayOrderId}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-white">₹{tx.amount}</p>
                      <span
                        className={`inline-block text-[10px] font-medium ${
                          tx.paymentStatus === 'captured'
                            ? 'text-emerald-400'
                            : tx.paymentStatus === 'pending'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {tx.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No transactions recorded yet.</p>
            )}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
            <Link
              to="/admin/logs"
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              View all
            </Link>
          </div>

          <div className="p-2">
            {stats?.recentLogs && stats.recentLogs.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {stats.recentLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3 flex items-start justify-between text-xs hover:bg-slate-800/40 rounded-lg transition gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-medium text-indigo-400">{log.action}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{log.actor?.name || 'System'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{log.details}</p>
                    </div>

                    <span className="text-[11px] text-slate-500 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
