import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Categories from './pages/Categories';
import Locations from './pages/Locations';
import Amenities from './pages/Amenities';
import Gallery from './pages/Gallery';
import Inquiries from './pages/Inquiries';
import Users from './pages/Users';
import Testimonials from './pages/Testimonials';
import Banners from './pages/Banners';
import CMS from './pages/CMS';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="categories" element={<Categories />} />
          <Route path="locations" element={<Locations />} />
          <Route path="amenities" element={<Amenities />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="users" element={<Users />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="banners" element={<Banners />} />
          <Route path="cms" element={<CMS />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
