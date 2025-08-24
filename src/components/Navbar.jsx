import { ArrowRight, Building2, ChevronDown, Heart, Home, LogIn, LogOut, Mail, Menu, MessageSquare, Phone, Settings, ShoppingBag, ShoppingCart, Truck, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCartQuery, useGetWishlistQuery } from "../store/api/authApiSlice";
import { logout, selectCurrentUser, selectIsAuthenticated } from "../store/slices/authSlice";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get authentication state from Redux
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    
    // Get cart data
    const { data: cartResponse } = useGetCartQuery(undefined, {
        skip: !isLoggedIn
    });
    
    // Get wishlist data
    const { data: wishlistResponse } = useGetWishlistQuery(undefined, {
        skip: !isLoggedIn
    });
    
    // Filter out deleted products from cart count
    const validCartItems = (cartResponse?.data?.cart?.items || []).filter(item => 
        item.product && item.product._id
    );
    const cartItemsCount = validCartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Filter out deleted products from wishlist count
    const validWishlistItems = (wishlistResponse?.data?.items || []).filter(item => {
        const product = item.product || item;
        return product && product._id && product.price !== undefined && product.price !== null;
    });
    const wishlistItemsCount = validWishlistItems.length;

    // Handle logout
    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully! 👋');
        navigate('/');
        setMobileOpen(false);
        setProfileDropdownOpen(false);
        setShowLogoutDialog(false);
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
    };

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileOpen(false);
        setProfileDropdownOpen(false);
    }, [location]);

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown')) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [mobileOpen]);

    // Prevent body scroll when logout dialog is open
    useEffect(() => {
        if (showLogoutDialog) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showLogoutDialog]);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-xl py-3 "
                    : "bg-white py-4"
                }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    {/* Logo and mobile menu button */}
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-3 p-2 rounded-md hover:bg-blue-50 transition-all"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5 text-blue-600" />
                            ) : (
                                <Menu className="h-5 w-5 text-neutral-700" />
                            )}
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <img
                                src="/logo.svg"
                                alt="Ambika International"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" active={isActive("/")}>Home</NavLink>
                        <NavLink to="/categories" active={isActive("/categories")}>Categories</NavLink>
                        <NavLink to="/about" active={isActive("/about")}>About</NavLink>
                        <NavLink to="/contact" active={isActive("/contact")}>Contact</NavLink>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-1">
                        {/* Wishlist Icon - Only show if logged in */}
                        {isLoggedIn && (
                            <Link to="/wishlist" className="p-2 text-neutral-600 hover:text-red-600 transition-colors relative">
                                <Heart className="h-5 w-5" />
                                {wishlistItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full shadow-sm px-1">
                                        {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        
                        <Link to="/cart" className="p-2 text-neutral-600 hover:text-blue-600 transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                            {isLoggedIn && cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs min-w-[16px] h-4 flex items-center justify-center rounded-full shadow-sm px-1">
                                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
                            <div className="relative profile-dropdown">
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="ml-2 flex items-center gap-2 py-1.5 px-4 font-medium text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                                >
                                    <span className="hidden sm:flex items-center gap-1">
                                        <span className="animate-wave">👋🏻</span>
                                        {user?.username || user?.name || 'User'}
                                    </span>
                                    <UserCircle2 className="h-4 w-4" />
                                    <ChevronDown className={`h-3 w-3 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-neutral-200 py-1 z-[100] px-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-2 py-2 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <UserCircle2 className="h-4 w-4 mr-3" />
                                            Profile
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-2 py-2 text-sm text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <Settings className="h-4 w-4 mr-3" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-2 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-md"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="ml-2 flex items-center gap-2 py-1.5 px-4 font-medium text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay - reduced blur */}
            <div className={`
                fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] md:hidden transition-opacity duration-300
                ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setMobileOpen(false)} />

            {/* Mobile Navigation - full screen with better alignment */}
            <div className={`
                w-[70%] bg-white z-[999] transform transition-transform duration-300 ease-in-out shadow-2xl
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                md:hidden overflow-y-auto flex flex-col
            `}
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                height: '100vh',
                // height: '100dvh'
            }}
            >
                {/* Mobile header with logo and close button */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                        <img src="/logo.svg" alt="Ambika International" className="h-8 w-auto" />
                    </Link>
                    <button
                        className="p-2 rounded-md hover:bg-blue-50 transition-all"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5 text-neutral-700 hover:text-blue-600" />
                    </button>
                </div>

                {/* Mobile menu links - improved spacing and alignment */}
                <div className="flex-1 flex flex-col p-4">
                    <div className="space-y-1 pt-2">
                        <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>
                            <Home className="h-5 w-5 mr-3 text-blue-600" />
                            Home
                        </MobileNavLink>
                        <MobileNavLink to="/categories" onClick={() => setMobileOpen(false)}>
                            <ShoppingBag className="h-5 w-5 mr-3 text-blue-600" />
                            Categories
                        </MobileNavLink>
                        <MobileNavLink to="/about" onClick={() => setMobileOpen(false)}>
                            <Building2 className="h-5 w-5 mr-3 text-blue-600" />
                            About
                        </MobileNavLink>
                        <MobileNavLink to="/contact" onClick={() => setMobileOpen(false)}>
                            <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
                            Contact
                        </MobileNavLink>
                        {isLoggedIn && (
                            <MobileNavLink to="/wishlist" onClick={() => setMobileOpen(false)}>
                                <Heart className="h-5 w-5 mr-3 text-blue-600" />
                                <span className="flex items-center">
                                    Wishlist
                                    {wishlistItemsCount > 0 && (
                                        <span className="ml-2 bg-blue-600 text-white text-xs min-w-[18px] h-5 flex items-center justify-center rounded-full px-1.5">
                                            {wishlistItemsCount > 99 ? '99+' : wishlistItemsCount}
                                        </span>
                                    )}
                                </span>
                            </MobileNavLink>
                        )}
                        <MobileNavLink to="/cart" onClick={() => setMobileOpen(false)}>
                            <ShoppingCart className="h-5 w-5 mr-3 text-blue-600" />
                            <span className="flex items-center">
                                Cart
                                {isLoggedIn && cartItemsCount > 0 && (
                                    <span className="ml-2 bg-blue-600 text-white text-xs min-w-[18px] h-5 flex items-center justify-center rounded-full px-1.5">
                                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                    </span>
                                )}
                            </span>
                        </MobileNavLink>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-100 my-6"></div>

                    {/* Account section */}
                    <div className="mt-2">
                        <h3 className="text-sm font-medium text-neutral-500 px-4 mb-3">
                            {isLoggedIn ? `Hello, ${user?.username || user?.user}` : 'Account'}
                        </h3>
                        {isLoggedIn ? (
                            <>
                                <MobileNavLink to="/profile" onClick={() => setMobileOpen(false)}>
                                    <UserCircle2 className="h-5 w-5 mr-3 text-blue-600" />
                                    My Profile
                                </MobileNavLink>
                                <MobileNavLink to="/orders" onClick={() => setMobileOpen(false)}>
                                    <Truck className="h-5 w-5 mr-3 text-blue-600" />
                                    My Orders
                                </MobileNavLink>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <LogIn className="h-5 w-5 mr-3" />
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>

                {/* Contact info at the bottom */}
                {/* Contact info with premium styling */}
                <div className="border-t border-neutral-100 p-6 bg-gradient-to-br from-white to-blue-50/30">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-50 rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0 mr-3 shadow-sm border border-blue-100">
                            <MessageSquare className="text-blue-600" size={18} />
                        </div>
                        <h3 className="text-base font-medium text-neutral-800">Need assistance?</h3>
                    </div>

                    <div className="space-y-3 pl-1">
                        <a
                            href="mailto:support@ambika.com"
                            className="flex items-center text-sm text-neutral-600 hover:text-blue-600 transition-all group"
                        >
                            <div className="h-7 w-7 rounded-lg bg-blue-50/50 flex items-center justify-center mr-2.5 group-hover:bg-blue-100 transition-colors">
                                <Mail size={14} className="text-blue-600" />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">support@ambika.com</span>
                        </a>

                        <a
                            href="tel:+919876543210"
                            className="flex items-center text-sm text-neutral-600 hover:text-blue-600 transition-all group"
                        >
                            <div className="h-7 w-7 rounded-lg bg-blue-50/50 flex items-center justify-center mr-2.5 group-hover:bg-blue-100 transition-colors">
                                <Phone size={14} className="text-blue-600" />
                            </div>
                            <span className="group-hover:translate-x-0.5 transition-transform">+91 98765 43210</span>
                        </a>
                    </div>

                    <div className="mt-5">
                        <Link
                            to="/contact"
                            onClick={() => setMobileOpen(false)}
                            className="inline-flex w-full items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium shadow-sm hover:from-blue-700 hover:to-blue-600 transition-all group"
                        >
                            Contact Us
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>

        {/* Logout Confirmation Dialog - Rendered outside header */}
        {showLogoutDialog && (
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999999
                }}
            >
                <div 
                    className="bg-white rounded-lg shadow-2xl border border-neutral-200 p-6 w-full max-w-md mx-auto transform scale-100"
                    style={{ zIndex: 1000000 }}
                >
                    <div className="flex items-center mb-4">
                        <div className="bg-red-50 rounded-full p-2 mr-3">
                            <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-800">Confirm Logout</h3>
                    </div>
                    
                    <p className="text-neutral-600 mb-6">
                        Are you sure you want to logout? You will need to login again to access your account.
                    </p>
                    
                    <div className="flex space-x-3">
                        <button
                            onClick={cancelLogout}
                            className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmLogout}
                            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

// Helper component for desktop navigation links with enhanced styling
const NavLink = ({ children, to, active }) => {
    return (
        <Link
            to={to}
            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${active
                ? "text-blue-600 bg-blue-50  after:bg-blue-600 after:rounded-full"
                : "text-neutral-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
        >
            {children}
        </Link>
    );
};

// Enhanced helper component for mobile navigation links
const MobileNavLink = ({ children, to, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center px-4 py-3 rounded-lg text-base transition-all ${isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-neutral-700 hover:bg-neutral-50 hover:text-blue-600"
                }`}
        >
            {children}
        </Link>
    );
};

export default Navbar;