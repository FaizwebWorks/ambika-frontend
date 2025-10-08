import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  Truck,
  XCircle
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation
} from '../../store/api/adminApiSlice';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // API calls
  const { 
    data: ordersData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAdminOrdersQuery({
    page: currentPage,
    limit: 10,
    search: searchTerm,
    status: filterStatus === 'all' ? '' : filterStatus,
    dateRange
  });

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination || {};

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
      setOpenDropdown(null); // Close dropdown after update
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update order status');
    }
  };

  // Toggle dropdown
  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  // Check if dropdown should be positioned upward to avoid viewport cutoff
  const getDropdownPosition = (element) => {
    if (!element) return 'bottom';
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown
    
    // If there's not enough space below, position above
    if (rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight) {
      return 'top';
    }
    return 'bottom';
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

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
          color: 'bg-gray-100 text-gray-800', 
          icon: <AlertTriangle size={14} />
        };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
            <p className="text-neutral-600 mt-1">Manage all customer orders</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-neutral-600">Loading orders...</p>
            </div>
          </div>
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
            <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
            <p className="text-neutral-600 mt-1">Manage all customer orders</p>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-600">{error.data?.message || 'Failed to load orders. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600 mt-1">Manage all customer orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={refetch}
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

      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-neutral-500" />
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="appearance-none bg-white pl-3 pr-8 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none cursor-pointer min-w-[120px]"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Date Range */}
          <div className="relative z-50">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white pl-3 pr-8 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none cursor-pointer min-w-[140px]"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-100 overflow-visible">
        {/* Mobile View */}
        <div className="lg:hidden">
          {orders.length > 0 ? (
            <div className="divide-y divide-neutral-200">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div key={order._id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-neutral-900">
                        #{order.orderNumber || order._id.slice(-8)}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-500">Customer:</span>
                        <div className="font-medium text-neutral-900">
                          {order.customerInfo?.name || order.customer?.name || 'Unknown'}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Total:</span>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(order.pricing?.total || 0)}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Items:</span>
                        <div className="font-medium text-neutral-900">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500">Date:</span>
                        <div className="font-medium text-neutral-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <div className="text-xs text-neutral-500">
                        {order.payment?.method || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded"
                          title="View Details"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <div className="relative" ref={openDropdown === order._id ? dropdownRef : null}>
                          <button 
                            onClick={() => toggleDropdown(order._id)}
                            className="text-neutral-600 hover:text-neutral-800 transition-colors p-2 hover:bg-neutral-50 rounded"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          
                          {openDropdown === order._id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-neutral-200 shadow-xl z-50 min-w-max">
                              <div className="py-2">
                                <div className="px-3 py-2 text-xs font-medium text-neutral-500 border-b border-neutral-100">
                                  Update Status
                                </div>
                                {statuses.filter(s => s !== 'all' && s !== order.status).map(status => {
                                  const statusConfig = getStatusConfig(status);
                                  return (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusUpdate(order._id, status)}
                                      disabled={isUpdating}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                                    >
                                      {statusConfig.icon}
                                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                    </button>
                                  );
                                })}
                                
                                <div className="border-t border-neutral-100 mt-1 pt-1">
                                  <button
                                    onClick={() => {
                                      // Handle download invoice
                                      setOpenDropdown(null);
                                      toast.success('Invoice download started');
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                  >
                                    <Download size={14} />
                                    <span>Download Invoice</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package size={48} className="text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600">No orders found</p>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">{orders.length > 0 ? orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          #{order.orderNumber || order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {order.payment?.method || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {order.customerInfo?.name || order.customer?.name || 'Unknown Customer'}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {order.customerInfo?.email || order.customer?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        {formatCurrency(order.pricing?.total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                            title="View Order Details"
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order._id}`); }}
                          >
                            <Eye size={16} />
                          </button>
                          
                          <div className="relative" ref={openDropdown === order._id ? dropdownRef : null}>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleDropdown(order._id); }}
                              className="text-neutral-600 hover:text-neutral-800 transition-colors p-1 hover:bg-neutral-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                              title="More Actions"
                              aria-haspopup="true"
                              aria-expanded={openDropdown === order._id}
                            >
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Open order actions menu</span>
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openDropdown === order._id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-neutral-200 shadow-xl z-[9999] min-w-max transform translate-y-0">
                                <div className="py-2">
                                  <div className="px-3 py-2 text-xs font-medium text-neutral-500 border-b border-neutral-100">
                                    Update Status
                                  </div>
                                  {statuses.filter(s => s !== 'all' && s !== order.status).map(status => {
                                    const statusConfig = getStatusConfig(status);
                                    return (
                                      <button
                                        key={status}
                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id, status); }}
                                        disabled={isUpdating}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                        role="menuitem"
                                      >
                                        {statusConfig.icon}
                                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                      </button>
                                    );
                                  })}
                                  
                                  <div className="border-t border-neutral-100 mt-1 pt-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(null);
                                        toast.success('Invoice download started');
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                                      role="menuitem"
                                    >
                                      <Download size={14} />
                                      <span>Download Invoice</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Package size={48} className="text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 text-sm border border-neutral-200 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 text-sm border border-neutral-200 rounded-md hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
