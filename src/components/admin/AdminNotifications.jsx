import { useState, useEffect } from 'react';
import { 
  Bell, 
  Package, 
  User, 
  FileText, 
  ShoppingCart, 
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Filter,
  Search,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation
} from '../../store/api/notificationApiSlice';

const AdminNotifications = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // API hooks
  const { 
    data: notificationData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetNotificationsQuery({ 
    filter, 
    search: searchTerm, 
    page, 
    limit: 20 
  });

  const { data: statsData } = useGetNotificationStatsQuery();
  
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationData?.data?.notifications || [];
  const unreadCount = notificationData?.data?.unreadCount || 0;
  const pagination = notificationData?.data?.pagination || {};

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quote_request':
        return <FileText size={20} className="text-orange-600" />;
      case 'new_order':
        return <ShoppingCart size={20} className="text-green-600" />;
      case 'b2b_registration':
        return <User size={20} className="text-blue-600" />;
      case 'low_stock':
        return <AlertCircle size={20} className="text-red-600" />;
      case 'payment_received':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={24} className="text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">Notifications</h2>
            <p className="text-sm text-neutral-500">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Mark all as read
          </Button>
        )}
        
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin mr-1" />
          ) : (
            <RefreshCw size={16} className="mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-neutral-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="quote_request">Quote Requests</option>
            <option value="new_order">New Orders</option>
            <option value="b2b_registration">B2B Registrations</option>
            <option value="low_stock">Stock Alerts</option>
            <option value="payment_received">Payments</option>
          </select>
        </div>
        
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 size={48} className="text-neutral-400 mx-auto mb-4 animate-spin" />
            <p className="text-neutral-500">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-red-500 mb-2">Error loading notifications</p>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              Try Again
            </Button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={48} className="text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-l-4 bg-white border border-neutral-200 rounded-lg p-4 transition-all hover:shadow-md ${
                getPriorityColor(notification.priority)
              } ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium ${!notification.isRead ? 'text-neutral-900' : 'text-neutral-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        <span>By: {notification.user}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Action buttons based on notification type */}
                  {notification.type === 'quote_request' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Quote
                      </Button>
                      <Button size="sm" variant="outline">
                        Send Response
                      </Button>
                    </div>
                  )}
                  
                  {notification.type === 'b2b_registration' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Review Details
                      </Button>
                    </div>
                  )}
                  
                  {notification.type === 'low_stock' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                        Update Stock
                      </Button>
                      <Button size="sm" variant="outline">
                        View Product
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Pagination */}
        {pagination.total > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-600">
              Page {pagination.current} of {pagination.total}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.total}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
