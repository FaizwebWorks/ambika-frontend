import { ShoppingCart, UserCircle2, LogIn, X, Menu, Truck, Home, ArrowRight, Phone, Mail, Building2, MessageSquare, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Replace this with your actual authentication logic
    const isLoggedIn = false;

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
    }, [location]);

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 shadow-md backdrop-blur-md py-3"
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
                        <Link to="/cart" className="p-2 text-neutral-600 hover:text-blue-600 transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow-sm">0</span>
                        </Link>

                        {isLoggedIn ? (
                            <Link to="/profile" className="ml-2 p-2 text-neutral-600 hover:text-blue-600 transition-colors">
                                <UserCircle2 className="h-5 w-5" />
                            </Link>
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
                fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300
                ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `} onClick={() => setMobileOpen(false)} />

            {/* Mobile Navigation - full screen with better alignment */}
            <div className={`
                fixed top-0 left-0 bottom-0 w-[70%] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                md:hidden overflow-y-auto flex flex-col
            `}>
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
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-100 my-6"></div>

                    {/* Account section */}
                    <div className="mt-2">
                        <h3 className="text-sm font-medium text-neutral-500 px-4 mb-3">Account</h3>
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