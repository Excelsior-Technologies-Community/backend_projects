import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Building, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    type: 'Villa',
    purpose: 'For Sale',
    status: 'Active',
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 2500,
    address: '',
    featured: false,
    categoryId: '',
    locationId: '',
    imageUrl: ''
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const [propRes, catRes, locRes] = await Promise.all([
        api.get('/properties'),
        api.get('/categories'),
        api.get('/locations')
      ]);
      setProperties(propRes.data.properties || propRes.data || []);
      setCategories(catRes.data || []);
      setLocations(locRes.data || []);
    } catch (err) {
      console.error('Failed to fetch property data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const openAddModal = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      price: '',
      type: 'Villa',
      purpose: 'For Sale',
      status: 'Active',
      bedrooms: 3,
      bathrooms: 2,
      areaSqFt: 2500,
      address: '',
      featured: false,
      categoryId: categories[0]?.id || '',
      locationId: locations[0]?.id || '',
      imageUrl: ''
    });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (prop) => {
    setFormData({
      title: prop.title,
      slug: prop.slug || '',
      description: prop.description || '',
      price: prop.price,
      type: prop.type || 'Villa',
      purpose: prop.purpose || 'For Sale',
      status: prop.status || 'Active',
      bedrooms: prop.bedrooms || 1,
      bathrooms: prop.bathrooms || 1,
      areaSqFt: prop.areaSqFt || 1000,
      address: prop.address || '',
      featured: Boolean(prop.featured),
      categoryId: prop.CategoryId || '',
      locationId: prop.LocationId || '',
      imageUrl: prop.primary_image || ''
    });
    setEditingId(prop.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/properties/${id}/status`, { status: newStatus });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/properties/${editingId}`, formData);
      } else {
        await api.post('/properties', formData);
      }
      setShowModal(false);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert('Failed to save property: ' + (err.response?.data?.error || err.message));
    }
  };

  const filtered = properties.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.address?.toLowerCase().includes(term) ||
      p.category_name?.toLowerCase().includes(term) ||
      p.location_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Property Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and organize real estate listings with MySQL Stored Procedures.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        
        {/* Search header */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Search by title, location, category..."
            />
          </div>
          <span className="text-xs text-gray-500">
            Showing <strong>{filtered.length}</strong> listings
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Category / City</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    Loading properties from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                          alt={prop.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{prop.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{prop.address || 'Address on file'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800">{prop.category_name || prop.type}</p>
                      <p className="text-xs text-gray-400">{prop.location_city || prop.location_name || 'US'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900">
                        ${Number(prop.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {prop.purpose}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border transition cursor-pointer ${
                          prop.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : prop.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(prop)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
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

      {/* Modal: Add / Edit Property */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 my-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Property Listing' : 'Create New Property'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Darth Vader House A-24"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Location / City *</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Location</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1250000"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Purpose *</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.areaSqFt}
                    onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 422 Skyline Ridge, Beverly Hills, CA"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Primary Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Property Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed architectural specifications, finishes, and highlights..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-gray-300"
                />
                <label htmlFor="featuredCheck" className="text-sm font-semibold text-gray-700">
                  Feature on Homepage Hero / Featured Sections
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  {editingId ? 'Update Listing' : 'Save Property'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Properties;
