import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  useGetCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation, 
  useClearCartMutation 
} from '../store/api/authApiSlice';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Loader2, 
  AlertCircle,
  Package,
  Truck,
  Shield,
  Star,
  Headphones
} from 'lucide-react';
import { Button } from '../components/ui/button';

const Cart = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
  // API hooks
  const { 
    data: cartResponse,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart
  } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const cartItems = cartResponse?.cart?.items || [];
  const cartSummary = cartResponse?.cart?.summary || { total: 0, itemCount: 0 };

  const updateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId, size);
      return;
    }
    
    try {
      await updateCartItem({ 
        productId, 
        quantity: newQuantity,
        ...(size && { size })
      }).unwrap();
      await refetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemoveItem = async (productId, size = null) => {
    try {
      await removeFromCart({ 
        productId,
        ...(size && { size })
      }).unwrap();
      await refetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItems);
    navigate('/checkout');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart().unwrap();
        await refetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Cart Error</h2>
          <p className="text-slate-600 mb-4">
            {cartError?.data?.message || 'Failed to load cart. Please try again.'}
          </p>
          <Button onClick={() => refetchCart()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br w-full from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Fully Responsive Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="p-1.5 sm:p-2 md:p-2.5 hover:bg-slate-100 rounded-lg md:rounded-xl transition-colors"
              >
                <ArrowLeft size={16} className="sm:hidden text-slate-700" />
                <ArrowLeft size={18} className="hidden sm:block md:hidden text-slate-700" />
                <ArrowLeft size={20} className="hidden md:block text-slate-700" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 truncate">
                  Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 truncate">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • ₹{cartSummary.total?.toLocaleString('en-IN') || '0'}
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <Button 
                variant="ghost" 
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base rounded-lg md:rounded-xl"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 xl:px-12">
        {/* Fully Responsive promotional banner */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl md:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-white shadow-lg border border-blue-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Truck size={16} className="sm:hidden text-white" />
                  <Truck size={18} className="hidden sm:block md:hidden text-white" />
                  <Truck size={20} className="hidden md:block lg:hidden text-white" />
                  <Truck size={22} className="hidden lg:block text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-0.5 sm:mb-1">
                    FREE Express Delivery
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-blue-100 truncate">
                    On orders above ₹2,000 • Same day delivery in metro cities
                  </p>
                </div>
              </div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold bg-white/20 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl whitespace-nowrap">
                {cartSummary.total >= 2000 ? '✅ Qualified!' : `₹${(2000 - cartSummary.total).toLocaleString('en-IN')} more needed`}
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          // Fully Responsive empty cart
          <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <ShoppingBag size={32} className="sm:hidden text-slate-400" />
                <ShoppingBag size={40} className="hidden sm:block md:hidden text-slate-400" />
                <ShoppingBag size={48} className="hidden md:block lg:hidden text-slate-400" />
                <ShoppingBag size={56} className="hidden lg:block xl:hidden text-slate-400" />
                <ShoppingBag size={64} className="hidden xl:block text-slate-400" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-slate-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                Your cart is empty
              </h2>
              <p className="text-slate-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-sm sm:text-base md:text-lg lg:text-xl">
                Discover premium hotel essentials and add some items to get started
              </p>
              
              {/* Responsive categories preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <button 
                  onClick={() => navigate('/categories')}
                  className="p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform">🚪</div>
                  <h5 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-0.5">Locks & Security</h5>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500">Smart solutions</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform">🧴</div>
                  <h5 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-0.5">Bath & Hygiene</h5>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500">Premium essentials</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group sm:col-span-1 md:col-span-1"
                >
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform">🔌</div>
                  <h5 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-0.5">Electronics</h5>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500">Smart devices</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group sm:col-span-1 md:col-span-1"
                >
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-1 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform">🍽️</div>
                  <h5 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900 mb-0.5">Kitchen</h5>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500">Premium appliances</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Fully Responsive cart items layout
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {/* Cart Items Section - Takes 2/3 width on XL screens */}
            <div className="xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <div className="text-center xl:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2">Your Selected Items</h2>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base">Review and modify your selections</p>
              </div>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.product._id}-${item.size || 'no-size'}`} className="group bg-white rounded-xl md:rounded-2xl lg:rounded-3xl border border-slate-200/60 p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-500">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {/* Fully Responsive Product Image */}
                      <Link 
                        to={`/product/${item.product._id}`}
                        className="flex-shrink-0 mx-auto sm:mx-0"
                      >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200/60 shadow-md">
                          <img
                            src={item.product.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.product.name || item.product.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      </Link>
                      
                      {/* Fully Responsive Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                          {/* Product Info Section */}
                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <Link 
                              to={`/product/${item.product._id}`}
                              className="block group-hover:text-blue-600 transition-colors"
                            >
                              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-slate-900 mb-1 sm:mb-2 md:mb-3 line-clamp-2">
                                {item.product.name || item.product.title}
                              </h3>
                            </Link>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2">
                              {item.product.description}
                            </p>
                            
                            {/* Responsive Size & Pricing */}
                            <div className="space-y-1 sm:space-y-2 md:space-y-3">
                              {item.size && (
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3">
                                  <span className="text-xs sm:text-sm md:text-base font-medium text-slate-500">Size:</span>
                                  <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm md:text-base font-semibold">
                                    {item.size}
                                  </span>
                                </div>
                              )}
                              
                              {/* Responsive Price Display */}
                              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-3">
                                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-emerald-600">
                                  ₹{(item.product.discountPrice || item.product.price).toLocaleString('en-IN')}
                                </span>
                                {item.product.discountPrice && item.product.price !== item.product.discountPrice && (
                                  <>
                                    <span className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 line-through">
                                      ₹{item.product.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                                      {Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}% OFF
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              {/* Responsive Stock Status */}
                              <div className="flex items-center justify-center sm:justify-start">
                                {item.product.stock > 0 ? (
                                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-emerald-50 border border-emerald-200 rounded-lg md:rounded-xl lg:rounded-2xl px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-full"></div>
                                    <span className="text-xs sm:text-sm md:text-base font-semibold text-emerald-700">In Stock</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-red-50 border border-red-200 rounded-lg md:rounded-xl lg:rounded-2xl px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full"></div>
                                    <span className="text-xs sm:text-sm md:text-base font-semibold text-red-700">Out of Stock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Fully Responsive Actions Section */}
                          <div className="flex flex-row sm:flex-col lg:flex-col items-center sm:items-end lg:items-end justify-between sm:justify-start lg:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6 lg:min-w-[240px] xl:min-w-[280px]">
                            {/* Item Total - Responsive Display */}
                            <div className="text-center sm:text-right bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 border border-slate-200/60 shadow-md flex-1 sm:flex-none sm:w-full">
                              <p className="text-xs sm:text-sm md:text-base font-medium text-slate-500 mb-0.5 sm:mb-1">Item Total</p>
                              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 mb-0.5 sm:mb-1">
                                ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs sm:text-sm md:text-base text-slate-500">
                                ₹{(item.product.discountPrice || item.product.price).toLocaleString('en-IN')} × {item.quantity}
                              </p>
                            </div>
                            
                            {/* Fully Responsive Quantity Controls */}
                            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 bg-white rounded-lg md:rounded-xl lg:rounded-2xl border-2 border-slate-200 p-1 sm:p-1.5 md:p-2 shadow-md">
                              <Button
                                onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 p-0 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md md:rounded-lg lg:rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <Minus size={12} className="sm:hidden" />
                                <Minus size={14} className="hidden sm:block md:hidden" />
                                <Minus size={16} className="hidden md:block lg:hidden" />
                                <Minus size={18} className="hidden lg:block" />
                              </Button>
                              <span className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-slate-900">
                                {item.quantity}
                              </span>
                              <Button
                                onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md md:rounded-lg lg:rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-200"
                                disabled={item.product.stock <= item.quantity}
                              >
                                <Plus size={12} className="sm:hidden" />
                                <Plus size={14} className="hidden sm:block md:hidden" />
                                <Plus size={16} className="hidden md:block lg:hidden" />
                                <Plus size={18} className="hidden lg:block" />
                              </Button>
                            </div>
                            
                            {/* Responsive Remove Button */}
                            <Button
                              onClick={() => handleRemoveItem(item.product._id, item.size)}
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-200 border-2 border-transparent hover:border-red-200"
                            >
                              <Trash2 size={14} className="sm:hidden" />
                              <Trash2 size={16} className="hidden sm:block md:hidden" />
                              <Trash2 size={18} className="hidden md:block lg:hidden" />
                              <Trash2 size={20} className="hidden lg:block" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sidebar with Order Summary and Additional Sections - Takes 1/3 width on XL screens */}
            <div className="xl:col-span-1 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Fully Responsive Order Summary Section */}
              <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl border border-slate-200/60 p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg shadow-slate-200/50 sticky top-24">
                <div className="text-center mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-900 mb-1 sm:mb-2 md:mb-3 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center">
                      <Package size={14} className="sm:hidden text-white" />
                      <Package size={16} className="hidden sm:block md:hidden text-white" />
                      <Package size={18} className="hidden md:block lg:hidden text-white" />
                      <Package size={20} className="hidden lg:block text-white" />
                    </div>
                    Order Summary
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base">Review your order details</p>
                </div>
                
                {/* Responsive Order Details */}
                <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-4 sm:mb-6 md:mb-8">
                  <div className="flex justify-between items-center pb-2 sm:pb-3 md:pb-4 border-b border-slate-200">
                    <span className="text-sm sm:text-base md:text-lg font-medium text-slate-600">Items ({cartSummary.itemCount})</span>
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-900">
                      ₹{cartSummary.subtotal?.toLocaleString('en-IN') || cartSummary.total?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 sm:pb-3 md:pb-4 border-b border-slate-200">
                    <span className="text-sm sm:text-base md:text-lg font-medium text-slate-600">Delivery</span>
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-emerald-600">
                      {cartSummary.total >= 2000 ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 sm:pt-3 md:pt-4">
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900">Total</span>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900">
                      ₹{(cartSummary.total + (cartSummary.total >= 2000 ? 0 : 99)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 sm:h-12 md:h-14 lg:h-16 xl:h-18 text-sm sm:text-base md:text-lg lg:text-xl font-semibold rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={cartItems.length === 0}
                  >
                    <ShoppingBag className="mr-2" size={16} />
                    <span className="sm:hidden">Checkout</span>
                    <span className="hidden sm:inline">Proceed to Checkout</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/categories')}
                    className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-9 sm:h-10 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-lg rounded-lg md:rounded-xl lg:rounded-2xl font-semibold transition-all duration-200"
                  >
                    Continue Shopping
                  </Button>
                </div>
                
                {/* Responsive Security Badges */}
                <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-slate-200">
                  <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 md:mb-6 text-center">Premium Security & Trust</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md">
                        <Shield size={12} className="sm:hidden text-emerald-600" />
                        <Shield size={14} className="hidden sm:block md:hidden text-emerald-600" />
                        <Shield size={16} className="hidden md:block lg:hidden text-emerald-600" />
                        <Shield size={18} className="hidden lg:block text-emerald-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md">
                        <Truck size={12} className="sm:hidden text-blue-600" />
                        <Truck size={14} className="hidden sm:block md:hidden text-blue-600" />
                        <Truck size={16} className="hidden md:block lg:hidden text-blue-600" />
                        <Truck size={18} className="hidden lg:block text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">Hassle-Free Returns</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md">
                        <Headphones size={12} className="sm:hidden text-orange-600" />
                        <Headphones size={14} className="hidden sm:block md:hidden text-orange-600" />
                        <Headphones size={16} className="hidden md:block lg:hidden text-orange-600" />
                        <Headphones size={18} className="hidden lg:block text-orange-600" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base font-semibold text-slate-800">Premium Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Full-width sections below the main cart content */}
        <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          
          {/* Fully Responsive Recommended Products Section */}
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl border border-slate-200/60 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-lg shadow-slate-200/50">
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-slate-900 mb-1 sm:mb-2 md:mb-3 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Star size={14} className="sm:hidden text-white" />
                  <Star size={16} className="hidden sm:block md:hidden text-white" />
                  <Star size={18} className="hidden md:block lg:hidden text-white" />
                  <Star size={20} className="hidden lg:block xl:hidden text-white" />
                  <Star size={22} className="hidden xl:block text-white" />
                </div>
                Recommended for You
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg">Hand-picked premium selections</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <div className="group p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl lg:rounded-2xl xl:rounded-3xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg">
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">🚪</div>
                  </div>
                  <div className="text-center">
                    <h5 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">Premium Smart Door Lock</h5>
                    <p className="text-slate-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Advanced security with biometric access</p>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-5">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-emerald-600 font-semibold">₹2,999</p>
                      <p className="text-xs sm:text-sm md:text-base text-slate-400 line-through">₹3,499</p>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold">14% OFF</span>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl lg:rounded-2xl text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="group p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 rounded-xl lg:rounded-2xl xl:rounded-3xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-orange-200 hover:shadow-lg">
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">🍽️</div>
                  </div>
                  <div className="text-center">
                    <h5 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">Luxury Welcome Tray Set</h5>
                    <p className="text-slate-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Elegant hospitality essentials</p>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-5">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-emerald-600 font-semibold">₹1,499</p>
                      <p className="text-xs sm:text-sm md:text-base text-slate-400 line-through">₹1,799</p>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold">17% OFF</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl lg:rounded-2xl text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="group p-3 sm:p-4 md:p-5 lg:p-6 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 rounded-xl lg:rounded-2xl xl:rounded-3xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-lg md:col-span-2 lg:col-span-1">
                <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">🧴</div>
                  </div>
                  <div className="text-center">
                    <h5 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">Auto Sanitizer Dispenser</h5>
                    <p className="text-slate-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Touchless hygiene solution</p>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-5">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-emerald-600 font-semibold">₹899</p>
                      <p className="text-xs sm:text-sm md:text-base text-slate-400 line-through">₹1,199</p>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded-full text-xs sm:text-sm font-semibold">25% OFF</span>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl lg:rounded-2xl text-xs sm:text-sm md:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 w-full">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Responsive Explore Link */}
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 pt-6 sm:pt-8 md:pt-10 lg:pt-12 border-t border-slate-200">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/categories')}
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-9 sm:h-10 md:h-12 lg:h-14 text-xs sm:text-sm md:text-base lg:text-lg rounded-lg md:rounded-xl lg:rounded-2xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
              >
                Explore Complete Collection →
              </Button>
            </div>
          </div>
          
          {/* Fully Responsive Trust Indicators Section */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl md:rounded-2xl lg:rounded-3xl border border-slate-700 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 text-white shadow-lg">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-1 sm:mb-2 md:mb-3 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Shield size={14} className="sm:hidden text-white" />
                  <Shield size={16} className="hidden sm:block md:hidden text-white" />
                  <Shield size={18} className="hidden md:block lg:hidden text-white" />
                  <Shield size={20} className="hidden lg:block xl:hidden text-white" />
                  <Shield size={22} className="hidden xl:block text-white" />
                </div>
                Premium Trust & Excellence
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base lg:text-lg">Trusted by hospitality leaders across India</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-lg">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">⭐</div>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-0.5 sm:mb-1 md:mb-2">10,000+</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2">Happy Customers</p>
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base">Premium hotels & resorts across India trust our solutions</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-lg">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">🚚</div>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-0.5 sm:mb-1 md:mb-2">Same Day</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2">Express Delivery</p>
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base">Lightning-fast delivery in major metropolitan cities</p>
                </div>
              </div>
              
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-lg">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">🛡️</div>
                </div>
                <div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-0.5 sm:mb-1 md:mb-2">30-Day</p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2">Hassle-Free Returns</p>
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base">Complete satisfaction guarantee with premium support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
