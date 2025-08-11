import { ChevronDown, ShoppingCart, UserCircle2, LogIn, X, Menu, Truck, Home, Layers, Info, Mail, Building2, MessageSquare, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "./ui/dropdown-menu";

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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm backdrop-blur-md py-3" : "bg-white py-4"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    {/* Logo and mobile menu button */}
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-3 p-2 rounded-md hover:bg-neutral-100 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
                        >
                            {mobileOpen ? (
                                <X className="h-5 w-5 text-neutral-700" />
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
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/" active={isActive("/")}>Home</NavLink>
                        <NavLink to="/categories" active={isActive("/categories")}>Categories</NavLink>
                        <NavLink to="/about" active={isActive("/about")}>About</NavLink>
                        <NavLink to="/contact" active={isActive("/contact")}>Contact</NavLink>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center">
                        <Link to="/cart" className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
                        </Link>

                        {isLoggedIn ? (
                            <Link to="/profile" className="ml-2 p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                                <UserCircle2 className="h-5 w-5" />
                            </Link>
                        ) : (
                            <Link to="/login" className="ml-1 flex items-center gap-2 py-1.5 px-3 font-medium text-sm rounded-lg hover:bg-neutral-100 transition-colors">
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay - reduced blur */}
            <div className={`
                fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300
                ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
            `} onClick={() => setMobileOpen(false)} />

            {/* Mobile Navigation - full screen with better alignment */}
            <div className={`
                fixed top-0 left-0 bottom-0 w-[70%] bg-white z-50 transform transition-transform duration-300 ease-in-out
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                md:hidden overflow-y-auto flex flex-col
            `}>
                {/* Mobile header with logo and close button */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                    <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                        <img src="/logo.svg" alt="Ambika International" className="h-8 w-auto" />
                    </Link>
                    <button
                        className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5 text-neutral-700" />
                    </button>
                </div>

                {/* Mobile menu links - improved spacing and alignment */}
                <div className="flex-1 flex flex-col p-4">
                    <div className="space-y-1 pt-2">
                        <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>
                            <Home className="h-5 w-5 mr-3" />
                            Home
                        </MobileNavLink>
                        <MobileNavLink to="/categories" onClick={() => setMobileOpen(false)}>
                            <ShoppingBag className="h-5 w-5 mr-3" />
                            Categories
                        </MobileNavLink>
                        <MobileNavLink to="/about" onClick={() => setMobileOpen(false)}>
                            <Building2 className="h-5 w-5 mr-3" />
                            About
                        </MobileNavLink>
                        <MobileNavLink to="/contact" onClick={() => setMobileOpen(false)}>
                            <MessageSquare className="h-5 w-5 mr-3" />
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
                                    <UserCircle2 className="h-5 w-5 mr-3" />
                                    My Profile
                                </MobileNavLink>
                                <MobileNavLink to="/orders" onClick={() => setMobileOpen(false)}>
                                    <Truck className="h-5 w-5 mr-3" />
                                    My Orders
                                </MobileNavLink>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center px-4 py-3 text-blue-600 font-medium"
                            >
                                <LogIn className="h-5 w-5 mr-3" />
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>

                {/* Contact info at the bottom */}
                <div className="border-t border-neutral-100 p-6 text-sm text-neutral-500">
                    <p>Need help? Contact us</p>
                    <p className="font-medium text-neutral-800 mt-1">support@ambika.com</p>
                </div>
            </div>
        </header>
    );
};

// Helper component for desktop navigation links
const NavLink = ({ children, to, active }) => {
    return (
        <Link
            to={to}
            className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
                ? "text-neutral-900 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-neutral-900"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                }`}
        >
            {children}
        </Link>
    );
};

// New helper component for mobile navigation links
const MobileNavLink = ({ children, to, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`flex items-center px-4 py-3 rounded-lg text-base ${isActive
                ? "bg-neutral-50 text-neutral-900 font-medium"
                : "text-neutral-700 hover:bg-neutral-50"
                }`}
        >
            {children}
        </Link>
    );
};

export default Navbar;