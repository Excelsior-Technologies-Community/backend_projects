import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, FileText, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const CMS = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState({
    page: '',
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cms');
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

  const openEdit = (item) => {
    setFormData({
      page: item.page,
      title: item.title || '',
      content: item.content || '',
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || ''
    });
    setSelectedPage(item.page);
    setShowModal(true);
  };

  const openAdd = () => {
    setFormData({
      page: '',
      title: '',
      content: '',
      metaTitle: '',
      metaDescription: ''
    });
    setSelectedPage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pageKey = selectedPage || formData.page.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      await api.put(`/cms/${pageKey}`, {
        title: formData.title,
        content: formData.content,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription
      });
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CMS Page Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage static editorial pages, company policies, FAQs, and SEO tags.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add CMS Page
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Page Slug</th>
                <th className="py-3 px-4">Page Title</th>
                <th className="py-3 px-4">Content Preview</th>
                <th className="py-3 px-4">SEO Meta Title</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading CMS pages...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-400">No CMS pages configured.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      /{item.page}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 max-w-sm line-clamp-2">
                      {item.content}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400">
                      {item.metaTitle || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        Edit Content
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedPage ? `Edit Page: /${selectedPage}` : 'Create CMS Page'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {!selectedPage && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Page Slug / Route *</label>
                  <input
                    type="text"
                    required
                    value={formData.page}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                    placeholder="e.g. privacy-policy, career, guidelines"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Display Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Terms and Conditions of Service"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Page Content *</label>
                <textarea
                  rows="7"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full editorial or policy content..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Realestate WorkDo | Title"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">SEO Meta Description</label>
                  <input
                    type="text"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Brief description for search engines..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
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
                  Save CMS Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CMS;
