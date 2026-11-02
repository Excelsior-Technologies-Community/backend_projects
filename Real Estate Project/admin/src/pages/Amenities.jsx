import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckSquare, X, Waves, ShieldCheck, Dumbbell, Trees, Cpu, Wifi, Car, Wind, Eye } from 'lucide-react';
import api from '../services/api';

const iconMap = {
  waves: Waves,
  'shield-check': ShieldCheck,
  dumbbell: Dumbbell,
  trees: Trees,
  cpu: Cpu,
  wifi: Wifi,
  car: Car,
  wind: Wind,
  eye: Eye,
  check: CheckSquare
};

const Amenities = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: 'check' });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/amenities');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setFormData({ name: '', icon: 'check' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setFormData({ name: item.name, icon: item.icon || 'check' });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this amenity?')) return;
    try {
      await api.delete(`/amenities/${id}`);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/amenities/${editingId}`, formData);
      } else {
        await api.post('/amenities', formData);
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Property Amenities</h1>
          <p className="text-sm text-gray-500 mt-1">Features and luxury fixtures linked to individual estate listings.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Amenity
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden max-w-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Amenity Feature</th>
                <th className="py-3 px-4">Icon Key</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-400">Loading amenities...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="3" className="py-8 text-center text-gray-400">No amenities defined.</td></tr>
              ) : (
                items.map((item) => {
                  const IconComp = iconMap[item.icon] || CheckSquare;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-400">
                        {item.icon || 'check'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Amenity' : 'New Amenity'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amenity Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Swimming Pool"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Lucide Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="check">Checkmark (Default)</option>
                  <option value="waves">Waves / Pool</option>
                  <option value="shield-check">Shield / Security</option>
                  <option value="dumbbell">Dumbbell / Gym</option>
                  <option value="trees">Trees / Garden</option>
                  <option value="cpu">Cpu / Smart Home</option>
                  <option value="wifi">WiFi / High-Speed Internet</option>
                  <option value="car">Car / Garage</option>
                  <option value="wind">Wind / Air Conditioning</option>
                  <option value="eye">Eye / Panoramic View</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
                >
                  Save Amenity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Amenities;
