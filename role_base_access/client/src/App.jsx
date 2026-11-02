import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import UserManagement from './pages/UserManagement';
import RoleManagement from './pages/RoleManagement';
import PlanManagement from './pages/PlanManagement';
import TransactionManagement from './pages/TransactionManagement';
import PaymentHistory from './pages/PaymentHistory';
import ActivityLogsPage from './pages/ActivityLogsPage';
import RecordManagement from './pages/RecordManagement';
import CustomerPlans from './pages/CustomerPlans';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Root redirector based on authenticated role
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleName = user?.role?.name;
  if (roleName === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  if (roleName === 'Manager') return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RootRedirect />} />

          {/* ADMIN PROTECTED ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout title="System Administration" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/roles" element={<RoleManagement />} />
              <Route path="/admin/plans" element={<PlanManagement />} />
              <Route path="/admin/transactions" element={<TransactionManagement />} />
              <Route path="/admin/records" element={<RecordManagement />} />
              <Route path="/admin/logs" element={<ActivityLogsPage />} />
            </Route>
          </Route>

          {/* MANAGER PROTECTED ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route element={<DashboardLayout title="Manager Operations Desk" />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/records" element={<RecordManagement />} />
            </Route>
          </Route>

          {/* CUSTOMER PROTECTED ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Customer']} />}>
            <Route element={<DashboardLayout title="Customer Dashboard" />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/plans" element={<CustomerPlans />} />
              <Route path="/customer/payments" element={<PaymentHistory />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
