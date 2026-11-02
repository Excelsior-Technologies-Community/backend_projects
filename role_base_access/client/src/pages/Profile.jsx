import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import {
  User,
  Mail,
  Shield,
  Key,
  CheckCircle,
  AlertCircle,
  Lock,
  Briefcase,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (password && password !== confirmPassword) {
      return setFeedback({ type: 'error', message: 'Passwords do not match' });
    }

    if (password && password.length < 6) {
      return setFeedback({ type: 'error', message: 'Password must be at least 6 characters' });
    }

    setLoading(true);
    try {
      const payload = { name };
      if (password) payload.password = password;

      const res = await api.put('/auth/profile', payload);
      if (res.success) {
        updateUserProfile(res.user);
        setPassword('');
        setConfirmPassword('');
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const roleName = user?.role?.name || 'Customer';
  const permissions = user?.role?.permissions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">User Account & Profile</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal account credentials and view your security authorization matrix.
        </p>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Role and Security Overview */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h3 className="font-bold text-white text-base">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Assigned Role:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold ${
                  roleName === 'Admin'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : roleName === 'Manager'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                {roleName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status:</span>
              <span className="text-emerald-400 font-semibold">Active Verified</span>
            </div>

            {user?.assignedManager && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Dedicated Manager:</span>
                <span className="text-amber-300 font-medium">{user.assignedManager.name}</span>
              </div>
            )}
          </div>

          {/* Permissions view */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Granted RBAC Permissions ({roleName === 'Admin' ? 'All' : permissions.length})
            </span>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {roleName === 'Admin' ? (
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono">
                  * (Superadmin All Access)
                </span>
              ) : permissions.length > 0 ? (
                permissions.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono"
                  >
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">Standard customer permissions</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Update Form */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base mb-4">Edit Profile & Credentials</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Email Address (Immutable)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-bold text-white block mb-3">Change Password</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
