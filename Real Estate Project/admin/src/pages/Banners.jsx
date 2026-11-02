import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileImage, X, ExternalLink } from 'lucide-react';
import api from '../services/api';

const Banners = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '/properties',
    sortOrder: 0,
    status: 'Active'
  });

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sliders');
      setSliders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAdd = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '/properties',
      sortOrder: sliders.length + 1,
      status: 'Active'
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      image: item.image,
      link: item.link || '/properties',
      sortOrder: item.sortOrder || 0,
      status: item.status || 'Active'
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner slide?')) return;
    try {
      await api.delete(`/sliders/${id}`);
      fetchSliders();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/sliders/${editingId}`, formData);
      } else {
        await api.post('/sliders', formData);
      }
      setShowModal(false);
      fetchSliders();
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Banner & Slider Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage homepage hero banners, promotional carousels, and landing CTA slides.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Banner Slide
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Title / Headline</th>
                <th className="py-3 px-4">Link Destination</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Loading banners...</td></tr>
              ) : sliders.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">No banner sliders found. Click 'Add Banner Slide' to create one.</td></tr>
              ) : (
                sliders.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4">
                      <img
                        src={s.image}
                        alt={s.title || 'Banner'}
                        className="w-24 h-14 object-cover rounded-lg border border-gray-100"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">{s.title || 'Untitled Banner'}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{s.subtitle || '—'}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-blue-600">
                      {s.link}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-700">
                      #{s.sortOrder}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        s.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Banner' : 'New Banner Slide'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Banner Title / Headline</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Discover Bespoke Luxury Villas"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. World-class architecture in premier neighborhoods"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Target Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/properties"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Banners;
