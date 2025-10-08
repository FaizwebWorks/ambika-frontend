import {
    AlertCircle,
    Bell,
    Building,
    CreditCard,
    Database,
    Key,
    Mail,
    RefreshCw,
    Save,
    Settings,
    Shield,
    Truck,
    Upload,
    User
} from 'lucide-react';
import { useState } from 'react';
import {
    useCancelSubscriptionMutation,
    useCreateSubscriptionOrderMutation,
    useGetCurrentSubscriptionQuery,
    useGetPaymentHistoryQuery,
    useGetSubscriptionPlansQuery,
    useVerifyPaymentMutation,
} from '../../store/api/paymentApiSlice';
import {
    useGetAdminProfileQuery,
    useGetSettingsQuery,
    useResetSettingsMutation,
    useUpdateAdminProfileMutation,
    useUpdateBusinessSettingsMutation,
    useUpdateGeneralSettingsMutation,
    useUpdateNotificationSettingsMutation,
    useUpdateSecuritySettingsMutation,
    useUploadCompanyLogoMutation
} from '../../store/api/settingsApiSlice';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({});
  const [profileData, setProfileData] = useState({});

  // API hooks
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useGetSettingsQuery();
  const { data: adminProfile, isLoading: profileLoading } = useGetAdminProfileQuery();
  const { data: subscriptionPlans } = useGetSubscriptionPlansQuery();
  const { data: currentSubscription, refetch: refetchSubscription } = useGetCurrentSubscriptionQuery();
  const { data: paymentHistory } = useGetPaymentHistoryQuery();
  
  const [updateGeneralSettings, { isLoading: updatingGeneral }] = useUpdateGeneralSettingsMutation();
  const [updateNotificationSettings, { isLoading: updatingNotifications }] = useUpdateNotificationSettingsMutation();
  const [updateSecuritySettings, { isLoading: updatingSecurity }] = useUpdateSecuritySettingsMutation();
  const [updateBusinessSettings, { isLoading: updatingBusiness }] = useUpdateBusinessSettingsMutation();
  const [updateAdminProfile, { isLoading: updatingProfile }] = useUpdateAdminProfileMutation();
  const [uploadCompanyLogo, { isLoading: uploadingLogo }] = useUploadCompanyLogoMutation();
  const [resetSettings, { isLoading: resetting }] = useResetSettingsMutation();
  const [createSubscriptionOrder, { isLoading: creatingOrder }] = useCreateSubscriptionOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [cancelSubscription, { isLoading: cancelling }] = useCancelSubscriptionMutation();

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'subscription', name: 'Subscription', icon: CreditCard },
  ];

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle profile input changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('logo', file);

    try {
      await uploadCompanyLogo(formDataObj).unwrap();
      alert('Company logo uploaded successfully!');
    } catch (error) {
      alert(`Error uploading logo: ${error.data?.message || error.message}`);
    }
  };

  // Save settings based on active tab
  const handleSave = async () => {
    try {
      switch (activeTab) {
        case 'general':
          if (formData.company) {
            await updateGeneralSettings({ company: formData.company }).unwrap();
            alert('General settings updated successfully!');
          }
          break;
        case 'profile':
          if (Object.keys(profileData).length > 0) {
            await updateAdminProfile(profileData).unwrap();
            alert('Profile updated successfully!');
            setProfileData({});
          }
          break;
        case 'notifications':
          if (formData.notifications) {
            await updateNotificationSettings({ notifications: formData.notifications }).unwrap();
            alert('Notification settings updated successfully!');
          }
          break;
        case 'security':
          if (formData.security) {
            await updateSecuritySettings({ security: formData.security }).unwrap();
            alert('Security settings updated successfully!');
          }
          break;
        case 'business':
          if (formData.business) {
            await updateBusinessSettings({ business: formData.business }).unwrap();
            alert('Business settings updated successfully!');
          }
          break;
      }
      setFormData({});
    } catch (error) {
      alert(`Error updating settings: ${error.data?.message || error.message}`);
    }
  };

  // Handle subscription purchase
  // const handleSubscriptionPurchase = async (planType) => {
  //   try {
  //     const orderResponse = await createSubscriptionOrder({ planType }).unwrap();
      
  //     const options = {
  //       key: orderResponse.data.razorpayKeyId,
  //       amount: orderResponse.data.amount,
  //       currency: orderResponse.data.currency,
  //       name: "Ambika International",
  //       description: `${subscriptionPlans.data[planType].name} Subscription`,
  //       order_id: orderResponse.data.orderId,
  //       handler: async function (response) {
  //         try {
  //           await verifyPayment({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //           }).unwrap();
            
  //           alert('Payment successful! Your subscription is now active.');
  //           refetchSubscription();
  //         } catch (error) {
  //           alert(`Payment verification failed: ${error.data?.message || error.message}`);
  //         }
  //       },
  //       prefill: {
  //         name: adminProfile?.data?.name || adminProfile?.data?.username,
  //         email: adminProfile?.data?.email,
  //         contact: adminProfile?.data?.phone,
  //       },
  //       theme: {
  //         color: "#2563eb",
  //       },
  //     };
      
  //     const rzp1 = new window.Razorpay(options);
  //     rzp1.open();
      
  //   } catch (error) {
  //     alert(`Error creating order: ${error.data?.message || error.message}`);
  //   }
  // };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to admin features when it expires.')) {
      try {
        await cancelSubscription().unwrap();
        alert('Subscription cancelled successfully. You can still access features until your current period ends.');
        refetchSubscription();
      } catch (error) {
        alert(`Error cancelling subscription: ${error.data?.message || error.message}`);
      }
    }
  };

  // Reset all settings
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        await resetSettings().unwrap();
        alert('Settings reset to default successfully!');
        setFormData({});
      } catch (error) {
        alert(`Error resetting settings: ${error.data?.message || error.message}`);
      }
    }
  };

  if (settingsLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (settingsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">Error loading settings: {settingsError.data?.message || settingsError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
          <p className="text-neutral-600 mt-1">Manage your account and application preferences</p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={resetting ? 'animate-spin' : ''} />
          Reset to Default
        </button>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-lg border border-neutral-100">
        <div className="border-b border-neutral-100 px-6 py-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 whitespace-nowrap pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && settings && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">General Settings</h3>
                
                {/* Company Logo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {settings.data?.company?.logo && (
                      <img 
                        src={settings.data.company.logo} 
                        alt="Company Logo"
                        className="w-16 h-16 object-contain rounded-lg border border-neutral-200"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${uploadingLogo ? 'opacity-50' : ''}`}
                      >
                        <Upload size={16} />
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </label>
                      <p className="text-sm text-neutral-600 mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue={settings.data?.company?.name || ''}
                      onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      defaultValue={settings.data?.company?.website || ''}
                      onChange={(e) => handleInputChange('company', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue={settings.data?.company?.email || ''}
                      onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={settings.data?.company?.phone || ''}
                      onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    rows="4"
                    defaultValue={settings.data?.company?.description || ''}
                    onChange={(e) => handleInputChange('company', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && adminProfile && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Profile Settings</h3>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{adminProfile.data?.name || adminProfile.data?.username}</p>
                    <p className="text-sm text-neutral-600">{adminProfile.data?.email}</p>
                    <p className="text-xs text-blue-600 font-medium uppercase">{adminProfile.data?.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      defaultValue={adminProfile.data?.username || ''}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={adminProfile.data?.name || ''}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={adminProfile.data?.email || ''}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={adminProfile.data?.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && settings && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail size={20} className="text-neutral-600" />
                      <div>
                        <p className="font-medium text-neutral-900">Email Notifications</p>
                        <p className="text-sm text-neutral-600">Receive email alerts for important events</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={settings.data?.notifications?.emailNotifications ?? true}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell size={20} className="text-neutral-600" />
                      <div>
                        <p className="font-medium text-neutral-900">Push Notifications</p>
                        <p className="text-sm text-neutral-600">Get instant notifications in browser</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={settings.data?.notifications?.pushNotifications ?? true}
                        onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Truck size={20} className="text-neutral-600" />
                      <div>
                        <p className="font-medium text-neutral-900">Order Updates</p>
                        <p className="text-sm text-neutral-600">Get notified about new orders and status changes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={settings.data?.notifications?.orderUpdates ?? true}
                        onChange={(e) => handleInputChange('notifications', 'orderUpdates', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database size={20} className="text-neutral-600" />
                      <div>
                        <p className="font-medium text-neutral-900">System Updates</p>
                        <p className="text-sm text-neutral-600">Be informed about system maintenance and updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={settings.data?.notifications?.systemUpdates ?? false}
                        onChange={(e) => handleInputChange('notifications', 'systemUpdates', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && settings && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Key size={20} className="text-neutral-600" />
                        <div>
                          <p className="font-medium text-neutral-900">Change Password</p>
                          <p className="text-sm text-neutral-600">Update your account password</p>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-neutral-600" />
                        <div>
                          <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                          <p className="text-sm text-neutral-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={settings.data?.security?.twoFactorAuth ?? false}
                          onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue={settings.data?.security?.sessionTimeout || 60}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        defaultValue={settings.data?.security?.loginAttempts || 5}
                        onChange={(e) => handleInputChange('security', 'loginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === 'business' && settings && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Business Settings</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tax Rate removed globally (GST set to 0). Keeping hidden to avoid confusion. */}
                  <div className="opacity-60 pointer-events-none hidden">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={0}
                      readOnly
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Shipping Charges (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={settings.data?.business?.shippingCharges || 100}
                      onChange={(e) => handleInputChange('business', 'shippingCharges', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={settings.data?.business?.freeShippingThreshold || 2000}
                      onChange={(e) => handleInputChange('business', 'freeShippingThreshold', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Minimum Order Value (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={settings.data?.business?.minimumOrderValue || 500}
                      onChange={(e) => handleInputChange('business', 'minimumOrderValue', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Business Information</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Currency:</span>
                      <span className="ml-2 font-medium">{settings.data?.system?.currency || 'INR'}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Timezone:</span>
                      <span className="ml-2 font-medium">{settings.data?.system?.timezone || 'Asia/Kolkata'}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Last Updated:</span>
                      <span className="ml-2 font-medium">
                        {settings.data?.updatedAt ? new Date(settings.data.updatedAt).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Updated By:</span>
                      <span className="ml-2 font-medium">
                        {settings.data?.lastUpdatedBy?.username || 'System'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Settings */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Subscription & Billing</h3>
                
                {/* Current Subscription Status */}
                {currentSubscription?.data && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Current Subscription</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Plan:</span>
                        <span className="ml-2 font-medium">{currentSubscription.data.planDetails.name}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Status:</span>
                        <span className={`ml-2 font-medium ${
                          currentSubscription.data.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {currentSubscription.data.status.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">End Date:</span>
                        <span className="ml-2 font-medium">
                          {new Date(currentSubscription.data.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Days Remaining:</span>
                        <span className={`ml-2 font-medium ${
                          currentSubscription.data.daysRemaining <= 3 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {currentSubscription.data.daysRemaining} days
                        </span>
                      </div>
                    </div>
                    
                    {currentSubscription.data.isExpiringSoon && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Your subscription is expiring soon. Renew now to avoid interruption.
                        </p>
                      </div>
                    )}
                    
                    {currentSubscription.data.status === 'active' && (
                      <div className="mt-4">
                        <button
                          onClick={handleCancelSubscription}
                          disabled={cancelling}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* No Active Subscription Message */}
                {!currentSubscription?.data && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">No Active Subscription</h4>
                    <p className="text-yellow-800 text-sm">
                      You need an active subscription to continue using the admin dashboard. Please choose a plan below.
                    </p>
                  </div>
                )}

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {subscriptionPlans?.data && Object.entries(subscriptionPlans.data).map(([planKey, plan]) => (
                    <div key={planKey} className={`p-6 border rounded-lg relative ${
                      planKey === 'professional' ? 'border-blue-500 bg-blue-50' : 'border-neutral-200'
                    }`}>
                      {planKey === 'professional' && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            RECOMMENDED
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-neutral-900">{plan.name}</h4>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-neutral-900">₹{plan.price}</span>
                          <span className="text-neutral-600">/month</span>
                        </div>
                      </div>
                      
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-neutral-700">
                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={() => handleSubscriptionPurchase(planKey)}
                        disabled={creatingOrder || (currentSubscription?.data?.planDetails?.name === plan.name)}
                        className={`w-full mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${
                          currentSubscription?.data?.planDetails?.name === plan.name
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : planKey === 'professional'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-neutral-600 text-white hover:bg-neutral-700'
                        } disabled:opacity-50`}
                      >
                        {currentSubscription?.data?.planDetails?.name === plan.name ? 'Current Plan' : 
                         creatingOrder ? 'Processing...' : 'Subscribe Now'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Payment History */}
                {paymentHistory?.data && paymentHistory.data.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-neutral-900 mb-4">Payment History</h4>
                    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Plan</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {paymentHistory.data.slice(0, 5).map((payment, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-neutral-900">
                                {new Date(payment.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-neutral-900">{payment.plan}</td>
                              <td className="px-4 py-3 text-sm text-neutral-900">₹{payment.amount}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  payment.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-neutral-100">
            <button 
              onClick={handleSave}
              disabled={updatingGeneral || updatingNotifications || updatingSecurity || updatingBusiness || updatingProfile}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {(updatingGeneral || updatingNotifications || updatingSecurity || updatingBusiness || updatingProfile) ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
