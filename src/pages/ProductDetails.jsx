import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { useGetPublicProductByIdQuery, useGetProductsQuery } from '../store/api/publicApiSlice';
import { 
  useAddToCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from '../store/api/authApiSlice';
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
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  
  // Fetch product data from backend
  const { 
    data: productResponse, 
    isLoading, 
    error 
  } = useGetPublicProductByIdQuery(id);
  
  const product = productResponse?.data?.product;
  
  // Fetch related products (same category)
  const { 
    data: relatedProductsResponse 
  } = useGetProductsQuery(
    product?.category?._id ? { category: product.category._id, limit: 4 } : {},
    { skip: !product?.category?._id }
  );
  
  const relatedProducts = relatedProductsResponse?.data?.products?.filter(p => p._id !== id) || [];
  
  // Cart mutation
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  
  // Wishlist API hooks
  const { data: wishlistResponse } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn
  });
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  
  // Check if current product is in wishlist
  const wishlistItems = wishlistResponse?.data?.items || [];
  const wishlistProductIds = wishlistItems.map(item => item.product?._id || item.productId);
  const isProductInWishlist = wishlistProductIds.includes(product?._id);
  
  // Local state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor("");
    }
  }, [product]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading product...</h3>
          <p className="text-neutral-500">Please wait while we fetch the product details.</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Product not found</h3>
          <p className="text-neutral-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/categories')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }
  
  // No product data
  if (!product) {
    return null;
  }
  
  const images = product.images || [];
  const inStock = product.stock > 0;
  
  // Handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, Math.min(product.stock, quantity + change)));
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Validate required selections
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size before adding to cart', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
    
    try {
      const cartData = {
        productId: product._id,
        quantity: quantity,
        ...(selectedSize && { size: selectedSize }),
        ...(selectedColor && { color: selectedColor })
      };
      
      await addToCart(cartData).unwrap();
      
      // Show success toast
      toast.success(`${product.title} added to cart successfully!`, {
        duration: 3000,
        position: 'top-center',
      });
      
      // Optional: Navigate to cart page
      // navigate('/cart');
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      
      // Show error toast
      if (error?.data?.message) {
        toast.error(`Error: ${error.data.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      } else if (error?.status === 401) {
        toast.error('Please sign in to add items to cart', {
          duration: 4000,
          position: 'top-center',
        });
        navigate('/login');
      } else {
        toast.error('Failed to add product to cart. Please try again.', {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };
  
  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      if (isProductInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        toast.success(`${product.title} removed from wishlist`, {
          duration: 2000,
          position: 'bottom-center',
        });
      } else {
        await addToWishlist(product._id).unwrap();
        toast.success(`${product.title} added to wishlist`, {
          duration: 2000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };
  
  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Product link copied to clipboard!', {
          duration: 2000,
          position: 'top-center',
        });
      } catch (error) {
        toast.error('Failed to copy link to clipboard', {
          duration: 2000,
          position: 'top-center',
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white min-h-screen w-full">
      {/* Header with back button */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-medium text-neutral-800 truncate">{product.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist || isRemovingFromWishlist}
                className={`p-2 rounded-full transition-all duration-300 disabled:opacity-50 ${
                  isProductInWishlist 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'hover:bg-neutral-100 text-neutral-600 hover:text-red-500'
                }`}
              >
                <Heart 
                  size={20} 
                  className={`transition-all duration-300 ${
                    isProductInWishlist ? 'fill-red-500' : ''
                  }`}
                />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl border border-neutral-100 overflow-hidden">
              <img
                src={images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-100' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                {product.title}
              </h1>
              
              {/* Category */}
              <Link 
                to={`/categories?category=${encodeURIComponent(product.category.name)}`}
                className="inline-block text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                {product.category.name}
              </Link>
              
              {/* Price */}
              {isLoggedIn ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-neutral-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-lg text-neutral-500 line-through">
                        ₹{((product.price * 100) / (100 - product.discount)).toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-neutral-400 font-medium">
                  Sign in to view price
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-400"}`}></span>
              <span className="text-sm font-medium">
                {inStock ? (
                  <>
                    <span className="text-green-600">In Stock</span>
                    <span className="text-neutral-500 ml-2">({product.stock} available)</span>
                  </>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-neutral-800 mb-2">Description</h3>
              <p className="text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium text-neutral-800 mb-3">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedSize === size
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {inStock && isLoggedIn && (
              <div>
                <h3 className="font-medium text-neutral-800 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-neutral-500">
                    Max: {product.stock}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4 space-y-3">
              {!isLoggedIn ? (
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Sign in to purchase
                </Button>
              ) : !inStock ? (
                <Button 
                  disabled
                  className="w-full h-12 bg-neutral-100 text-neutral-400 py-3 cursor-not-allowed"
                >
                  Out of Stock
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all duration-300"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  {/* Wishlist Button */}
                  <Button
                    onClick={handleWishlistToggle}
                    disabled={isAddingToWishlist || isRemovingFromWishlist}
                    variant="outline"
                    className={`h-12 px-4 border-2 transition-all duration-300 disabled:opacity-50 ${
                      isProductInWishlist
                        ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border-neutral-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    {isAddingToWishlist || isRemovingFromWishlist ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Heart 
                        size={20} 
                        className={`transition-all duration-300 ${
                          isProductInWishlist ? 'fill-red-500' : ''
                        }`}
                      />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="pt-6 border-t border-neutral-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Truck size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">Free Delivery</div>
                    <div className="text-neutral-500">On orders over ₹500</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Shield size={16} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">Secure Payment</div>
                    <div className="text-neutral-500">100% protected</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <RotateCcw size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-800">Easy Returns</div>
                    <div className="text-neutral-500">7-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900">Related Products</h2>
              <Link 
                to={`/categories?category=${encodeURIComponent(product.category.name)}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct._id} 
                  product={{
                    ...relatedProduct,
                    id: relatedProduct._id,
                    name: relatedProduct.title,
                    img: relatedProduct.images?.[0] || '/placeholder-product.jpg',
                    inStock: relatedProduct.stock > 0,
                    stockCount: relatedProduct.stock
                  }} 
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
   
