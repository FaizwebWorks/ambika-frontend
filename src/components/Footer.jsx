import { Facebook, Heart, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
                {/* Logo & About */}
                <div className="md:col-span-5 flex flex-col">
                    <div className="mb-6">
                        <Link to="/" className="inline-block">
                            <img src="/logo.svg" alt="Ambika International" className="h-10 w-auto" />
                        </Link>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-6 max-w-md">
                        India's trusted wholesale supplier for hotels & shops. Fast delivery, premium quality, and secure payments for all your business essentials.
                    </p>
                    <div className="flex gap-5 mt-auto">
                        <a 
                            href="#" 
                            aria-label="Facebook"
                            className="text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a 
                            href="#" 
                            aria-label="Instagram"
                            className="text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a 
                            href="#" 
                            aria-label="YouTube"
                            className="text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <Youtube className="h-5 w-5" />
                        </a>
                    </div>
                </div>

                {/* Spacer for better layout on larger screens */}
                <div className="hidden md:block md:col-span-1"></div>
                
                {/* Links Section */}
                <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Support */}
                    <div>
                        <h3 className="font-medium text-xs tracking-wider text-neutral-900 mb-5 uppercase">Support</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/faq">FAQ</FooterLink>
                            <FooterLink to="/terms-of-use">Terms of Use</FooterLink>
                            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Company */}
                    <div>
                        <h3 className="font-medium text-xs tracking-wider text-neutral-900 mb-5 uppercase">Company</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/contact">Contact</FooterLink>
                            <FooterLink to="/careers">Careers</FooterLink>
                        </ul>
                    </div>
                    
                    {/* Shop */}
                    <div>
                        <h3 className="font-medium text-xs tracking-wider text-neutral-900 mb-5 uppercase">Shop</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/profile">My Account</FooterLink>
                            <FooterLink to="/checkout">Checkout</FooterLink>
                            <FooterLink to="/cart">Cart</FooterLink>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="h-px bg-neutral-100 my-10"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-neutral-400 text-xs gap-4">
                <span>© 2025 Ambika International. All rights reserved.</span>
                <span className="flex items-center">
                    Made with <Heart size={14} className="mx-1 text-blue-500" /> by Faizal Shaikh.
                </span>
            </div>
        </div>
    </footer>
);

// Helper component for consistent link styling
const FooterLink = ({ to, children }) => (
    <li>
        <Link 
            to={to}
            className="text-neutral-500 hover:text-neutral-800 text-sm transition-colors"
        >
            {children}
        </Link>
    </li>
);

export default Footer;