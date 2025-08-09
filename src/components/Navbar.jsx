import { ChevronDown, Search, ShoppingCart, UserCircle2, LogIn, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../components/ui/dropdown-menu";

const Navbar = () => {
    const [search, setSearch] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    // Replace this with your actual authentication logic
    const isLoggedIn = false; // e.g. useAuth() or check localStorage

    return (
        <nav className="bg-white">
            <div className="flex items-center justify-between gap-3 px-4 md:px-40 py-5">

                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6 text-neutral-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-neutral-700" />
                        )}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src="logo.svg" alt="Ambika International" className=" h-8 md:h-10 w-auto" />
                    </div>

                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8 text-neutral-500 text-sm font-medium">
                    <Link to="/" className="hover:text-neutral-700">Home</Link>
                    {/* Categories Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 hover:text-neutral-700">
                                Categories <ChevronDown className="h-5 w-5 mt-[1px]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link to="/categories">All Categories</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/categories/cleaning">Cleaning Essentials</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/categories/room">Room Supplies</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/categories/security">Security</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link to="/about" className="hover:text-neutral-700">About</Link>
                    <Link to="/contact" className="hover:text-neutral-700">Contact</Link>
                </div>

                {/* Search & Icons */}
                <div className="flex items-center md:space-x-8">
                    <div className="relative max-w-44 md:max-w-72 mr-4 md:mr-8">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Search className="h-5 w-5" />
                        </span>
                        <Input
                            placeholder="Search Products"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-10 text-xs md:text-sm"
                        />
                        {search && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-600"
                                onClick={() => setSearch("")}
                            >
                                <X className="h-5 w-5 cursor-pointer" />
                            </button>
                        )}
                    </div>
                    <Link to="/cart" className="mr-0 md:mr-8">
                        <ShoppingCart className="h-6 w-6 text-neutral-500 hover:text-neutral-700" />
                    </Link>
                    {isLoggedIn ? (
                        <Link to="/profile" className="hidden md:block">
                            <UserCircle2 className="h-6 w-6 text-neutral-500 hover:text-neutral-700" />
                        </Link>
                    ) : (
                        <Link to="/login" className="hidden md:block">
                            <LogIn className="h-6 w-6 text-neutral-500 hover:text-neutral-700" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <div className="md:hidden px-4 py-4 bg-neutral-100">
                    <div className="flex flex-col gap-2 text-neutral-700">
                        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                        {/* Categories Dropdown for Mobile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 w-full text-left">
                                    Categories <ChevronDown className="h-5 w-5 mt-[1px]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuItem asChild>
                                    <Link to="/categories" onClick={() => setMobileOpen(false)}>All Categories</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/categories/cleaning" onClick={() => setMobileOpen(false)}>Cleaning Essentials</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/categories/room" onClick={() => setMobileOpen(false)}>Room Supplies</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/categories/security" onClick={() => setMobileOpen(false)}>Security</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
                        <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                        {isLoggedIn ? (
                            <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                        ) : (
                            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;