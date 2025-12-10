import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/api/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await register(formData).unwrap();
      
      if (result.success) {
        dispatch(setCredentials({
          user: result.user,
          token: result.token
        }));
        toast.success(`Welcome, ${result.user?.name || result.user?.username || 'User'}! Account created successfully. 🎉`);
        navigate('/'); // Redirect to home page
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center relative bg-gradient-to-r from-blue-50 to-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card with subtle shadow and border */}
        <div className="bg-white rounded-xl shadow-xs border border-neutral-100 p-8 md:p-10 transition-all duration-300">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 tracking-tight">
              Create your account
            </h1>
            <p className="text-neutral-500 text-sm md:text-base">
              Enter your details to register an account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block mb-2 text-sm font-medium text-neutral-700"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-base"
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block mb-2 text-sm font-medium text-neutral-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-base"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label 
                htmlFor="password" 
                className="block mb-2 text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 pr-10 transition-all text-base"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-4.5 w-4.5" /> : 
                    <Eye className="h-4.5 w-4.5" />
                  }
                </button>
              </div>
            </div>

            {/* Register Button */}
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base transition-all duration-200 flex items-center justify-center h-11"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  Create account <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Sign in
            </Link>
          </div>

          {/* B2B Registration Link */}
          <div className="mt-4 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Business Customer?</p>
              <p className="text-xs text-blue-600 mb-3">
                Register as B2B partner for wholesale pricing and bulk orders
              </p>
              <Link 
                to="/register-b2b" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                Register as B2B Partner
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-400">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;