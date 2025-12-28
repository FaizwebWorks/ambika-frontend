import { Filter, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useGetCategoriesQuery, useGetProductsQuery } from "../store/api/publicApiSlice";
import { selectCurrentUser, selectIsAuthenticated } from "../store/slices/authSlice";


const Categories = () => {
	const location = useLocation();
	const isLoggedIn = useSelector(selectIsAuthenticated);
	const currentUser = useSelector(selectCurrentUser);



	// Get the category from URL query parameters
	const urlParams = new URLSearchParams(location.search);
	const categoryFromUrl = urlParams.get('category');

	// Fetch categories and products from backend
	const {
		data: categoriesResponse,
		isLoading: categoriesLoading,
		error: categoriesError
	} = useGetCategoriesQuery();

	const categories = categoriesResponse?.data?.categories || [];

// Compute total products and add "All Products" option to categories (show counts)
const totalProducts = Array.isArray(categories) ? categories.reduce((sum, c) => sum + (c.productCount || 0), 0) : 0;
const categoriesData = [
  { _id: 'all', name: "All Products", productCount: totalProducts },
  ...categories
];

	// Set initial category based on URL or default to "All Products"
	const [selectedCategory, setSelectedCategory] = useState(
		categoryFromUrl && categoriesData.some(cat => cat.name === categoryFromUrl)
			? categoryFromUrl
			: "All Products"
	);
	const [selectedColor, setSelectedColor] = useState("");
	const [selectedSize, setSelectedSize] = useState("");
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const filterSheetRef = useRef(null);
	const startYRef = useRef(0);
	const currentYRef = useRef(0);

	// Build query parameters for products API
	const productQueryParams = {
		...(selectedCategory !== "All Products" && {
			category: categories.find(cat => cat.name === selectedCategory)?._id
		}),
		...(searchTerm && { search: searchTerm }),
		limit: 50 // Get more products for frontend filtering
	};

	const {
		data: productsResponse,
		isLoading: productsLoading,
		error: productsError
	} = useGetProductsQuery(productQueryParams);

		// console.log('API Response:', productsResponse);
	const products = productsResponse?.data?.products || [];
		// console.log('Extracted Products:', products);

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

	// Filter products by selected variants (frontend filtering for variants not handled by backend)
	const filteredProducts = products.filter(
		(p) =>
			(!selectedColor || (p.variants?.color && p.variants.color.includes(selectedColor))) &&
			(!selectedSize || (p.variants?.size && p.variants.size.includes(selectedSize)))
	);

	// Get variants for selected category from filtered products
	const currentVariants = {
		color: [...new Set(filteredProducts.flatMap(p => p.variants?.color || []))],
		size: [...new Set(filteredProducts.flatMap(p => p.variants?.size || []))]
	};

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
								{productsLoading ? (
									<span className="flex items-center gap-2">
										<Loader2 size={16} className="animate-spin" />
										Loading products...
									</span>
								) : (
									<>
										<span className="hidden md:inline">Showing</span> {filteredProducts.length} products
									</>
								)}
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
						{categoriesLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 size={24} className="animate-spin text-neutral-400" />
							</div>
						) : categoriesError ? (
							<div className="text-red-500 text-sm">Failed to load categories</div>
						) : (
							<ul className="mb-8 space-y-1.5">
								{categoriesData.map((cat) => (
									<li key={cat._id}>
										<button
											className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${selectedCategory === cat.name
													? "bg-blue-50 font-medium text-blue-700 shadow-sm"
													: "text-neutral-600 hover:bg-neutral-50"
												}`}
											onClick={() => handleCategoryChange(cat.name)}
										>
											<div className="flex justify-between items-center">
												<span>{cat.name}</span>
												<span className="text-sm text-neutral-500">{cat?.productCount ?? 0}</span>
											</div>
										</button>
									</li>
								))}
							</ul>
						)}

						{/* Color filter with better visualization */}
						{currentVariants.color && currentVariants.color.length > 0 && (
							<div className="mb-8">
								<h4 className="font-medium mb-3 text-sm text-neutral-800">Colors</h4>
								<div className="flex gap-3 flex-wrap">
									{currentVariants.color.map((color) => (
										<button
											key={color}
											className={`px-3 py-1.5 rounded-full border text-xs transition-all ${selectedColor === color
													? "bg-blue-600 text-white border-blue-600 shadow-sm"
													: "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
												}`}
											onClick={() => setSelectedColor(color === selectedColor ? "" : color)}
											title={color}
										>
											{color}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Size filter with better buttons */}
						{currentVariants.size && currentVariants.size.length > 0 && (
							<div className="mb-8">
								<h4 className="font-medium mb-3 text-sm text-neutral-800">Size</h4>
								<div className="flex gap-2 flex-wrap">
									{currentVariants.size.map((size) => (
										<button
											key={size}
											className={`px-4 py-2 rounded-lg border text-sm transition-all ${selectedSize === size
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
								className={`mt-4 w-full text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors ${selectedCategory !== "All Products" || selectedColor || selectedSize
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
						{productsLoading ? (
							<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
								<Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
								<h3 className="text-lg font-medium text-neutral-800 mb-2">Loading products...</h3>
								<p className="text-neutral-500">Please wait while we fetch the latest products.</p>
							</div>
						) : productsError ? (
							<div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-neutral-100">
								<div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
									<X size={24} className="text-red-500" />
								</div>
								<h3 className="text-lg font-medium text-neutral-800 mb-2">Failed to load products</h3>
								<p className="text-neutral-500 mb-6">There was an error loading products. Please try again.</p>
								<button
									className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
									onClick={() => window.location.reload()}
								>
									Retry
								</button>
							</div>
						) : filteredProducts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
								{filteredProducts.map((product) => (
									<ProductCard
										key={product._id}
										product={{
											...product,
											id: product._id,
											name: product.title,
											img: product.images?.[0] || '/placeholder-product.jpg',
											inStock: product.stock > 0,
											stockCount: product.stock
										}}
										isLoggedIn={isLoggedIn}
										user={currentUser}
									/>
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
							{categoriesLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 size={24} className="animate-spin text-neutral-400" />
								</div>
							) : (
								<ul className="mb-8 space-y-2">
									{categoriesData.map((cat) => (
										<li key={cat._id}>
											<button
												className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${selectedCategory === cat.name
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
							)}

							{/* Mobile color and size filters */}
							{currentVariants.color && currentVariants.color.length > 0 && (
								<div className="mb-8">
									<h4 className="font-medium mb-3 text-sm text-neutral-800">Colors</h4>
									<div className="flex gap-3 flex-wrap">
										{currentVariants.color.map((color) => (
											<button
												key={color}
												className={`px-3 py-1.5 rounded-full border text-xs transition-all ${selectedColor === color
														? "bg-blue-600 text-white border-blue-600 shadow-sm"
														: "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
													}`}
												onClick={() => setSelectedColor(color === selectedColor ? "" : color)}
											>
												{color}
											</button>
										))}
									</div>
								</div>
							)}

							{currentVariants.size && currentVariants.size.length > 0 && (
								<div className="mb-8">
									<h4 className="font-medium mb-3 text-sm text-neutral-800">Size</h4>
									<div className="flex gap-2 flex-wrap">
										{currentVariants.size.map((size) => (
											<button
												key={size}
												className={`px-4 py-2 rounded-lg border text-sm transition-all ${selectedSize === size
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