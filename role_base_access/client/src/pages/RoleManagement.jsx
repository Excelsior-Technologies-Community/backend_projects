import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  CheckCircle,
  X,
  Users,
  Lock,
} from 'lucide-react';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Form State
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        api.get('/roles'),
        api.get('/roles/permissions'),
      ]);

      if (rolesRes.success) setRoles(rolesRes.roles);
      if (permsRes.success) setPermissions(permsRes.permissions);
    } catch (err) {
      console.error('Error fetching roles and permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedRoleId(null);
    setRoleForm({
      name: '',
      description: '',
      permissions: [],
    });
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setIsEditing(true);
    setSelectedRoleId(role._id);
    setRoleForm({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || [],
    });
    setFeedback({ type: '', message: '' });
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permName) => {
    setRoleForm((prev) => {
      const current = prev.permissions;
      if (current.includes(permName)) {
        return { ...prev, permissions: current.filter((p) => p !== permName) };
      } else {
        return { ...prev, permissions: [...current, permName] };
      }
    });
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await api.put(`/roles/${selectedRoleId}`, roleForm);
        if (res.success) {
          setFeedback({ type: 'success', message: `Role '${res.role.name}' updated successfully!` });
        }
      } else {
        const res = await api.post('/roles', roleForm);
        if (res.success) {
          setFeedback({ type: 'success', message: `Role '${res.role.name}' created successfully!` });
        }
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Are you sure you want to delete role '${role.name}'?`)) return;

    try {
      const res = await api.delete(`/roles/${role._id}`);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        fetchData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Role & Permission Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure system roles, access rules, and assign granular permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Role</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: '', message: '' })}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const isSystem = role.isSystem;
          const isAdmin = role.name === 'Admin';

          return (
            <div
              key={role._id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{role.name}</span>
                    {isSystem && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-400 rounded border border-slate-700">
                        SYSTEM
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {role.userCount || 0} user{role.userCount === 1 ? '' : 's'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-5 min-h-[32px]">
                  {role.description || 'Custom role with defined permissions.'}
                </p>

                {/* Assigned Permissions Badges */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Granted Permissions ({isAdmin ? 'All Permissions' : role.permissions?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {isAdmin ? (
                      <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono">
                        * (Full Superadmin Wildcard Access)
                      </span>
                    ) : role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono"
                        >
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        No special permissions assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(role)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configure Permissions</span>
                </button>

                {!isSystem && (
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete custom role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Reference Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-2">
          System Permissions Registry
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          These granular permissions are checked server-side across API routes and backend services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {permissions.map((p) => (
            <div
              key={p._id}
              className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-indigo-400 font-semibold">{p.name}</span>
                <span className="text-[10px] text-slate-500">{p.module}</span>
              </div>
              <p className="text-slate-400 text-[11px]">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/40">
              <h3 className="font-bold text-white text-base">
                {isEditing ? `Configure Role: ${roleForm.name}` : 'Create New Role'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRole} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. Support Specialist"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Describe the scope of this role..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Checkboxes for permissions */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Select Assigned Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-800 rounded-xl p-3 bg-slate-950/60 max-h-60 overflow-y-auto">
                  {permissions.map((p) => {
                    const isChecked = roleForm.permissions.includes(p.name);
                    return (
                      <label
                        key={p._id}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-indigo-600/10 border border-indigo-500/30' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(p.name)}
                          className="mt-0.5 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-0"
                        />
                        <div className="text-[11px]">
                          <span className="font-mono text-white block">{p.name}</span>
                          <span className="text-slate-500 text-[10px]">{p.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
                >
                  {isEditing ? 'Save Role Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
