import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Heart,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Shield,
  Truck,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useGetQuoteRequestsQuery,
  useGetUserOrdersQuery,
  useGetWishlistQuery,
  useUpdateProfileMutation
} from '../store/api/authApiSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const { data: profileData, isLoading: profileLoading, refetch } = useGetProfileQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrdersQuery({ page: 1, limit: 10 });
  const { data: wishlistData, isLoading: wishlistLoading } = useGetWishlistQuery();
  const { data: quotesData, isLoading: quotesLoading } = useGetQuoteRequestsQuery();
  
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profileData?.user) {
      setFormData({
        name: profileData.user.name || '',
        email: profileData.user.email || '',
        phone: profileData.user.phone || '',
        address: profileData.user.address || '',
        username: profileData.user.username || ''
      });
    }
  }, [profileData]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
      refetch();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'quotes', name: 'Quote Requests', icon: FileText },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'pending':
      case 'processing':
        return 'text-yellow-700 bg-yellow-100';
      case 'cancelled':
      case 'rejected':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'approved':
        return CheckCircle;
      case 'pending':
      case 'processing':
        return Clock;
      case 'cancelled':
      case 'rejected':
        return AlertCircle;
      default:
        return Package;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Lock size={64} className="text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Access Denied</h2>
          <p className="text-neutral-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Account</h1>
          <p className="text-neutral-600">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    {profileData?.user?.name || profileData?.user?.username || 'User'}
                  </h3>
                  <p className="text-sm text-neutral-600 truncate md:max-w-[150px]" title={profileData?.user?.email}>
                    {profileData?.user?.email}
                  </p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(`/profile?tab=${tab.id}`, { replace: true })}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900">Profile Information</h2>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={updating}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Save size={16} />
                        {updating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          if (profileData?.data) {
                            setFormData({
                              name: profileData.data.name || '',
                              email: profileData.data.email || '',
                              phone: profileData.data.phone || '',
                              address: profileData.data.address || '',
                              username: profileData.data.username || ''
                            });
                          }
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="p-3 bg-neutral-50 rounded-lg text-neutral-900">
                        {profileData?.user?.name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Username
                    </label>
                    <p className="p-3 bg-neutral-50 rounded-lg text-neutral-900">
                      {profileData?.user?.username}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <p className="p-3 bg-neutral-50 rounded-lg text-neutral-900 truncate" title={profileData?.user?.email}>
                      {profileData?.user?.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="p-3 bg-neutral-50 rounded-lg text-neutral-900">
                        {profileData?.user?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <MapPin size={16} className="inline mr-2" />
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="p-3 bg-neutral-50 rounded-lg text-neutral-900">
                        {profileData?.user?.address || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Details */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Account Type</p>
                      <p className="font-medium text-neutral-900">
                        {profileData?.user?.customerType || 'B2C'}
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Member Since</p>
                      <p className="font-medium text-neutral-900">
                        {profileData?.user?.createdAt 
                          ? new Date(profileData.user.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profileData?.user?.approvalStatus)}`}>
                        <CheckCircle size={12} />
                        {profileData?.user?.approvalStatus?.charAt(0).toUpperCase() + profileData?.user?.approvalStatus?.slice(1) || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">My Orders</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : ordersData?.data?.orders?.length > 0 ? (
                  <div className="space-y-4">
                    {ordersData.data.orders.map((order) => (
                      <div key={order._id} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-neutral-900">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-neutral-900">
                              ₹{order.pricing.total.toLocaleString('en-IN')}
                            </p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {(() => {
                                const StatusIcon = getStatusIcon(order.status);
                                return <StatusIcon size={12} />;
                              })()}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-neutral-600">
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            {order.items?.length} item(s)
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard size={14} />
                            {order.payment?.method?.toUpperCase()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck size={14} />
                            {order.shipping?.method || 'Standard'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package size={48} className="text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Orders Yet</h3>
                    <p className="text-neutral-600">Start shopping to see your orders here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">My Wishlist</h2>
                
                {wishlistLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading wishlist...</p>
                  </div>
                ) : wishlistData?.data?.items?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistData.data.items.map((item) => (
                      <div 
                        key={item._id} 
                        className="border border-neutral-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        onClick={() => navigate(`/product/${item.product?._id}`)}
                      >
                        <img
                          src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product?.title || item.product?.name}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold text-neutral-900 mb-2">
                          {item.product?.title || item.product?.name}
                        </h3>
                        <p className="text-blue-600 font-bold">
                          ₹{(item.product?.discountPrice || item.product?.price)?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Items in Wishlist</h3>
                    <p className="text-neutral-600">Save items you love to see them here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Quote Requests Tab */}
            {activeTab === 'quotes' && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Quote Requests</h2>
                
                {quotesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading quotes...</p>
                  </div>
                ) : quotesData?.data?.quotes?.length > 0 ? (
                  <div className="space-y-4">
                    {quotesData.data.quotes.map((quote) => (
                      <div key={quote._id} className="border border-neutral-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-neutral-900">
                            Quote #{quote._id.slice(-6)}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                            {(() => {
                              const StatusIcon = getStatusIcon(quote.status);
                              return <StatusIcon size={12} />;
                            })()}
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-2">{quote.message}</p>
                        <p className="text-sm text-neutral-500">
                          Requested on {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText size={48} className="text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Quote Requests</h3>
                    <p className="text-neutral-600">Your quote requests will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900">Password</h3>
                        <p className="text-sm text-neutral-600">Keep your account secure with a strong password</p>
                      </div>
                      <Button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Lock size={16} />
                        Change Password
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-neutral-200">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full p-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full p-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="w-full p-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleChangePassword}
                            disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {changingPassword ? 'Changing...' : 'Update Password'}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            }}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Security */}
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <h3 className="font-semibold text-neutral-900 mb-2">Account Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Email Verification</span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Last Login</span>
                        <span className="text-neutral-900">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;