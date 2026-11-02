import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      redirectByRole(res.user?.role?.name || 'Customer');
    } else {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  const redirectByRole = (role) => {
    if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (role === 'Manager') {
      navigate('/manager/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  const quickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
    setLoading(true);

    const res = await login(demoEmail, demoPassword);
    setLoading(false);

    if (res.success) {
      redirectByRole(res.user?.role?.name || 'Customer');
    } else {
      setErrorMsg(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-white">Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">
            RBAC & Subscription Management
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Clean Quick Demo Access */}
          {/* <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block mb-2.5 text-center">
              Quick Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin@rbac.com', 'Admin@12345')}
                className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] font-medium transition text-center"
              >
                Admin
              </button>

              <button
                type="button"
                onClick={() => quickLogin('manager@rbac.com', 'Manager@12345')}
                className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] font-medium transition text-center"
              >
                Manager
              </button>

              <button
                type="button"
                onClick={() => quickLogin('customer@rbac.com', 'Customer@12345')}
                className="py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] font-medium transition text-center"
              >
                Customer
              </button>
            </div>
          </div> */}

          <p className="text-center text-xs text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
