import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  Receipt,
  FileText,
  Activity,
  Briefcase,
  UserCheck,
  LogOut,
  Sliders,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleName = user?.role?.name || 'Customer';

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-slate-800 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          R
        </div>
        <div className="leading-tight">
          <span className="font-semibold text-white text-sm block">RBAC & Billing</span>
          <span className="text-[11px] text-slate-400">Management System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* ADMIN NAV ITEMS */}
        {hasRole('Admin') && (
          <>
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Administration
            </div>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/admin/roles"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Roles & Permissions</span>
            </NavLink>

            <NavLink
              to="/admin/plans"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Plans</span>
            </NavLink>

            <NavLink
              to="/admin/transactions"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>Transactions</span>
            </NavLink>

            <NavLink
              to="/admin/records"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Client Records</span>
            </NavLink>

            <NavLink
              to="/admin/logs"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Activity Logs</span>
            </NavLink>
          </>
        )}

        {/* MANAGER NAV ITEMS */}
        {hasRole('Manager') && (
          <>
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            <NavLink
              to="/manager/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/manager/records"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Assigned Records</span>
            </NavLink>
          </>
        )}

        {/* CUSTOMER NAV ITEMS */}
        {hasRole('Customer') && (
          <>
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Dashboard
            </div>
            <NavLink
              to="/customer/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Overview</span>
            </NavLink>

            <NavLink
              to="/customer/plans"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Plans & Pricing</span>
            </NavLink>

            <NavLink
              to="/customer/payments"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Receipt className="w-4 h-4 text-slate-400" />
              <span>Billing History</span>
            </NavLink>
          </>
        )}

        {/* COMMON PROFILE LINK */}
        <div className="px-2 pt-4 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Account
        </div>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span>Profile Settings</span>
        </NavLink>
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
