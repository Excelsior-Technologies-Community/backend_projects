import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import {
  Briefcase,
  ArrowRight,
} from 'lucide-react';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerStats = async () => {
      try {
        const data = await api.get('/logs/stats');
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching manager stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerStats();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-semibold text-white">Manager Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Client accounts and service records assigned to you.
          </p>
        </div>
        <Link
          to="/manager/records"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition self-start sm:self-auto"
        >
          <span>All Assigned Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Total Assigned</span>
          <p className="text-2xl font-bold text-white mt-2">{stats?.totalAssigned || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Open Tickets</span>
          <p className="text-2xl font-bold text-amber-400 mt-2">{stats?.openCount || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">In Progress</span>
          <p className="text-2xl font-bold text-blue-400 mt-2">{stats?.inProgressCount || 0}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-medium text-slate-400">Resolved</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{stats?.resolvedCount || 0}</p>
        </div>
      </div>

      {/* Assigned Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Recent Assigned Records</h2>
          <Link
            to="/manager/records"
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Manage all
          </Link>
        </div>

        {stats?.recentAssignedRecords && stats.recentAssignedRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentAssignedRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">
                      {record.title}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.clientName}
                      <span className="text-[11px] text-slate-400 block">{record.clientEmail}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {record.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          record.status === 'Resolved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : record.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/manager/records"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No records currently assigned to your manager profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
