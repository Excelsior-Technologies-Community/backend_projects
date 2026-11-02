import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Users, MessageSquare, Tags, MapPin, 
  PlusCircle, ArrowRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-xs p-6 border border-gray-100 transition-all hover:shadow-md hover:border-blue-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-2">
          {value !== undefined && value !== null ? value : '--'}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {},
    recentInquiries: [],
    recentProperties: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setData({
        stats: res.data.stats || {},
        recentInquiries: res.data.recentInquiries || [],
        recentProperties: res.data.recentProperties || []
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const s = data.stats || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <ShieldCheck className="w-4 h-4" />
            <span>MySQL Stored Procedures Active</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Real Estate Overview</h1>
          <p className="text-slate-300 text-sm mt-1">Real-time listing metrics, leads, and store management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-500/25"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition border border-white/10"
          >
            <span>View Website</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={s.total_properties ?? 8}
          icon={Building}
          color="bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/20"
          subtitle={`${s.active_properties ?? 8} Active Listings`}
        />
        <StatCard
          title="Customer Inquiries"
          value={s.total_inquiries ?? 0}
          icon={MessageSquare}
          color="bg-gradient-to-tr from-amber-500 to-orange-400 shadow-amber-500/20"
          subtitle={`${s.new_inquiries ?? 0} Unread Leads`}
        />
        <StatCard
          title="Registered Clients"
          value={s.total_customers ?? 1}
          icon={Users}
          color="bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/20"
          subtitle={`${s.total_admins ?? 1} Admin Accounts`}
        />
        <StatCard
          title="Categories & Areas"
          value={(s.total_categories || 6) + ' / ' + (s.total_locations || 6)}
          icon={Tags}
          color="bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/20"
          subtitle="Taxonomies configured"
        />
      </div>

      {/* Grid: Recent Leads & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Inquiries Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Customer Inquiries</h2>
              <p className="text-xs text-gray-400">Leads generated directly from property details page</p>
            </div>
            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {data.recentInquiries.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No inquiries received yet.
              </div>
            ) : (
              data.recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-blue-50/40 hover:border-blue-100 transition flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {inq.name ? inq.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900 truncate">{inq.name}</p>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        inq.status === 'New' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium truncate mt-0.5">
                      {inq.property_title ? `Property: ${inq.property_title}` : 'General Inquiry'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                      "{inq.message || 'No custom message.'}"
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                      <span>{inq.email}</span>
                      {inq.phone && <span>• {inq.phone}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Properties Card */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Latest Properties</h2>
              <p className="text-xs text-gray-400">Recently listed architectural homes</p>
            </div>
            <Link
              to="/admin/properties"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              Manage Listings
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {data.recentProperties.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-gray-200 transition"
              >
                <img
                  src={p.primary_image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'}
                  alt={p.title}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.title}</p>
                    <span className="text-sm font-extrabold text-blue-600">
                      ${Number(p.price).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{p.address || p.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      {p.category_name || p.type}
                    </span>
                    <span className="text-[10px] font-semibold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                      {p.purpose}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
