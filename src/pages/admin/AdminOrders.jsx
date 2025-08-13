import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  // Mock orders data
  const orders = [
    {
      id: '#12547',
      customer: {
        name: 'Rajesh Kumar',
        email: 'rajesh@hotel.com',
        company: 'Hotel Paradise'
      },
      items: 3,
      total: 12450,
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: '2024-01-20T10:30:00Z',
      deliveredAt: '2024-01-22T14:20:00Z',
      shippingAddress: 'Mumbai, Maharashtra'
    },
    {
      id: '#12546',
      customer: {
        name: 'Priya Sharma',
        email: 'priya@resort.com',
        company: 'Beach Resort'
      },
      items: 5,
      total: 8750,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-20T08:15:00Z',
      shippingAddress: 'Goa'
    },
    {
      id: '#12545',
      customer: {
        name: 'Hotel Manager',
        email: 'orders@paradise.com',
        company: 'Paradise Hotel'
      },
      items: 8,
      total: 25680,
      status: 'processing',
      paymentStatus: 'paid',
      createdAt: '2024-01-19T16:45:00Z',
      shippingAddress: 'Delhi'
    },
    {
      id: '#12544',
      customer: {
        name: 'Grand Plaza',
        email: 'purchase@grandplaza.com',
        company: 'Grand Plaza Hotel'
      },
      items: 2,
      total: 15200,
      status: 'shipped',
      paymentStatus: 'paid',
      createdAt: '2024-01-19T11:20:00Z',
      shippedAt: '2024-01-20T09:30:00Z',
      shippingAddress: 'Bangalore, Karnataka'
    },
    {
      id: '#12543',
      customer: {
        name: 'City Inn',
        email: 'admin@cityinn.com',
        company: 'City Inn Hotel'
      },
      items: 4,
      total: 9850,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-18T13:10:00Z',
      cancelledAt: '2024-01-19T10:00:00Z',
      shippingAddress: 'Chennai, Tamil Nadu'
    }
  ];

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: <CheckCircle size={14} />
        };
      case 'shipped':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: <Truck size={14} />
        };
      case 'processing':
        return { 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: <Package size={14} />
        };
      case 'pending':
        return { 
          color: 'bg-orange-100 text-orange-800', 
          icon: <Clock size={14} />
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800', 
          icon: <XCircle size={14} />
        };
      default:
        return { 
          color: 'bg-neutral-100 text-neutral-800', 
          icon: <AlertTriangle size={14} />
        };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600 mt-1">Manage and track customer orders</p>
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
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Pending Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Completed Orders</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{completedOrders}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Order</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Items</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Total</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                
                return (
                  <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-neutral-900">{order.id}</p>
                        <p className="text-sm text-neutral-500">{order.shippingAddress}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-neutral-900">{order.customer.name}</p>
                        <p className="text-sm text-neutral-500">{order.customer.email}</p>
                        <p className="text-xs text-neutral-400">{order.customer.company}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-600">{order.items} items</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-neutral-900">₹{order.total.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.icon}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-600">{formatDate(order.createdAt)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders found</h3>
            <p className="text-neutral-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              2
            </button>
            <button className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
