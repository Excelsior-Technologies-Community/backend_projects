import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  User,
  Shield,
  Layers,
} from 'lucide-react';

const RecordManagement = () => {
  const { user, hasRole } = useAuth();
  const [records, setRecords] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Update State
  const [updateStatus, setUpdateStatus] = useState('');
  const [newNote, setNewNote] = useState('');

  // Create Record Form (Admin)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    category: 'General',
    priority: 'Medium',
    assignedManager: '',
  });

  useEffect(() => {
    fetchRecords();
    if (hasRole('Admin')) {
      fetchManagers();
    }
  }, [search, statusFilter]);

  const fetchRecords = async () => {
    try {
      let endpoint = `/records?search=${encodeURIComponent(search)}`;
      if (statusFilter) endpoint += `&status=${encodeURIComponent(statusFilter)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const data = await api.get('/users/managers');
      if (data.success) setManagers(data.managers);
    } catch (err) {
      console.error('Error fetching managers:', err);
    }
  };

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setUpdateStatus(record.status);
    setNewNote('');
    setIsDetailOpen(true);
  };

  const handleSaveRecordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/records/${selectedRecord._id}`, {
        status: updateStatus,
        note: newNote,
      });

      if (res.success) {
        setSelectedRecord(res.record);
        setNewNote('');
        setFeedback({ type: 'success', message: 'Record updated successfully!' });
        fetchRecords();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/records', createForm);
      if (res.success) {
        setIsCreateOpen(false);
        setFeedback({ type: 'success', message: 'Record created & assigned successfully!' });
        fetchRecords();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const isAdmin = hasRole('Admin');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isAdmin ? 'Client Records & Ticket Governance' : 'My Assigned Client Records'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAdmin
              ? 'Oversee all manager assignments, customer queries, and case resolutions.'
              : 'Secure RBAC Workstation: Manage only records allocated to your manager account.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Assign Record</span>
          </button>
        )}
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, client name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs">
            No records found.
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record._id}
              onClick={() => handleOpenDetail(record)}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-indigo-400 border border-slate-700">
                    {record.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      record.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : record.status === 'In Progress'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1 group-hover:text-indigo-400 transition">
                  {record.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {record.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-400">
                <p>
                  Client: <strong className="text-slate-200">{record.clientName}</strong>
                </p>
                {isAdmin && (
                  <p>
                    Manager: <strong className="text-amber-300">{record.assignedManager?.name || 'Unassigned'}</strong>
                  </p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <MessageSquare className="w-3 h-3" />
                    {record.notes?.length || 0} note{record.notes?.length === 1 ? '' : 's'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(record.updatedAt || record.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RECORD DETAIL & UPDATE MODAL */}
      {isDetailOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Client Record Workspace</h3>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-indigo-400 font-semibold">{selectedRecord.category}</span>
                  <span className="text-xs text-slate-400">Priority: {selectedRecord.priority}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{selectedRecord.title}</h4>
                <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  {selectedRecord.description || 'No extended description.'}
                </p>
              </div>

              {/* Client & Manager Info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Client Contact</span>
                  <p className="font-bold text-white mt-0.5">{selectedRecord.clientName}</p>
                  <p className="text-slate-400">{selectedRecord.clientEmail}</p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <span className="text-slate-500 uppercase text-[10px] block font-semibold">Assigned Manager</span>
                  <p className="font-bold text-amber-300 mt-0.5">{selectedRecord.assignedManager?.name || 'Unassigned'}</p>
                  <p className="text-slate-400">{selectedRecord.assignedManager?.email}</p>
                </div>
              </div>

              {/* Notes Timeline */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Manager Work Notes ({selectedRecord.notes?.length || 0})
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedRecord.notes && selectedRecord.notes.length > 0 ? (
                    selectedRecord.notes.map((n, i) => (
                      <div key={i} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-semibold text-indigo-300">{n.authorName}</span>
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300">{n.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No notes added yet.</p>
                  )}
                </div>
              </div>

              {/* Update Status and Add Note Form */}
              <form onSubmit={handleSaveRecordUpdate} className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-400 font-semibold uppercase whitespace-nowrap">
                    Update Status:
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows="2"
                    placeholder="Add an internal manager work note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Save Status & Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RECORD MODAL (ADMIN ONLY) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <h3 className="font-bold text-white text-base">Create & Assign Client Ticket</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Record Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise SLA Onboarding"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Details of the client inquiry or request..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Client Name"
                    value={createForm.clientName}
                    onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Client Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={createForm.clientEmail}
                    onChange={(e) => setCreateForm({ ...createForm, clientEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Billing">Billing</option>
                    <option value="Account Support">Account Support</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Enterprise Plan Inquiry">Enterprise Plan Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Assigned Manager
                  </label>
                  <select
                    required
                    value={createForm.assignedManager}
                    onChange={(e) => setCreateForm({ ...createForm, assignedManager: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Manager</option>
                    {managers.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  Create & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordManagement;
