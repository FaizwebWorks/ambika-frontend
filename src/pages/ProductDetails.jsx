import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';

// Sample product data (replace with API call)
const productData = {
  1: {
    id: 1,
    name: "Professional Cleaning Spray",
    description: "Industrial-strength cleaning formula designed specifically for hospitality environments. This premium cleaning spray effectively removes stains, grease, and grime from all surfaces while maintaining safety standards required in hotels and commercial spaces.",
    longDescription: "Our Professional Cleaning Spray represents the pinnacle of commercial cleaning technology. Formulated with advanced surfactants and biodegradable ingredients, this powerful solution tackles the toughest cleaning challenges while remaining safe for frequent use in guest areas. The concentrated formula provides exceptional value, with each bottle covering up to 500 square meters of surface area. Trusted by over 300 hotels across India, this cleaning spray has become the industry standard for maintaining pristine environments that guests expect.",
    images: [
      "https://media.istockphoto.com/id/1331969039/photo/cleaning-supplies-are-placed-on-a-wooden-table-for-cleaning.jpg?s=612x612&w=0&k=20&c=YOUKOOTxT6440GnMzYXNns6Ah88D-mKlx6qlyngdbnM=",
      "https://media.istockphoto.com/id/1207809608/photo/wet-wipes-pouch-on-white.jpg?s=612x612&w=0&k=20&c=DKxFQADkQSWuO7TDF67IJ7sEXMLw_wB4L1pZ9fSxmCk=",
      "https://media.istockphoto.com/id/1344673936/photo/automatic-home-air-freshner-next-to-pink-hydrangea-flowers-on-white-background-house.jpg?s=612x612&w=0&k=20&c=vuZrpN2Q1-IhZabfdNdsMKg5eAsU4S_MwDsz68LB4p8="
    ],
    img: "https://media.istockphoto.com/id/1331969039/photo/cleaning-supplies-are-placed-on-a-wooden-table-for-cleaning.jpg?s=612x612&w=0&k=20&c=YOUKOOTxT6440GnMzYXNns6Ah88D-mKlx6qlyngdbnM=",
    category: "Cleaning Essentials",
    price: 99,
    originalPrice: 129,
    discount: 23,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 156,
    sizes: ["500ml", "1L", "5L"],
    size: ["500ml", "1L", "5L"],
    features: [
      "Industrial-strength formula",
      "Safe for all surfaces", 
      "Biodegradable ingredients",
      "Concentrated formula",
      "Fresh citrus scent",
      "Quick-dry technology"
    ],
    specifications: {
      "Volume": "500ml, 1L, 5L",
      "pH Level": "7.2 (Neutral)",
      "Surface Coverage": "Up to 500 sq meters",
      "Drying Time": "2-3 minutes",
      "Fragrance": "Fresh Citrus",
      "Certification": "ISO 9001, Green Seal Certified"
    },
    benefits: [
      "Removes 99.9% of bacteria and viruses",
      "Leaves no residue or streaks",
      "Safe for food contact surfaces",
      "Eco-friendly and sustainable",
      "Cost-effective concentrated formula"
    ]
  },
  2: {
    id: 2,
    name: "Disinfectant Wipes (200 Pack)",
    description: "Hospital-grade disinfecting wipes for high-touch surfaces",
    longDescription: "Our premium disinfectant wipes are designed for professional use in hospitality environments. Each wipe is pre-moistened with a powerful disinfectant solution that kills 99.9% of germs and bacteria on contact. The durable, non-woven fabric construction ensures effective cleaning without tearing or leaving residue.",
    images: [
      "https://media.istockphoto.com/id/1207809608/photo/wet-wipes-pouch-on-white.jpg?s=612x612&w=0&k=20&c=DKxFQADkQSWuO7TDF67IJ7sEXMLw_wB4L1pZ9fSxmCk="
    ],
    img: "https://media.istockphoto.com/id/1207809608/photo/wet-wipes-pouch-on-white.jpg?s=612x612&w=0&k=20&c=DKxFQADkQSWuO7TDF67IJ7sEXMLw_wB4L1pZ9fSxmCk=",
    category: "Cleaning Essentials",
    price: 75,
    originalPrice: 95,
    discount: 21,
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 234,
    sizes: ["200ct", "500ct"],
    size: ["200ct", "500ct"],
    features: [
      "Hospital-grade disinfection",
      "Kills 99.9% of germs",
      "Durable fabric construction",
      "Pre-moistened convenience",
      "No rinse required"
    ],
    specifications: {
      "Pack Size": "200 wipes, 500 wipes",
      "Wipe Size": "20cm x 15cm",
      "Active Ingredient": "Quaternary Ammonium",
      "Kill Time": "30 seconds",
      "Surface Compatibility": "All hard surfaces"
    },
    benefits: [
      "Quick and convenient disinfection",
      "Safe for food contact surfaces",
      "No mixing or dilution required",
      "Portable and ready-to-use",
      "Meets health department standards"
    ]
  },
  3: {
    id: 3,
    name: "Room Freshener Concentrate",
    description: "Long-lasting scent for guest rooms and public areas",
    longDescription: "Transform your hospitality spaces with our premium room freshener concentrate. This concentrated formula delivers lasting fragrance that neutralizes odors and creates a welcoming atmosphere for guests. Available in multiple sophisticated scents designed specifically for professional environments.",
    images: [
      "https://media.istockphoto.com/id/1344673936/photo/automatic-home-air-freshner-next-to-pink-hydrangea-flowers-on-white-background-house.jpg?s=612x612&w=0&k=20&c=vuZrpN2Q1-IhZabfdNdsMKg5eAsU4S_MwDsz68LB4p8="
    ],
    img: "https://media.istockphoto.com/id/1344673936/photo/automatic-home-air-freshner-next-to-pink-hydrangea-flowers-on-white-background-house.jpg?s=612x612&w=0&k=20&c=vuZrpN2Q1-IhZabfdNdsMKg5eAsU4S_MwDsz68LB4p8=",
    category: "Cleaning Essentials",
    price: 65,
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    stockCount: 89,
    sizes: ["250ml", "1L"],
    size: ["250ml", "1L"],
    color: ["Lavender", "Citrus", "Ocean Breeze"],
    features: [
      "Concentrated formula",
      "Long-lasting fragrance",
      "Odor neutralization",
      "Multiple scent options",
      "Professional grade"
    ],
    specifications: {
      "Volume": "250ml, 1L",
      "Fragrance Duration": "6-8 hours",
      "Coverage Area": "Up to 100 sq meters",
      "Dilution Ratio": "1:10",
      "Scent Options": "Lavender, Citrus, Ocean Breeze"
    },
    benefits: [
      "Creates welcoming atmosphere",
      "Eliminates unpleasant odors",
      "Cost-effective concentrate",
      "Safe for occupied spaces",
      "Professional hospitality grade"
    ]
  },
  4: {
    id: 4,
    name: "Premium Hand Sanitizer",
    description: "70% alcohol formula with moisturizing agents",
    longDescription: "Our premium hand sanitizer combines effective germ-killing power with skin-caring ingredients. The 70% alcohol formula meets health standards while added moisturizers prevent skin dryness. Perfect for high-traffic hospitality environments where frequent hand sanitization is required.",
    images: [
      "https://plus.unsplash.com/premium_photo-1661591285003-9abbde56bf8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGFuZCUyMFNhbml0aXplcnxlbnwwfHwwfHx8MA%3D%3D"
    ],
    img: "https://plus.unsplash.com/premium_photo-1661591285003-9abbde56bf8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGFuZCUyMFNhbml0aXplcnxlbnwwfHwwfHx8MA%3D%3D",
    category: "Cleaning Essentials",
    price: 45,
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockCount: 312,
    sizes: ["100ml", "500ml", "1L"],
    size: ["100ml", "500ml", "1L"],
    features: [
      "70% alcohol content",
      "Added moisturizers",
      "Quick-dry formula",
      "Non-sticky finish",
      "Pleasant fragrance"
    ],
    specifications: {
      "Alcohol Content": "70% Ethyl Alcohol",
      "Volume Options": "100ml, 500ml, 1L",
      "Active Time": "Instant",
      "Moisturizing Agents": "Aloe Vera, Glycerin",
      "Fragrance": "Light Fresh Scent"
    },
    benefits: [
      "Kills 99.9% of germs",
      "Prevents skin dryness",
      "Quick and convenient",
      "Suitable for frequent use",
      "Meets health regulations"
    ]
  },
  // Add more products as needed
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = productData[id];

  // Get related products from the same category (excluding current product)
  const relatedProducts = Object.values(productData)
    .filter(p => p.category === product?.category && p.id !== parseInt(id))
    .slice(0, 4); // Show max 4 related products

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Product not found</h2>
          <p className="text-neutral-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/categories')}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { product, selectedSize, quantity });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white min-h-screen w-full px-1">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-neutral-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="text-neutral-400">/</span>
            <Link to="/categories" className="text-neutral-600 hover:text-blue-600 transition-colors">
              Categories
            </Link>
            <span className="text-neutral-400">/</span>
            <Link 
              to={`/categories?category=${encodeURIComponent(product.category)}`}
              className="text-neutral-600 hover:text-blue-600 transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-800 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-3 lg:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-neutral-50 rounded-lg lg:rounded-xl overflow-hidden group">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Image Navigation - Always visible on mobile */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <ChevronLeft size={16} className="lg:hidden" />
                    <ChevronLeft size={20} className="hidden lg:block" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all lg:opacity-0 lg:group-hover:opacity-100"
                  >
                    <ChevronRight size={16} className="lg:hidden" />
                    <ChevronRight size={20} className="hidden lg:block" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-3 lg:top-4 left-3 lg:left-4 bg-red-500 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium text-nowrap">
                  {product.discount}% OFF
                </div>
              )}

              {/* Image Indicator Dots for Mobile */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImageIndex === index 
                          ? 'bg-white' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images - Hidden on mobile */}
            {product.images.length > 1 && (
              <div className="hidden lg:flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs lg:text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full text-nowrap">
                  {product.category}
                </span>
                {product.inStock && (
                  <span className="text-xs lg:text-sm text-green-600 font-medium flex items-center gap-1 text-nowrap">
                    <Check size={12} className="lg:hidden" />
                    <Check size={14} className="hidden lg:block" />
                    In Stock
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-900 mb-2 leading-tight">
                {product.name}
              </h1>
              
              <p className="text-neutral-600 text-sm lg:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`lg:w-[18px] lg:h-[18px] ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-neutral-300'
                    }`} 
                  />
                ))}
                <span className="text-neutral-800 font-medium ml-1 text-sm lg:text-base text-nowrap">
                  {product.rating}
                </span>
              </div>
              <span className="text-neutral-500 text-sm lg:text-base text-nowrap">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2 lg:gap-3 flex-wrap">
              {isLoggedIn ? (
                <>
                  <span className="text-2xl lg:text-3xl font-semibold text-neutral-900 text-nowrap">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg lg:text-xl text-neutral-500 line-through text-nowrap">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs lg:text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium text-nowrap">
                    Wholesale Price
                  </span>
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 lg:p-4 w-full">
                  <Link to="/login" className="block text-center group">
                    <p className="text-blue-700 font-semibold text-base lg:text-lg group-hover:text-blue-800 transition-colors text-nowrap">
                      🔒 Sign in to view price
                    </p>
                    <p className="text-blue-500 text-xs lg:text-sm mt-1 group-hover:text-blue-600 transition-colors text-nowrap">
                      Get exclusive wholesale rates
                    </p>
                  </Link>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-neutral-800 mb-2 lg:mb-3 text-nowrap">
                  Size / Volume
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 lg:px-4 py-2 rounded-lg border text-xs lg:text-sm font-medium transition-all text-nowrap ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            {isLoggedIn && (
              <div className="space-y-3 lg:space-y-4">
                {/* Quantity Selector */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-800 mb-2 lg:mb-3 text-nowrap">
                    Quantity
                  </h3>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="flex items-center border border-neutral-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} className="lg:hidden" />
                        <Minus size={16} className="hidden lg:block" />
                      </button>
                      <span className="px-3 lg:px-4 py-2 font-medium min-w-[2.5rem] lg:min-w-[3rem] text-center text-sm lg:text-base text-nowrap">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-neutral-50 transition-colors"
                      >
                        <Plus size={14} className="lg:hidden" />
                        <Plus size={16} className="hidden lg:block" />
                      </button>
                    </div>
                    <span className="text-xs lg:text-sm text-neutral-600 text-nowrap">
                      {product.stockCount} available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 lg:gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 h-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg font-medium flex items-center justify-center gap-2 text-sm lg:text-base text-nowrap"
                  >
                    <ShoppingCart size={18} className="lg:hidden" />
                    <ShoppingCart size={20} className="hidden lg:block" />
                    Add to Cart
                  </Button>
                  
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 lg:p-3 rounded-lg border transition-all ${
                      isWishlisted 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                    }`}
                  >
                    <Heart size={18} className={`lg:hidden ${isWishlisted ? 'fill-current' : ''}`} />
                    <Heart size={20} className={`hidden lg:block ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-2.5 lg:p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-600">
                    <Share2 size={18} className="lg:hidden" />
                    <Share2 size={20} className="hidden lg:block" />
                  </button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-neutral-100">
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-1.5 lg:mb-2">
                  <Truck size={18} className="text-blue-600 lg:hidden" />
                  <Truck size={20} className="text-blue-600 hidden lg:block" />
                </div>
                <p className="text-xs lg:text-sm font-medium text-neutral-800 text-nowrap">Fast Delivery</p>
                <p className="text-xs text-neutral-600 text-nowrap">2-3 business days</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-1.5 lg:mb-2">
                  <Shield size={18} className="text-green-600 lg:hidden" />
                  <Shield size={20} className="text-green-600 hidden lg:block" />
                </div>
                <p className="text-xs lg:text-sm font-medium text-neutral-800 text-nowrap">Quality Assured</p>
                <p className="text-xs text-neutral-600 text-nowrap">ISO certified</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-1.5 lg:mb-2">
                  <RotateCcw size={18} className="text-purple-600 lg:hidden" />
                  <RotateCcw size={20} className="text-purple-600 hidden lg:block" />
                </div>
                <p className="text-xs lg:text-sm font-medium text-neutral-800 text-nowrap">Easy Returns</p>
                <p className="text-xs text-neutral-600 text-nowrap">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'features', label: 'Features & Benefits' },
                // { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 lg:py-4 px-1 lg:px-2 border-b-2 font-medium text-xs lg:text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6 lg:py-8">
            {activeTab === 'description' && (
              <div className="max-w-4xl">
                <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-3 lg:mb-4 text-nowrap">
                  Product Description
                </h3>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-600 leading-relaxed text-sm lg:text-base">
                    {product.longDescription}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-4xl">
                <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-4 lg:mb-6 text-nowrap">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 gap-3 lg:gap-6 lg:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border border-neutral-200 rounded-lg p-3 lg:p-4">
                      <dt className="font-medium text-neutral-800 mb-1 text-sm lg:text-base text-nowrap">{key}</dt>
                      <dd className="text-neutral-600 text-xs lg:text-base">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="max-w-4xl">
                <h3 className="text-lg lg:text-xl font-semibold text-neutral-800 mb-4 lg:mb-6 text-nowrap">
                  Features & Benefits
                </h3>
                <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-3 lg:mb-4 flex items-center gap-2 text-nowrap">
                      <Zap size={16} className="text-blue-600 lg:hidden" />
                      <Zap size={18} className="text-blue-600 hidden lg:block" />
                      Key Features
                    </h4>
                    <ul className="space-y-2 lg:space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0 lg:hidden" />
                          <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0 hidden lg:block" />
                          <span className="text-neutral-700 text-sm lg:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-3 lg:mb-4 flex items-center gap-2 text-nowrap">
                      <Star size={16} className="text-yellow-500 lg:hidden" />
                      <Star size={18} className="text-yellow-500 hidden lg:block" />
                      Benefits
                    </h4>
                    <ul className="space-y-2 lg:space-y-3">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0 lg:hidden" />
                          <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0 hidden lg:block" />
                          <span className="text-neutral-700 text-sm lg:text-base">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold text-neutral-800 mb-6">
                  Customer Reviews
                </h3>
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-600">Reviews feature coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-neutral-800 mb-1 lg:mb-2 text-nowrap">
                  Related Products
                </h2>
                <p className="text-neutral-600 text-sm lg:text-base text-nowrap">
                  More products from {product.category}
                </p>
              </div>
              <Link 
                to={`/categories?category=${encodeURIComponent(product.category)}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs lg:text-sm flex items-center gap-1 group text-nowrap"
              >
                View All
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform lg:hidden" />
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform hidden lg:block" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  isLoggedIn={isLoggedIn} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
