import {
    Building,
    CheckCircle,
    Edit2,
    Home,
    MapPin,
    MapPinIcon,
    Phone,
    Plus,
    Save,
    Trash2,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

const InlineAddressManager = ({
  addresses = [],
  selectedAddressId,
  onAddressSelect,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
  isLoading = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: 'Home',
    customName: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    isDefault: false
  });
  
  const [errors, setErrors] = useState({});

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Home size={16} className="text-blue-600" />;
      case 'Office':
        return <Building size={16} className="text-green-600" />;
      default:
        return <MapPinIcon size={16} className="text-purple-600" />;
    }
  };

  const getAddressDisplayName = (address) => {
    if (address.name === 'Other' && address.customName) {
      return address.customName;
    }
    return address.name;
  };

  const resetForm = () => {
    setFormData({
      name: 'Home',
      customName: '',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: '',
      isDefault: false
    });
    setErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setEditingAddressId(null);
    setShowAddForm(true);
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name || 'Home',
      customName: address.customName || '',
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      landmark: address.landmark || '',
      isDefault: address.isDefault || false
    });
    setEditingAddressId(address._id);
    setShowAddForm(true);
    setErrors({});
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddressId(null);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    if (formData.name === 'Other' && !formData.customName.trim()) {
      newErrors.customName = 'Custom name is required when "Other" is selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setOperationLoading(true);
    try {
      if (editingAddressId) {
        await onUpdateAddress(editingAddressId, formData);
        toast.success('Address updated successfully!');
      } else {
        await onAddAddress(formData);
        toast.success('Address added successfully!');
      }
      handleCancel();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await onDeleteAddress(addressId);
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await onSetDefault(addressId);
      toast.success('Default address updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to set default address');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Delivery Addresses
          </h3>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-neutral-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          Delivery Addresses
        </h3>
        {!showAddForm && (
          <Button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Add New
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-neutral-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h4>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Address Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Home', 'Office', 'Other'].map((type) => (
                  <label key={type} className="block">
                    <input
                      type="radio"
                      name="name"
                      value={type}
                      checked={formData.name === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                      formData.name === type
                        ? 'border-blue-500 bg-blue-50 hover:border-blue-600'
                        : 'border-neutral-200 hover:border-blue-600 bg-white'
                    }`}>
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Name (only for 'Other') */}
            {formData.name === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Custom Name *
                </label>
                <input
                  type="text"
                  name="customName"
                  value={formData.customName}
                  onChange={handleChange}
                  placeholder="e.g., Aunt's House, Friend's Place"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.customName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.customName && (
                  <p className="text-red-600 text-sm mt-1">{errors.customName}</p>
                )}
              </div>
            )}

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.fullName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.phone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Street Address *
              </label>
              <textarea
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="House/Flat no, Building name, Area"
                rows={2}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                  errors.street ? 'border-red-500' : 'border-neutral-300'
                }`}
              />
              {errors.street && (
                <p className="text-red-600 text-sm mt-1">{errors.street}</p>
              )}
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.city ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.state ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 ${
                    errors.zipCode ? 'border-red-500' : 'border-neutral-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark or reference point"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Default Address */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isDefault" className="text-sm font-medium text-neutral-700">
                Set as default address
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={operationLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={operationLoading}
              >
                {operationLoading ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
          <MapPin size={48} className="mx-auto text-neutral-400 mb-4" />
          <h4 className="text-lg font-medium text-neutral-600 mb-2">
            No addresses saved
          </h4>
          <p className="text-neutral-500 mb-4">
            Add your first delivery address to continue
          </p>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddressId === address._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => onAddressSelect(address._id)}
            >
              <div className="flex items-start gap-3">
                {/* Address Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getAddressIcon(address.name)}
                </div>

                {/* Address Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">
                      {getAddressDisplayName(address)}
                    </h4>
                    {address.isDefault && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="font-medium text-neutral-800 mb-1">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-neutral-600 mb-1">
                    {address.phone}
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {address.street}, {address.city}, {address.state} - {address.zipCode}
                    {address.landmark && `, Near ${address.landmark}`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address._id);
                      }}
                      className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Set as default"
                    >
                      <MapPin size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit address"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address._id);
                    }}
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedAddressId === address._id && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Selected for delivery
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InlineAddressManager;
