import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X, Star, Building } from 'lucide-react';
import api from '../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    url: '',
    isPrimary: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [imgRes, propRes] = await Promise.all([
        api.get('/gallery'),
        api.get('/properties')
      ]);
      setImages(imgRes.data || []);
      setProperties(propRes.data.properties || propRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setFormData({
      propertyId: properties[0]?.id || '',
      url: '',
      isPrimary: false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gallery', formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Property Gallery Management</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage visual assets across all property listings.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Image to Property
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading media gallery...</div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400">
          No images uploaded yet. Click 'Add Image to Property' above.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.property_title || 'Property Media'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {img.isPrimary ? (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Primary
                  </span>
                ) : null}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-md cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-800 line-clamp-1">{img.property_title || 'Unassigned Property'}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Asset ID #{img.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add Property Image</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Property *</label>
                <select
                  required
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-gray-300"
                />
                <label htmlFor="primaryCheck" className="text-sm font-semibold text-gray-700">
                  Set as Primary Property Image
                </label>
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
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
