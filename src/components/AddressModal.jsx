import { MapPin, Phone, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

const AddressModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  address = null, 
  isLoading = false 
}) => {
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

  useEffect(() => {
    if (address) {
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
    } else {
      // Reset form for new address
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
    }
    setErrors({});
  }, [address, isOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    onSave(formData);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">
              {address ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
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
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-neutral-200 hover:border-neutral-300'
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

            {/* Full Name */}
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

            {/* Phone */}
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

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
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

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* ZIP Code and Landmark */}
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
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
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (address ? 'Update Address' : 'Save Address')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
