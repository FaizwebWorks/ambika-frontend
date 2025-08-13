import { useState } from 'react';
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
  ShoppingBag
} from 'lucide-react';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock customers data
  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@hotel.com',
      phone: '+91 98765 43210',
      company: 'Hotel Paradise',
      companyType: 'Hotel',
      location: 'Mumbai, Maharashtra',
      totalOrders: 24,
      totalSpent: 125400,
      lastOrder: '2024-01-20T10:30:00Z',
      joinedAt: '2023-06-15T08:00:00Z',
      status: 'active',
      avatar: 'RK'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@resort.com',
      phone: '+91 87654 32109',
      company: 'Beach Resort',
      companyType: 'Resort',
      location: 'Goa',
      totalOrders: 18,
      totalSpent: 89750,
      lastOrder: '2024-01-18T14:20:00Z',
      joinedAt: '2023-08-22T10:15:00Z',
      status: 'active',
      avatar: 'PS'
    },
    {
      id: 3,
      name: 'Hotel Manager',
      email: 'orders@paradise.com',
      phone: '+91 76543 21098',
      company: 'Paradise Hotel',
      companyType: 'Hotel',
      location: 'Delhi',
      totalOrders: 45,
      totalSpent: 256800,
      lastOrder: '2024-01-19T16:45:00Z',
      joinedAt: '2023-03-10T12:30:00Z',
      status: 'active',
      avatar: 'HM'
    },
    {
      id: 4,
      name: 'Grand Plaza Admin',
      email: 'purchase@grandplaza.com',
      phone: '+91 65432 10987',
      company: 'Grand Plaza Hotel',
      companyType: 'Hotel',
      location: 'Bangalore, Karnataka',
      totalOrders: 32,
      totalSpent: 198600,
      lastOrder: '2024-01-17T11:20:00Z',
      joinedAt: '2023-05-18T09:45:00Z',
      status: 'active',
      avatar: 'GP'
    },
    {
      id: 5,
      name: 'City Inn Manager',
      email: 'admin@cityinn.com',
      phone: '+91 54321 09876',
      company: 'City Inn Hotel',
      companyType: 'Inn',
      location: 'Chennai, Tamil Nadu',
      totalOrders: 12,
      totalSpent: 45300,
      lastOrder: '2023-12-15T13:10:00Z',
      joinedAt: '2023-09-05T15:20:00Z',
      status: 'inactive',
      avatar: 'CI'
    }
  ];

  const companyTypes = ['all', 'Hotel', 'Resort', 'Inn', 'Restaurant'];
  const statuses = ['all', 'active', 'inactive'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || customer.companyType === filterType;
    
    return matchesSearch && matchesType;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastOrder) - new Date(a.lastOrder);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'spending':
        return b.totalSpent - a.totalSpent;
      case 'orders':
        return b.totalOrders - a.totalOrders;
      default:
        return 0;
    }
  });

  // Calculate summary stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(customer => customer.status === 'active').length;
  const averageOrderValue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
                           customers.reduce((sum, customer) => sum + customer.totalOrders, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm font-medium text-neutral-600">Active Customers</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">{activeCustomers}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
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
                  <p className="text-sm text-neutral-600">{customer.company}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(customer.status)}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
              <div className="flex items-center text-sm text-neutral-600">
                <Building size={16} className="mr-2" />
                {customer.companyType} • {customer.location}
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Calendar size={16} className="mr-2" />
                Joined {formatDate(customer.joinedAt)}
              </div>
            </div>

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
                  <p className="text-lg font-semibold text-neutral-900">₹{Math.round(customer.totalSpent / customer.totalOrders / 1000)}K</p>
                  <p className="text-xs text-neutral-600">Avg Order</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100">
              <p className="text-xs text-neutral-500">
                Last order: {formatDate(customer.lastOrder)}
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
            Showing {sortedCustomers.length} of {customers.length} customers
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

export default AdminCustomers;
