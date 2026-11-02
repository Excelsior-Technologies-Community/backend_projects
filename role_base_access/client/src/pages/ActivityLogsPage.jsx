import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import {
  Activity,
  Search,
  Shield,
  Clock,
  User,
  Key,
  CreditCard,
  FileCheck,
} from 'lucide-react';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  const fetchLogs = async () => {
    try {
      let endpoint = `/logs?search=${encodeURIComponent(search)}`;
      if (actionFilter) endpoint += `&action=${encodeURIComponent(actionFilter)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('LOGIN')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (action.includes('PAYMENT_SUCCESS') || action.includes('CAPTURED')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('FAIL') || action.includes('DEACTIVATED')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    if (action.includes('ROLE')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Activity & Audit Logs</h2>
          <p className="text-sm text-slate-400 mt-1">
            Immutable security event logs tracking logins, role adjustments, plans, and payment state changes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by actor email, details, or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Action Types</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="USER_REGISTERED">User Registrations</option>
            <option value="ROLE_ASSIGNED">Role Assignments</option>
            <option value="PAYMENT_SUCCESSFUL">Successful Payments</option>
            <option value="PAYMENT_FAILED">Payment Failures</option>
            <option value="PLAN_CREATED">Plan Modifications</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No activity logs found matching the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <p className="font-semibold text-white">{log.actor?.name || 'System'}</p>
                      <p className="text-[10px] text-slate-400">
                        {log.actor?.email} {log.actor?.role && `(${log.actor.role})`}
                      </p>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-300">{log.resource}</span>
                      {log.resourceId && (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {log.resourceId.slice(-6)}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-slate-300 text-xs max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
