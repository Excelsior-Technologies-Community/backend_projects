import { useState, useEffect } from 'react';
import { Trash2, MessageSquare, Edit, X, Mail, Phone, Home, Calendar, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Inquiries = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inquiries');
      setItems(res.data || []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inquiry & Lead Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Buyer viewing requests and message dispatch backed by MySQL & Nodemailer alerts.
          </p>
        </div>
        <div className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl">
          Total Leads: {items.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Client Contact</th>
                <th className="py-3 px-4">Interested Property</th>
                <th className="py-3 px-4">Client Message</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Lead Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    Loading customer inquiries...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No inquiries recorded yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a href={`mailto:${item.email}`} className="hover:text-blue-600">{item.email}</a>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.property_title ? (
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{item.property_title}</p>
                          {item.property_price && (
                            <p className="text-xs text-blue-600 font-bold mt-0.5">
                              ${Number(item.property_price).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">General Website Inquiry</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-xs text-gray-600">
                        {item.message || <span className="italic text-gray-400">No message attached</span>}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition cursor-pointer ${
                          item.status === 'New'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : item.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Lead Detail Information</h3>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-400">Lead Name</span>
                  <span className="text-sm font-bold text-gray-900">{selectedItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-400">Email</span>
                  <a href={`mailto:${selectedItem.email}`} className="text-sm font-semibold text-blue-600 hover:underline">{selectedItem.email}</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-400">Phone</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedItem.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-400">Property Target</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedItem.property_title || 'General'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Client Message Notes</label>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-sm text-slate-800 italic">
                  "{selectedItem.message || 'No additional message.'}"
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Update Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['New', 'Contacted', 'Closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedItem.id, st)}
                      className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        selectedItem.status === st
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inquiries;
