import { useState, useEffect } from 'react';
import { Plus, Trash2, Users as UsersIcon, Shield, User, X, Mail, Lock } from 'lucide-react';
import api from '../services/api';

const Users = () => {
  const [tab, setTab] = useState('admins'); // 'admins' | 'customers'
  const [admins, setAdmins] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminRes, custRes] = await Promise.all([
        api.get('/users'),
        api.get('/customers')
      ]);
      setAdmins(adminRes.data || []);
      setCustomers(custRes.data || []);
    } catch (err) {
      console.error('Failed to load user accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      setShowAddAdminModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchData();
    } catch (err) {
      alert('Failed to create admin: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Delete this admin user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer account?')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform administrators and registered property seekers.</p>
        </div>
        {tab === 'admins' && (
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Administrator
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('admins')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
            tab === 'admins'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Administrators ({admins.length})</span>
        </button>
        <button
          onClick={() => setTab('customers')}
          className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm border-b-2 transition cursor-pointer ${
            tab === 'customers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Registered Customers ({customers.length})</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'admins' ? (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading administrators...</td></tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{admin.name}</td>
                      <td className="py-3.5 px-4 text-blue-600">{admin.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 capitalize">
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-400">
                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {admin.email !== 'admin@realestate.com' && (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading customers...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan="5" className="py-8 text-center text-gray-400">No customers registered yet.</td></tr>
                ) : (
                  customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {cust.firstName} {cust.lastName || ''}
                      </td>
                      <td className="py-3.5 px-4 text-blue-600">{cust.email}</td>
                      <td className="py-3.5 px-4 text-gray-500">{cust.phone || '—'}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-400">
                        {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCustomer(cust.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal: Add Administrator */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add Administrator</h3>
              <button onClick={() => setShowAddAdminModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
