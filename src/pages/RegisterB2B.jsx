import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterB2BMutation } from '../store/api/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { Button } from '../components/ui/button';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterB2B = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerB2B, { isLoading }] = useRegisterB2BMutation();

  const [formData, setFormData] = useState({
    // Personal details
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // Business details
    companyName: '',
    businessType: '',
    gstNumber: '',
    businessAddress: '',
    contactPerson: '',
    designation: '',
    businessPhone: '',
    businessEmail: '',
    annualRequirement: ''
  });

  const [errors, setErrors] = useState({});

  const businessTypes = [
    'Hotel',
    'Resort', 
    'Restaurant',
    'Office',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal details validation
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Business details validation
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.businessPhone.trim()) newErrors.businessPhone = 'Business phone is required';
    if (!formData.businessEmail.trim()) newErrors.businessEmail = 'Business email is required';
    if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) newErrors.businessEmail = 'Business email is invalid';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await registerB2B(formData).unwrap();
      
      // Do not auto-login or create final account yet. PreUser created and verification email sent.
      toast.success('Verification email sent — please check your inbox.', { duration: 6000, position: 'top-center' });
      toast('Your account will be activated after you verify the email. Admin approval is still required for B2B accounts.', { duration: 9000, position: 'top-center' });
      navigate('/login');
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      const errorMessage = error?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
      });

      // Handle field-specific errors
      if (error?.data?.errors) {
        const fieldErrors = {};
        error.data.errors.forEach(err => {
          fieldErrors[err.path] = err.msg;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Join as B2B Partner</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Register your business to access wholesale pricing, bulk orders, and dedicated account management
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.username ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.name ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.email ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.phone ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.password ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.confirmPassword ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Confirm password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.companyName ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.businessType ? 'border-red-300' : 'border-neutral-200'
                    }`}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Annual Requirement
                  </label>
                  <input
                    type="text"
                    name="annualRequirement"
                    value={formData.annualRequirement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                    placeholder="e.g., ₹5-10 Lakhs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.businessAddress ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter complete business address"
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Person Information */}
            <div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-blue-600" />
                Contact Person Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.contactPerson ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.designation ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter designation"
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Phone *
                  </label>
                  <input
                    type="tel"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.businessPhone ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter business phone"
                  />
                  {errors.businessPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all ${
                      errors.businessEmail ? 'border-red-300' : 'border-neutral-200'
                    }`}
                    placeholder="Enter business email"
                  />
                  {errors.businessEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Account Approval Process</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Your B2B account will be reviewed by our team within 24-48 hours. You'll receive an email 
                    confirmation once approved. After approval, you'll have access to wholesale pricing, 
                    bulk order discounts, and dedicated account management.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6">
              <div className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create B2B Account'}
              </Button>
            </div>

            <div className="text-center">
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Looking for B2C registration instead?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterB2B;
