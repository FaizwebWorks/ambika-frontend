import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useGetDashboardStatsQuery } from '../../store/api/adminApiSlice';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('7days');
  
  // Fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch 
  } = useGetDashboardStatsQuery();

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast.success('Dashboard refreshed!');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening.</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-100 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.data?.stats;
  const recentOrders = dashboardData?.data?.recentOrders || [];
  const topProducts = dashboardData?.data?.topProducts || [];
  const categoryPerformance = dashboardData?.data?.categoryPerformance || [];

  // Prepare stats cards data
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.revenue?.current || 0),
      change: formatPercentage(stats?.revenue?.growth || 0),
      trend: stats?.revenue?.growth >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: stats?.orders?.current?.toLocaleString('en-IN') || '0',
      change: formatPercentage(stats?.orders?.growth || 0),
      trend: stats?.orders?.growth >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Total Products',
      value: stats?.products?.toLocaleString('en-IN') || '0',
      change: 'Active',
      trend: 'neutral',
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Total Customers',
      value: stats?.users?.toLocaleString('en-IN') || '0',
      change: 'Registered',
      trend: 'neutral',
      icon: Users,
      color: 'orange'
    }
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const isPositive = stat.trend === 'up';
          const isNegative = stat.trend === 'down';
          
          return (
            <div key={index} className="bg-white rounded-lg border border-neutral-100 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-neutral-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {isPositive && <TrendingUp size={14} className="text-green-600 mr-1" />}
                    {isNegative && <TrendingDown size={14} className="text-red-600 mr-1" />}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-600' : 
                      isNegative ? 'text-red-600' : 'text-neutral-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'green' ? 'bg-green-50' :
                  stat.color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'
                }`}>
                  <IconComponent size={24} className={
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  } />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-100">
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">Recent Orders</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.customerInfo?.name || order.customer?.name || 'Unknown Customer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-900">
                        {formatCurrency(order.pricing?.total || 0)}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <button className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-neutral-100">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">Top Products</h3>
          </div>
          
          <div className="p-6">
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-neutral-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 text-sm">
                        {product.productInfo?.title || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {product.totalQuantity} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-900">
                        {formatCurrency(product.totalRevenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={48} className="text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No product data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      {categoryPerformance.length > 0 && (
        <div className="bg-white rounded-lg border border-neutral-100">
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900">Category Performance</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPerformance.map((category) => (
                <div key={category._id} className="p-4 border border-neutral-100 rounded-lg">
                  <h4 className="font-medium text-neutral-900 mb-2">{category.name}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Revenue</span>
                      <span className="font-medium">{formatCurrency(category.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Orders</span>
                      <span className="font-medium">{category.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
