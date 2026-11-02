import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const roleName = user?.role?.name || 'Customer';

  return (
    <header className="h-14 bg-black border-b border-slate-800 sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-md font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm px-2 py-0.5 font-medium ${
            roleName === 'Admin'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : roleName === 'Manager'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          }`}
        >
          {roleName}
        </span>

        <Link
          to="/profile"
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
        >
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-200">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="font-medium">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
