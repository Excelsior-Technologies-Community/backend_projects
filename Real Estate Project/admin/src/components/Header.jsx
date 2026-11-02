import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, UserCircle, LogOut, ExternalLink } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({ name: 'Admin', role: 'admin' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-xs flex items-center justify-between px-6 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-80 lg:w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Search properties, leads, users..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* View Frontend Site Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-lg transition"
          title="Open Customer Website"
        >
          <span>Live Store</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="h-6 w-px bg-gray-200" />

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
            {adminUser.name?.charAt(0) || 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-800 leading-tight">{adminUser.name || 'Master Admin'}</p>
            <p className="text-[11px] text-gray-400 capitalize">{adminUser.role || 'Superadmin'}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
