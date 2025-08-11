import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ChevronDown, Filter, X, Search, ArrowUpDown } from "lucide-react";

// Example data (replace with API data)
const categoriesData = [
    { name: "All Products" },
    { name: "Cleaning Essentials" },
    { name: "Room Supplies" },
    { name: "Security" },
    { name: "Electronics" },
    { name: "Waste Management" },
];

const productsData = [
	// Cleaning Essentials
	{
		id: 1,
		name: "Professional Cleaning Spray",
		description: "Industrial-strength cleaning formula for all surfaces",
		img: "https://media.istockphoto.com/id/1331969039/photo/cleaning-supplies-are-placed-on-a-wooden-table-for-cleaning.jpg?s=612x612&w=0&k=20&c=YOUKOOTxT6440GnMzYXNns6Ah88D-mKlx6qlyngdbnM=",
		category: "Cleaning Essentials",
		size: ["500ml", "1L", "5L"],
		inStock: true,
		price: 99,
	},
	{
		id: 2,
		name: "Disinfectant Wipes (200 Pack)",
		description: "Hospital-grade disinfecting wipes for high-touch surfaces",
		img: "https://media.istockphoto.com/id/1207809608/photo/wet-wipes-pouch-on-white.jpg?s=612x612&w=0&k=20&c=DKxFQADkQSWuO7TDF67IJ7sEXMLw_wB4L1pZ9fSxmCk=",
		category: "Cleaning Essentials",
		size: ["200ct", "500ct"],
		inStock: true,
		price: 75,
	},
	{
		id: 3,
		name: "Room Freshener Concentrate",
		description: "Long-lasting scent for guest rooms and public areas",
		img: "https://media.istockphoto.com/id/1344673936/photo/automatic-home-air-freshner-next-to-pink-hydrangea-flowers-on-white-background-house.jpg?s=612x612&w=0&k=20&c=vuZrpN2Q1-IhZabfdNdsMKg5eAsU4S_MwDsz68LB4p8=",
		category: "Cleaning Essentials",
		size: ["250ml", "1L"],
		color: ["Lavender", "Citrus", "Ocean Breeze"],
		inStock: true,
		price: 65,
	},
	{
		id: 4,
		name: "Premium Hand Sanitizer",
		description: "70% alcohol formula with moisturizing agents",
		img: "https://plus.unsplash.com/premium_photo-1661591285003-9abbde56bf8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGFuZCUyMFNhbml0aXplcnxlbnwwfHwwfHx8MA%3D%3D",
		category: "Cleaning Essentials",
		size: ["100ml", "500ml", "1L"],
		inStock: true,
		price: 45,
	},
	{
		id: 5,
		name: "Commercial Vacuum Cleaner",
		description: "Quiet operation with HEPA filtration for hotel use",
		img: "https://media.istockphoto.com/id/940972300/photo/vacuum-cleaner-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=26k4IJ6hQjPrfdHcqeztw-ao-u2vfEEaS8XZoMcHOns=",
		category: "Cleaning Essentials",
		inStock: true,
		price: 1299,
	},
	
	// Room Supplies
	{
		id: 6,
		name: "Luxury Bath Towel Set",
		description: "600 GSM cotton towels with hotel logo embroidery option",
		img: "https://media.istockphoto.com/id/1205011453/photo/clean-terry-towels-on-wooden-chair-with-brick-wall-background-copy-space.jpg?s=612x612&w=0&k=20&c=Y-AFkM-p0amwdFAsvmODJNchLQu8sV_D_ht6XkiVxak=",
		category: "Room Supplies",
		size: ["Standard", "Large"],
		color: ["White", "Beige", "Light Grey"],
		inStock: true,
		price: 149,
	},
	{
		id: 7,
		name: "Premium Cotton Bed Sheets",
		description: "300 thread count with deep pockets for hotel mattresses",
		img: "https://media.istockphoto.com/id/2178798254/photo/pastel-light-soft-baby-pale-powder-dusty-gray-silver-blue-white-abstract-background-silk.jpg?s=612x612&w=0&k=20&c=r30-mcd6Yq2yqwvdYUM-lYZNlBdgluCo31SLaxSDNz4=",
		category: "Room Supplies",
		size: ["Twin", "Queen", "King"],
		color: ["White", "Ivory"],
		inStock: true,
		price: 125,
	},
	{
		id: 8,
		name: "Hotel Quality Pillows",
		description: "Hypoallergenic fill with antimicrobial cover",
		img: "https://media.istockphoto.com/id/2104361288/photo/white-pillow-floating-in-mid-air-on-white-background-in-minimalism-and-monochrome.jpg?s=612x612&w=0&k=20&c=_BTu_KvBADXgPwBj_PihDi5kon_D7XGBTz1GMIBV1Ak=",
		category: "Room Supplies",
		size: ["Standard", "King"],
		inStock: true,
		price: 79,
	},
	{
		id: 9,
		name: "Bathroom Amenity Kit",
		description: "Complete set of guest toiletries in eco-friendly packaging",
		img: "https://media.istockphoto.com/id/1214484831/photo/dental-products-and-bath-towels.jpg?s=612x612&w=0&k=20&c=s3cC_trDxVp8g4OUMPh5jqPymKZvCo-pvKkbnVTFRp0=",
		category: "Room Supplies",
		size: ["Basic", "Premium", "Luxury"],
		inStock: true,
		price: 55,
	},
	
	// Security
	{
		id: 11,
		name: "Electronic Door Lock System",
		description: "RFID card access with smartphone app integration",
		img: "/door-lock2.jpg",
		category: "Security",
		inStock: true,
		price: 349,
	},
	{
		id: 12,
		name: "In-Room Safe",
		description: "Digital combination lock with emergency master key",
		img: "/room-safe.jpg",
		category: "Security",
		size: ["Small", "Medium", "Large"],
		inStock: true,
		price: 225,
	},
	{
		id: 13,
		name: "HD Security Camera",
		description: "Night vision with cloud recording capabilities",
		img: "https://plus.unsplash.com/premium_photo-1675016457613-2291390d1bf6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2VjdXJpdHklMjBDYW1lcmF8ZW58MHx8MHx8fDA%3D",
		category: "Security",
		inStock: true,
		price: 175,
	},
	{
		id: 15,
		name: "Emergency Exit Signs",
		description: "LED illuminated with battery backup",
		img: "https://images.unsplash.com/photo-1602208857890-150387aec0be?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		category: "Security",
		inStock: true,
		price: 85,
	},
	
	// Electronics
	{
		id: 16,
		name: "Professional Hair Dryer",
		description: "Wall-mountable with multiple heat settings",
		img: "https://media.istockphoto.com/id/2038108570/photo/white-hairdryer-in-hotel-bathroom.jpg?s=612x612&w=0&k=20&c=jbImDy1qjljIqbPKP1yXXkulFuef4pYL2nNsGTCWwz0=",
		category: "Electronics",
		color: ["Black", "White"],
		inStock: true,
		price: 119,
	},
	{
		id: 17,
		name: "In-Room Coffee Maker",
		description: "Single-serve with auto shutoff feature",
		img: "https://media.istockphoto.com/id/1421796949/photo/modern-electric-coffee-machine-with-cup-isolated-on-white.jpg?s=612x612&w=0&k=20&c=DnBKx1dEUvD6iSJQjSL-Hz7wVpQ8riZ90wNOwCkRIYM=",
		category: "Electronics",
		color: ["Black", "Silver"],
		inStock: true,
		price: 135,
	},
	{
		id: 18,
		name: "Mini Refrigerator",
		description: "Energy-efficient and quiet operation",
		img: "https://media.istockphoto.com/id/1031623722/photo/can-and-water-bottle-in-a-mini-fridge.jpg?s=612x612&w=0&k=20&c=-plCpIozRb6ftVjLRUxQOJrmYbdsMWnMTKupqLfmwSk=",
		category: "Electronics",
		size: ["30L", "45L", "60L"],
		inStock: true,
		price: 299,
	},
	{
		id: 19,
		name: "Electric Kettle",
		description: "Rapid boil with auto shutoff safety feature",
		img: "https://media.istockphoto.com/id/617354074/photo/electric-kettle-in-hand-on-the-background-of-the-kitchen.jpg?s=612x612&w=0&k=20&c=irCSU8ZvjnIKpqAe13C1Q_TzSpNsfjLG_zr2NADLuuk=",
		category: "Electronics",
		size: ["0.5L", "1L", "1.5L"],
		color: ["White", "Black", "Stainless Steel"],
		inStock: true,
		price: 85,
	}
];

const isLoggedIn = false; // Replace with your auth logic

const Categories = () => {
	const location = useLocation();
	
	// Get the category from URL query parameters
	const urlParams = new URLSearchParams(location.search);
	const categoryFromUrl = urlParams.get('category');
	
	// Set initial category based on URL or default to "All Products"
	const [selectedCategory, setSelectedCategory] = useState(
		categoryFromUrl && categoriesData.some(cat => cat.name === categoryFromUrl) 
			? categoryFromUrl 
			: categoriesData[0].name
	);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const filterSheetRef = useRef(null);
	const startYRef = useRef(0);
	const currentYRef = useRef(0);
	
	// Scroll to top with smooth animation
	const scrollToTop = () => {
		// First use immediate scroll to ensure it works
		window.scrollTo(0, 0);
		
		// Then add smooth scroll with a small delay to handle any state updates
		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}, 10);
	};
	
	// Handle category change with scroll to top
	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
		setSelectedColor("");
		setSelectedSize("");
		scrollToTop();
	};
	
	// Filter products by selected category and variants
	const filteredProducts = productsData.filter(
		(p) =>
			(selectedCategory === "All Products" || p.category === selectedCategory) &&
			(!selectedColor || (p.color && p.color.includes(selectedColor))) &&
			(!selectedSize || (p.size && p.size.includes(selectedSize))) &&
			(searchTerm === "" || 
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
				p.description.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	// Get variants for selected category
	const currentVariants =
		categoriesData.find((c) => c.name === selectedCategory)?.variants || {};

	// Touch event handlers for drag to close
	const handleTouchStart = (e) => {
		startYRef.current = e.touches[0].clientY;
	};

	const handleTouchMove = (e) => {
		currentYRef.current = e.touches[0].clientY;
		const filterSheet = filterSheetRef.current;
		if (filterSheet) {
			const deltaY = currentYRef.current - startYRef.current;
			if (deltaY > 0) {
				filterSheet.style.transform = `translateY(${deltaY}px)`;
			}
		}
	};

	const handleTouchEnd = () => {
		const filterSheet = filterSheetRef.current;
		if (filterSheet) {
			const deltaY = currentYRef.current - startYRef.current;
			if (deltaY > 100) {
				setMobileFiltersOpen(false);
			} else {
				filterSheet.style.transform = '';
			}
		}
	};

	// Reset transform when closing
	useEffect(() => {
		if (!mobileFiltersOpen && filterSheetRef.current) {
			filterSheetRef.current.style.transform = '';
		}
	}, [mobileFiltersOpen]);

	// Update browser URL when category changes and scroll to top on category change
	useEffect(() => {
		const newUrl = selectedCategory !== "All Products" 
			? `?category=${encodeURIComponent(selectedCategory)}`
			: "";
		
		window.history.replaceState({}, "", `${location.pathname}${newUrl}`);
	}, [selectedCategory, location.pathname]);

	return (
		<div className="bg-gradient-to-b w-full from-neutral-50 to-white min-h-screen">
			{/* Enhanced Header with Search */}
			<div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
				<div className="max-w-7xl mx-auto px-4 py-6 md:px-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<h1 className="text-2xl font-semibold text-neutral-800">Shop Products</h1>
						
						{/* Search field with clear button */}
						<div className="relative w-full md:w-64 lg:w-80">
							<Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
							<input 
								type="text" 
								placeholder="Search products..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-10 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
							/>
							{/* Clear search button */}
							{searchTerm && (
								<button
									onClick={() => setSearchTerm("")}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
									aria-label="Clear search"
								>
									<X size={16} />
								</button>
							)}
						</div>
					</div>
					
					<div className="flex flex-wrap items-center justify-between mt-6 gap-4">
						<div className="flex items-center gap-2">
							<p className="text-sm font-medium text-neutral-500">
								<span className="hidden md:inline">Showing</span> {filteredProducts.length} products
							</p>
							
							{/* Selected filters pills */}
							<div className="hidden md:flex flex-wrap gap-2">
								{selectedCategory !== "All Products" && (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
										{selectedCategory}
										<button className="ml-1 text-neutral-500 hover:text-neutral-700" onClick={() => setSelectedCategory("All Products")}>
											<X size={14} />
										</button>
									</span>
								)}
								{selectedColor && (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
										{selectedColor}
										<button className="ml-1 text-neutral-500 hover:text-neutral-700" onClick={() => setSelectedColor("")}>
											<X size={14} />
										</button>
									</span>
								)}
								{selectedSize && (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
										Size: {selectedSize}
										<button className="ml-1 text-neutral-500 hover:text-neutral-700" onClick={() => setSelectedSize("")}>
											<X size={14} />
										</button>
									</span>
								)}
							</div>
						</div>
						
						<div className="flex gap-3 items-center">
							{/* Sort dropdown */}
							<div className="relative">
								<button className="hidden md:flex items-center text-sm gap-2 bg-white border border-neutral-200 px-3 py-2 rounded-lg hover:border-neutral-300 transition-colors">
									<ArrowUpDown size={16} />
									Sort by
									<ChevronDown size={16} className="text-neutral-500" />
								</button>
							</div>
							
							{/* Mobile filter toggle with badge if filters active */}
							<button 
								className="md:hidden flex items-center text-sm gap-2 bg-white border border-neutral-200 px-3 py-2 rounded-lg relative"
								onClick={() => setMobileFiltersOpen(true)}
							>
								<Filter size={16} />
								Filters
								{(selectedColor || selectedSize || selectedCategory !== "All Products") && (
									<span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
										!
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
			
			<div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Desktop Sidebar with enhanced design */}
					<aside className="hidden md:block md:w-72 bg-white rounded-xl border border-neutral-100 shadow-sm p-6 flex-shrink-0 self-start sticky top-44 max-h-[calc(100vh-8rem)] overflow-y-auto">
						<h3 className="font-semibold mb-4 text-neutral-800">Categories</h3>
						<ul className="mb-8 space-y-1.5">
							{categoriesData.map((cat) => (
								<li key={cat.name}>
									<button
										className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
											selectedCategory === cat.name
												? "bg-blue-50 font-medium text-blue-700 shadow-sm"
												: "text-neutral-600 hover:bg-neutral-50"
										}`}
										onClick={() => handleCategoryChange(cat.name)}
									>
										{cat.name}
									</button>
								</li>
							))}
						</ul>
						
						{/* Color filter with better visualization */}
						{currentVariants.color && (
							<div className="mb-8">
								<h4 className="font-medium mb-3 text-sm text-neutral-800">Colors</h4>
								<div className="flex gap-3 flex-wrap">
									{currentVariants.color.map((color) => (
										<button
											key={color}
											className={`h-10 w-10 rounded-full border transition-transform ${
												selectedColor === color
													? "ring-2 ring-offset-2 ring-blue-500 scale-110 shadow-md"
													: "hover:scale-105 hover:shadow-sm"
											}`}
											style={{ background: color.toLowerCase() }}
											onClick={() => setSelectedColor(color === selectedColor ? "" : color)}
											title={color}
										/>
									))}
								</div>
							</div>
						)}
						
						{/* Size filter with better buttons */}
						{currentVariants.size && (
							<div className="mb-8">
								<h4 className="font-medium mb-3 text-sm text-neutral-800">Size</h4>
								<div className="flex gap-2 flex-wrap">
									{currentVariants.size.map((size) => (
										<button
											key={size}
											className={`px-4 py-2 rounded-lg border text-sm transition-all ${
												selectedSize === size
													? "bg-blue-600 text-white border-blue-600 shadow-sm"
													: "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
											}`}
											onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
										>
											{size}
										</button>
									))}
								</div>
							</div>
						)}
						
						{/* Clear filters button */}
						<div className="pt-2 border-t border-neutral-100">
							<button 
								className={`mt-4 w-full text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors ${
									selectedCategory !== "All Products" || selectedColor || selectedSize
										? "bg-blue-600 hover:bg-blue-700 text-white"
										: "bg-blue-50 text-neutral-400 cursor-not-allowed"
								}`}
								onClick={() => {
									setSelectedCategory("All Products");
									setSelectedColor("");
									setSelectedSize("");
									scrollToTop();
								}}
								disabled={selectedCategory === "All Products" && !selectedColor && !selectedSize}
							>
								Clear all filters
							</button>
						</div>
					</aside>

					{/* Products grid with enhanced empty state */}
					<main className="flex-1">
						{filteredProducts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{filteredProducts.map((product) => (
									<ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-neutral-100">
								<div className="w-16 h-16 mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
									<Filter size={24} className="text-neutral-400" />
								</div>
								<h3 className="text-lg font-medium text-neutral-800 mb-2">No products match your filters</h3>
								<p className="text-neutral-500 mb-6 max-w-md">Try changing your filter criteria or browse all our products.</p>
								<button 
									className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
									onClick={() => {
										setSelectedCategory("All Products");
										setSelectedColor("");
										setSelectedSize("");
										scrollToTop();
									}}
								>
									Clear filters
								</button>
							</div>
						)}
					</main>
				</div>
			</div>
			
			{/* Mobile Bottom Sheet with improved design */}
			<div 
				className={`
					fixed inset-x-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out
					${mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'}
				`}
				ref={filterSheetRef}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div className="bg-white rounded-t-2xl shadow-xl h-[60vh] overflow-hidden flex flex-col">
					{/* Drag handle */}
					<div className="w-full flex justify-center py-3 bg-white">
						<div className="w-12 h-1.5 bg-neutral-200 rounded-full"></div>
					</div>
					
					<div className="flex-1 overflow-y-auto">
						<div className="px-6 py-4">
							<div className="flex justify-between items-center mb-6">
								<h3 className="font-semibold text-lg">Filters</h3>
								<button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full">
									<X size={20} />
								</button>
							</div>
							
							<h3 className="font-medium mb-4">Categories</h3>
							<ul className="mb-8 space-y-2">
								{categoriesData.map((cat) => (
									<li key={cat.name}>
										<button
											className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
												selectedCategory === cat.name
													? "bg-blue-50 font-medium text-blue-700"
													: "text-neutral-600 hover:bg-neutral-50"
											}`}
											onClick={() => {
												handleCategoryChange(cat.name);
												setMobileFiltersOpen(false);
											}}
										>
											{cat.name}
										</button>
									</li>
								))}
							</ul>
							
							{/* Mobile color and size filters with same design as desktop */}
							{/* ... */}
						</div>
					</div>
					
					{/* Fixed bottom action bar */}
					<div className="border-t border-neutral-100 px-6 py-4 bg-white">
						<div className="flex gap-3">
							<button 
								className="flex-1 border border-neutral-300 text-neutral-800 py-3.5 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
								onClick={() => {
									setSelectedCategory("All Products");
									setSelectedColor("");
									setSelectedSize("");
									setMobileFiltersOpen(false);
									scrollToTop();
								}}
							>
								Clear All
							</button>
							<button 
								className="flex-1 bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
								onClick={() => setMobileFiltersOpen(false)}
							>
								Apply Filters
							</button>
						</div>
					</div>
				</div>
			</div>
			
			{/* Mobile filters overlay backdrop */}
			{mobileFiltersOpen && (
				<div 
					className="fixed inset-0 z-30 md:hidden bg-black/20 transition-opacity"
					onClick={() => setMobileFiltersOpen(false)}
				></div>
			)}
		</div>
	);
};

export default Categories;