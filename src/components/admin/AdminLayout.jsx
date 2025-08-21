import { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: BarChart3 },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Ambika International" className="h-8 w-auto" />
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 lg:hidden"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all
                  ${isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                `}
              >
                <IconComponent size={20} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-all"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-neutral-100 lg:hidden"
            >
              <Menu size={20} className="text-neutral-600" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <Bell size={20} className="text-neutral-600" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Admin profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-neutral-900">Admin User</p>
                    <p className="text-xs text-neutral-500">admin@ambika.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
