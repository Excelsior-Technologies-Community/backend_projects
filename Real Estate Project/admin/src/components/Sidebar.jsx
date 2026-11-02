import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Building, Tags, MapPin, 
  CheckSquare, Image, MessageSquare, Users, 
  Star, FileImage, FileText, Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Properties', path: '/admin/properties', icon: Building },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Locations', path: '/admin/locations', icon: MapPin },
    { name: 'Amenities', path: '/admin/amenities', icon: CheckSquare },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Banners', path: '/admin/banners', icon: FileImage },
    { name: 'CMS Pages', path: '/admin/cms', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">Real Estate Admin</span>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              end={item.path === '/admin'} // Exact match for dashboard
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
