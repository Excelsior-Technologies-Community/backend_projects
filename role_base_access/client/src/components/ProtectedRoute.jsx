import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [], requiredPermissions = [] }) => {
  const { user, isAuthenticated, loading, hasRole, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Verifying authorization & security keys...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles
  if (allowedRoles.length > 0) {
    const isRoleAllowed = allowedRoles.some((role) => hasRole(role));
    if (!isRoleAllowed) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Forbidden (403)</h2>
          <p className="text-slate-400 max-w-md mb-6">
            Your current role (<span className="text-indigo-400 font-semibold">{user?.role?.name || 'User'}</span>) does not have sufficient permissions to access this page.
          </p>
          <a
            href="/"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-600/30"
          >
            Return to Dashboard
          </a>
        </div>
      );
    }
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasAll = requiredPermissions.every((perm) => hasPermission(perm));
    if (!hasAll) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Permission Required</h2>
          <p className="text-slate-400 max-w-md mb-6">
            You are missing required permissions: <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-amber-300">{requiredPermissions.join(', ')}</span>.
          </p>
          <a
            href="/"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition"
          >
            Return to Dashboard
          </a>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
