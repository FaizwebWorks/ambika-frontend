import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../store/api/authApiSlice';
import { setCredentials } from '../store/slices/authSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const result = await login({ email, password }).unwrap();
            
            if (result.success) {
                dispatch(setCredentials({
                    user: result.user,
                    token: result.token
                }));
                navigate('/'); // Redirect to home page
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div 
            className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center px-4 py-12 relative bg-gradient-to-r from-blue-50 to-neutral-50"
        >
            {/* Gradient overlay */}
            
            <div className="w-full max-w-md relative z-10">
                {/* Card with subtle shadow and border */}
                <div className="bg-white rounded-xl shadow-xs border border-neutral-100 p-8 md:p-10 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-8 space-y-2">
                        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-neutral-500 text-sm md:text-base">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-base"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label 
                                    htmlFor="password" 
                                    className="text-sm font-medium text-neutral-700"
                                >
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        {/* Login Button */}
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
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Registration Link */}
                    <div className="mt-8 text-center text-sm text-neutral-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                            Create account
                        </Link>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                        <p className="text-xs text-neutral-400">
                            By signing in, you agree to our{' '}
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

export default Login;