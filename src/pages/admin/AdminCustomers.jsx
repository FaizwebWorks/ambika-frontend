import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Mail,
  Phone,
  Building,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Shield,
  AlertTriangle,
  User,
  X
} from 'lucide-react';
import { 
  useGetAdminCustomersQuery,
  useGetCustomerByIdQuery,
  useApproveCustomerMutation,
  useRejectCustomerMutation
} from '../../store/api/adminApiSlice';
import { selectCurrentUser, selectCurrentToken, selectIsAuthenticated } from '../../store/slices/authSlice';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Auth state
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks - only call if authenticated and admin
  const { 
    data: customersData, 
    isLoading, 
    error,
    refetch 
  } = useGetAdminCustomersQuery({
    page: currentPage,
    limit,
    search: debouncedSearchTerm,
    sort: sortBy,
    order: 'desc'
  }, {
    skip: !isAuthenticated || !isAdmin || !token // Skip API call if not authenticated or not admin
  });

  const [approveCustomer] = useApproveCustomerMutation();
  const [rejectCustomer] = useRejectCustomerMutation();

  // Extract data from API response
  const customers = customersData?.data?.customers || [];
  const pagination = customersData?.data?.pagination || {};

  // Convert API data format to component format
  const transformedCustomers = customers.map(customer => ({
    id: customer._id,
    name: customer.name || customer.username,
    email: customer.email,
    phone: customer.phone || 'Not provided',
    company: customer.businessDetails?.companyName || null,
    companyType: customer.businessDetails?.businessType || null,
    customerType: customer.customerType,
    location: customer.address || 'Not specified',
    totalOrders: customer.stats?.totalOrders || 0,
    totalSpent: customer.stats?.totalSpent || 0,
    lastOrder: customer.stats?.lastOrderDate,
    joinedAt: customer.createdAt,
    status: customer.stats?.totalOrders > 0 ? 'active' : 'inactive',
    approvalStatus: customer.approvalStatus,
    avatar: customer.name ? customer.name.split(' ').map(n => n[0]).join('').toUpperCase() : customer.username?.substring(0, 2).toUpperCase(),
    gstNumber: customer.businessDetails?.gstNumber,
    businessAddress: customer.businessDetails?.businessAddress,
    annualRequirement: customer.businessDetails?.annualRequirement
  }));

  const companyTypes = ['all', 'Hotel', 'Resort', 'Inn', 'Restaurant'];
  const statuses = ['all', 'active', 'inactive'];
  const customerTypes = ['all', 'B2B', 'B2C'];
  const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'B2B': return 'bg-blue-100 text-blue-800';
      case 'B2C': return 'bg-purple-100 text-purple-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle customer approval/rejection
  const handleApprovalAction = async (customerId, action) => {
    try {
      if (action === 'approve') {
        await approveCustomer(customerId).unwrap();
        alert('Customer approved successfully!');
      } else {
        const reason = prompt('Please provide a reason for rejection (optional):');
        await rejectCustomer({ customerId, reason }).unwrap();
        alert('Customer rejected successfully!');
      }
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Approval action error:', error);
      alert(`Error ${action === 'approve' ? 'approving' : 'rejecting'} customer: ${error.data?.message || error.message}`);
    }
  };

  // Open customer details modal
  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  // Close customer details modal
  const closeCustomerDetails = () => {
    setSelectedCustomer(null);
    setShowDetailsModal(false);
  };

  // Filter customers by type
  const filteredCustomers = transformedCustomers.filter(customer => {
    const matchesType = filterType === 'all' || customer.companyType === filterType;
    return matchesType;
  });

  // Sort customers (API handles sorting, but keep for local display)
  const sortedCustomers = [...filteredCustomers];

  // Calculate summary stats from transformed data
  const totalCustomers = transformedCustomers.length;
  const b2bCustomers = transformedCustomers.filter(customer => customer.customerType === 'B2B').length;
  const pendingApprovals = transformedCustomers.filter(customer => customer.approvalStatus === 'pending').length;
  const averageOrderValue = transformedCustomers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0) / 
                           Math.max(transformedCustomers.reduce((sum, customer) => sum + (customer.totalOrders || 0), 0), 1);

  // Loading and error states
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Authentication Required</h2>
          <p className="text-neutral-600 mb-4">Please log in to access the admin panel.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Error Loading Customers</h2>
          <p className="text-red-600 mb-4">{error.data?.message || error.message || 'Failed to load customers'}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Customers</h1>
          <p className="text-neutral-600 mt-1">Manage your customer relationships and data</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
          >
            <option value="recent">Sort by Recent</option>
            <option value="name">Sort by Name</option>
            <option value="spending">Sort by Spending</option>
            <option value="orders">Sort by Orders</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Customers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">B2B Customers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{b2bCustomers}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Building size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Pending Approvals</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{pendingApprovals}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          {pendingApprovals > 0 && (
            <div className="mt-2">
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                Requires Action
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-neutral-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Average Order Value</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">₹{Math.round(averageOrderValue).toLocaleString('en-IN')}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingBag size={24} className="text-purple-600" />
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
                placeholder="Search customers, companies, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Company Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
          >
            {companyTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <Filter size={20} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg border border-neutral-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{customer.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{customer.name}</h3>
                  <p className="text-sm text-neutral-600">
                    {customer.customerType === 'B2B' ? customer.company : 'Individual Customer'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(customer.customerType)}`}>
                      {customer.customerType}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                    {customer.customerType === 'B2B' && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(customer.approvalStatus)}`}>
                        {customer.approvalStatus.charAt(0).toUpperCase() + customer.approvalStatus.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => openCustomerDetails(customer)}
                  className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button className="p-1.5 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-neutral-600">
                <Mail size={16} className="mr-2" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Phone size={16} className="mr-2" />
                {customer.phone}
              </div>
              {customer.customerType === 'B2B' && (
                <div className="flex items-center text-sm text-neutral-600">
                  <Building size={16} className="mr-2" />
                  {customer.companyType} • {customer.location}
                </div>
              )}
              <div className="flex items-center text-sm text-neutral-600">
                <Calendar size={16} className="mr-2" />
                Joined {formatDate(customer.joinedAt)}
              </div>
            </div>

            {/* B2B Approval Actions */}
            {customer.customerType === 'B2B' && customer.approvalStatus === 'pending' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Pending Approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovalAction(customer.id, 'approve')}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprovalAction(customer.id, 'reject')}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-neutral-100 mt-4 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-neutral-900">{customer.totalOrders}</p>
                  <p className="text-xs text-neutral-600">Orders</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-neutral-900">₹{Math.round(customer.totalSpent / 1000)}K</p>
                  <p className="text-xs text-neutral-600">Total Spent</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-neutral-900">₹{customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders / 1000) : 0}K</p>
                  <p className="text-xs text-neutral-600">Avg Order</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100">
              <p className="text-xs text-neutral-500">
                Last order: {customer.lastOrder ? formatDate(customer.lastOrder) : 'No orders yet'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sortedCustomers.length === 0 && (
        <div className="bg-white rounded-lg border border-neutral-100 p-12 text-center">
          <Users size={48} className="text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No customers found</h3>
          <p className="text-neutral-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {sortedCustomers.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing {sortedCustomers.length} of {pagination.total || 0} customers
          </p>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: pagination.pages || 1 }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages || 1))}
              disabled={!pagination.hasNext}
              className="px-3 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-neutral-900">Customer Details</h2>
              <button 
                onClick={closeCustomerDetails}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <User size={20} />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Name</label>
                        <p className="text-neutral-900">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Email</label>
                        <p className="text-neutral-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Phone</label>
                        <p className="text-neutral-900">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Customer Type</label>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(selectedCustomer.customerType)}`}>
                            {selectedCustomer.customerType}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                            {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Joined Date</label>
                        <p className="text-neutral-900">{formatDate(selectedCustomer.joinedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B2B Business Details */}
                {selectedCustomer.customerType === 'B2B' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                        <Building size={20} />
                        Business Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Company Name</label>
                          <p className="text-neutral-900">{selectedCustomer.company}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Business Type</label>
                          <p className="text-neutral-900">{selectedCustomer.companyType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">GST Number</label>
                          <p className="text-neutral-900">{selectedCustomer.gstNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Business Address</label>
                          <p className="text-neutral-900">{selectedCustomer.businessAddress || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Location</label>
                          <p className="text-neutral-900">{selectedCustomer.location}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700">Annual Requirement</label>
                          <p className="text-neutral-900">{selectedCustomer.annualRequirement || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* B2B Approval Status */}
              {selectedCustomer.customerType === 'B2B' && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Shield size={20} />
                    Approval Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedCustomer.approvalStatus === 'pending' && <Clock size={20} className="text-yellow-600" />}
                      {selectedCustomer.approvalStatus === 'approved' && <CheckCircle size={20} className="text-green-600" />}
                      {selectedCustomer.approvalStatus === 'rejected' && <XCircle size={20} className="text-red-600" />}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getApprovalStatusColor(selectedCustomer.approvalStatus)}`}>
                        {selectedCustomer.approvalStatus.charAt(0).toUpperCase() + selectedCustomer.approvalStatus.slice(1)}
                      </span>
                      {selectedCustomer.approvalStatus === 'pending' && (
                        <span className="text-sm text-neutral-600">• Requires approval to access B2B pricing</span>
                      )}
                    </div>
                    {selectedCustomer.approvalStatus === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprovalAction(selectedCustomer.id, 'approve')}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApprovalAction(selectedCustomer.id, 'reject')}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Statistics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <FileText size={20} />
                  Order Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-blue-700">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹{Math.round(selectedCustomer.totalSpent / 1000)}K</p>
                    <p className="text-sm text-green-700">Total Spent</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">₹{selectedCustomer.totalOrders > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders / 1000) : 0}K</p>
                    <p className="text-sm text-purple-700">Avg Order Value</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{selectedCustomer.lastOrder ? formatDate(selectedCustomer.lastOrder) : 'None'}</p>
                    <p className="text-sm text-orange-700">Last Order</p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Admin Notes</h3>
                <textarea
                  placeholder="Add internal notes about this customer..."
                  className="w-full p-3 border border-neutral-300 rounded-lg resize-none"
                  rows="4"
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
