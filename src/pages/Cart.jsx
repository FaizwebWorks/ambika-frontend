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
  Headphones,
  RotateCcw,
  Star,
  Gift
} from 'lucide-react';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  
  // Redirect to login if not authenticated
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
    skip: !isLoggedIn
  });
  
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  
  const cart = cartResponse?.data?.cart;
  const cartItems = cart?.items || [];
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.discountPrice || item.product.price || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping for orders above ₹500
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const cartTotal = subtotal + shipping + tax;
  
  // Handle quantity update
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem({
        itemId,
        quantity: newQuantity
      }).unwrap();
      
      toast.success('Cart updated successfully!', {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };
  
  // Handle item removal
  const handleRemoveItem = async (itemId, productTitle) => {
    try {
      await removeFromCart(itemId).unwrap();
      
      toast.success(`${productTitle} removed from cart`, {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };
  
  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart().unwrap();
        
        toast.success('Cart cleared successfully!', {
          duration: 2000,
          position: 'bottom-center',
        });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Failed to clear cart. Please try again.', {
          duration: 3000,
          position: 'bottom-center',
        });
      }
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };
  
  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-blue-600 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Loading cart...</h3>
          <p className="text-neutral-500">Please wait while we fetch your cart items.</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Failed to load cart</h3>
          <p className="text-neutral-500 mb-6">There was an error loading your cart. Please try again.</p>
          <Button 
            onClick={refetchCart}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br w-full from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Mobile-Optimized Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base lg:text-lg font-semibold text-slate-900 truncate">Shopping Cart</h1>
                <p className="text-slate-500 text-xs lg:text-sm mt-0.5">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button 
                onClick={handleClearCart}
                disabled={isClearing}
                className="px-2 py-1.5 lg:px-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 text-xs lg:text-sm font-medium flex-shrink-0"
              >
                <span className="hidden sm:inline">Clear Cart</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 py-4 lg:px-6 lg:py-6">
        {/* Mobile-Optimized promotional banner */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl lg:rounded-2xl p-3 lg:p-4 mb-4 lg:mb-6 text-white shadow-lg border border-blue-500/20">
            <div className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center justify-between gap-3 lg:gap-4">
              <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift size={16} lg:size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm lg:text-base font-semibold mb-1">Premium Benefits Unlocked!</h3>
                  <p className="text-blue-100 text-xs lg:text-sm">Free premium delivery on orders above ₹500</p>
                </div>
              </div>
              {subtotal < 500 && (
                <div className="text-left sm:text-right lg:text-right bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-3 flex-shrink-0 w-full sm:w-auto">
                  <p className="text-xs lg:text-sm font-semibold">Add ₹{(500 - subtotal).toLocaleString('en-IN')} more</p>
                  <p className="text-blue-100 text-xs mt-0.5">for free shipping!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          // Mobile-optimized empty cart state
          <div className="max-w-sm mx-auto px-2">
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-4 lg:p-6 text-center shadow-lg shadow-slate-200/50">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mb-3 lg:mb-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mx-auto shadow-md shadow-blue-100/50">
                <ShoppingBag size={20} lg:size={24} className="text-blue-600" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-2">Your cart awaits</h3>
              <p className="text-slate-500 mb-4 lg:mb-6 text-sm leading-relaxed">Discover premium hotel supplies crafted for excellence.</p>
              
              <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                <Button 
                  onClick={() => navigate('/categories')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-9 lg:h-10 text-sm font-semibold rounded-lg lg:rounded-xl shadow-md shadow-blue-200/50 transition-all duration-300"
                >
                  <ShoppingBag className="mr-2" size={14} />
                  Explore Collection
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/product')}
                  className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 h-8 lg:h-9 rounded-lg lg:rounded-xl text-xs lg:text-sm font-medium"
                >
                  Browse Products
                </Button>
              </div>
              
              {/* Mobile-optimized benefits */}
              <div className="border-t border-slate-100 pt-3 lg:pt-4">
                <h4 className="text-xs lg:text-sm font-semibold text-slate-900 mb-2 lg:mb-3">Premium Experience</h4>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Truck size={12} lg:size={14} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">Express Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Shield size={12} lg:size={14} className="text-green-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <RotateCcw size={12} lg:size={14} className="text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg lg:rounded-xl flex items-center justify-center">
                      <Headphones size={12} lg:size={14} className="text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile-optimized featured categories */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-3 lg:p-4 mt-3 lg:mt-4 shadow-lg shadow-slate-200/50">
              <h4 className="text-xs lg:text-sm font-semibold text-slate-900 mb-3 lg:mb-4 text-center">Featured Collections</h4>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => navigate('/categories')}
                  className="group p-2 lg:p-3 border-2 border-slate-100 hover:border-blue-200 rounded-lg lg:rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-center"
                >
                  <div className="text-lg lg:text-xl mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-300">🚪</div>
                  <h5 className="text-xs font-semibold text-slate-900 mb-0.5">Smart Locks</h5>
                  <p className="text-xs text-slate-500">Premium security</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="group p-2 lg:p-3 border-2 border-slate-100 hover:border-orange-200 rounded-lg lg:rounded-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 transition-all duration-300 text-center"
                >
                  <div className="text-lg lg:text-xl mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-300">🍽️</div>
                  <h5 className="text-xs font-semibold text-slate-900 mb-0.5">Welcome Trays</h5>
                  <p className="text-xs text-slate-500">Luxury dining</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="group p-2 lg:p-3 border-2 border-slate-100 hover:border-green-200 rounded-lg lg:rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 text-center"
                >
                  <div className="text-lg lg:text-xl mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-300">🧽</div>
                  <h5 className="text-xs font-semibold text-slate-900 mb-0.5">Cleaning</h5>
                  <p className="text-xs text-slate-500">Hotel essentials</p>
                </button>
                <button 
                  onClick={() => navigate('/categories')}
                  className="group p-2 lg:p-3 border-2 border-slate-100 hover:border-purple-200 rounded-lg lg:rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 transition-all duration-300 text-center"
                >
                  <div className="text-lg lg:text-xl mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-300">☕</div>
                  <h5 className="text-xs font-semibold text-slate-900 mb-0.5">Kitchen</h5>
                  <p className="text-xs text-slate-500">Premium appliances</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Mobile-optimized cart items - Single column layout
          <div className="flex flex-col space-y-4 lg:space-y-6">
            {/* Cart Items Section */}
            <div className="space-y-3 lg:space-y-4">
              <div className="text-center">
                <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-1">Your Selected Items</h2>
                <p className="text-slate-600 text-xs lg:text-sm">Review and modify your selections</p>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.product._id}-${item.size || 'no-size'}`} 
                       className="group bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl border-2 border-slate-200/40 p-4 lg:p-8 shadow-xl shadow-slate-200/25 hover:shadow-2xl hover:shadow-slate-300/30 hover:border-blue-200/60 transition-all duration-700 hover:scale-[1.01] hover:-translate-y-1"
                       style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col gap-4 lg:gap-6 relative">
                      
                      {/* Premium Badge for Discounted Items */}
                      {item.product.discountPrice && (
                        <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 z-10">
                          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-2 py-1 lg:px-3 lg:py-1.5 rounded-xl lg:rounded-2xl font-bold text-xs lg:text-sm shadow-lg shadow-emerald-200/50 animate-pulse">
                            {Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}% OFF
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Product Header Section */}
                      <div className="flex gap-4 lg:gap-6">
                        {/* Premium Product Image with Enhanced Effects */}
                        <Link 
                          to={`/product/${item.product._id}`}
                          className="flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                        >
                          <div className="relative w-20 h-20 lg:w-32 lg:h-32 rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 border-3 border-slate-200/50 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500">
                            <img
                              src={item.product.images?.[0] || '/placeholder-product.jpg'}
                              alt={item.product.name || item.product.title}
                              className="w-full h-full object-cover hover:scale-125 transition-transform duration-1000"
                            />
                            {/* Image overlay effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                            {/* Premium glow effect */}
                            <div className="absolute inset-0 ring-2 ring-blue-400/0 hover:ring-blue-400/30 rounded-2xl lg:rounded-3xl transition-all duration-500"></div>
                          </div>
                        </Link>
                        
                        {/* Enhanced Product Details with Better Typography */}
                        <div className="flex-1 min-w-0 space-y-2 lg:space-y-3">
                          <Link 
                            to={`/product/${item.product._id}`}
                            className="block hover:text-blue-600 transition-colors duration-300"
                          >
                            <h3 className="font-bold text-slate-900 text-base lg:text-2xl leading-tight mb-1 lg:mb-2 line-clamp-2 hover:text-blue-700 transition-colors duration-300">
                              {item.product.name || item.product.title}
                            </h3>
                          </Link>
                          
                          {/* Enhanced Category Badge */}
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-full px-3 py-1 lg:px-4 lg:py-2 mb-3 lg:mb-4 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                            <p className="text-xs lg:text-sm font-semibold text-blue-700">
                              {item.product.category?.name || 'Premium Hotel Supplies'}
                            </p>
                          </div>
                          
                          {/* Enhanced Price Display with Better Visual Hierarchy */}
                          <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                            {item.product.discountPrice ? (
                              <div className="flex items-center gap-2 lg:gap-3">
                                <span className="text-xl lg:text-3xl font-bold text-emerald-600 tracking-tight">
                                  ₹{item.product.discountPrice.toLocaleString('en-IN')}
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-sm lg:text-base text-slate-400 line-through font-medium">
                                    ₹{item.product.price.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-xs lg:text-sm text-emerald-600 font-semibold">
                                    Save ₹{(item.product.price - item.product.discountPrice).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          
                          {/* Enhanced Stock Status with Better Visual Design */}
                          <div className="flex justify-start">
                            {item.product.stock > 0 ? (
                              <div className="flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 border-2 border-emerald-200/60 rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-lg shadow-emerald-200/40 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-300 group cursor-pointer">
                                <div className="relative">
                                  <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse shadow-md"></div>
                                  <div className="absolute inset-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs lg:text-sm font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300">
                                    ✓ In Stock
                                  </span>
                                  <span className="text-xs text-emerald-600 font-medium">
                                    {item.product.stock} units available
                                  </span>
                                </div>
                                {item.product.stock <= 5 && (
                                  <div className="ml-2 px-2 py-1 bg-amber-100 border border-amber-200 rounded-lg">
                                    <span className="text-xs font-bold text-amber-700">Limited!</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-red-50 via-rose-50 to-red-100 border-2 border-red-200/60 rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 lg:py-2.5 shadow-lg shadow-red-200/40">
                                <div className="relative">
                                  <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse shadow-md"></div>
                                  <div className="absolute inset-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-red-400 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs lg:text-sm font-bold text-red-700">
                                    ⚠ Out of Stock
                                  </span>
                                  <span className="text-xs text-red-600 font-medium">
                                    Notify when available
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Actions Section with Design */}
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6 pt-4 lg:pt-6 border-t-2 border-gradient-to-r from-slate-100 via-slate-200 to-slate-100">
                        
                        {/* Enhanced Quantity Controls with Styling */}
                        <div className="flex items-center bg-gradient-to-r from-white to-slate-50 border-3 border-slate-200/60 rounded-2xl lg:rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:border-blue-200/60 transition-all duration-500">
                          <button
                            onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="p-3 lg:p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-r-2 border-slate-200/60 group"
                          >
                            <Minus size={16} className="lg:w-5 lg:h-5 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
                          </button>
                          <div className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-base lg:text-lg min-w-[3rem] lg:min-w-[4rem] text-center bg-gradient-to-r from-slate-50 to-white border-x border-slate-200/60">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                            disabled={isUpdating || item.quantity >= item.product.stock}
                            className="p-3 lg:p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-l-2 border-slate-200/60 group"
                          >
                            <Plus size={16} className="lg:w-5 lg:h-5 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
                          </button>
                        </div>
                        
                        {/* Enhanced Item Total with Premium Design */}
                        <div className="flex-1 lg:flex-none lg:min-w-[200px] text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-3 border-blue-200/60 rounded-2xl lg:rounded-2xl p-4 lg:p-6 shadow-xl shadow-blue-200/30 hover:shadow-2xl hover:shadow-blue-300/40 transition-all duration-500">
                          <p className="text-sm lg:text-base font-bold text-blue-700 mb-1 lg:mb-2">Item Total</p>
                          <p className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                          </p>
                          {item.product.discountPrice && (
                            <p className="text-xs lg:text-sm text-green-600 font-semibold mt-1">
                              Saved ₹{((item.product.price - item.product.discountPrice) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                        
                        {/* Enhanced Remove Button with Better UX */}
                        <button
                          onClick={() => handleRemoveItem(item._id, item.product.name || item.product.title)}
                          disabled={isRemoving}
                          className="flex items-center justify-center gap-2 lg:gap-3 px-4 py-3 lg:px-6 lg:py-4 text-red-600 hover:text-red-700 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-3 border-red-200/60 hover:border-red-300/80 rounded-2xl lg:rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-xl shadow-red-200/30 hover:shadow-2xl hover:shadow-red-300/40 group"
                        >
                          <Trash2 size={16} className="lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-bold text-sm lg:text-base">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile-optimized Order Summary Section */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-4 lg:p-8 shadow-lg shadow-slate-200/50">
              <div className="text-center mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-1 lg:mb-2 flex items-center justify-center gap-2 lg:gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Package size={14} lg:size={16} className="text-white" />
                  </div>
                  Order Summary
                </h2>
                {/* <p className="text-slate-600 text-xs lg:text-sm">Checkout experience</p> */}
              </div>
              
              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                <div className="flex justify-between items-center py-1.5 lg:py-2 border-b border-slate-100">
                  <span className="text-xs lg:text-sm font-medium text-slate-700">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-base lg:text-lg text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between items-center py-1.5 lg:py-2 border-b border-slate-100">
                  <span className="text-xs lg:text-sm font-medium text-slate-700">Shipping</span>
                  {shipping === 0 ? (
                    <div className="text-right">
                      <span className="font-semibold text-base lg:text-lg text-emerald-600">Free</span>
                      <p className="text-xs text-emerald-600 font-medium">included</p>
                    </div>
                  ) : (
                    <span className="font-semibold text-base lg:text-lg text-slate-900">₹{shipping}</span>
                  )}
                </div>
                
                {shipping > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg lg:rounded-xl p-2 lg:p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck size={10} lg:size={12} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs lg:text-sm font-semibold text-blue-700">Almost there!</p>
                        <p className="text-blue-600 text-xs">Add ₹{(500 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-1.5 lg:py-2 border-b border-slate-100">
                  <span className="text-xs lg:text-sm font-medium text-slate-700">Tax (GST 18%)</span>
                  <span className="font-semibold text-base lg:text-lg text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base lg:text-lg text-slate-900">Total Amount</span>
                    <span className="font-semibold text-xl lg:text-3xl text-slate-900">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                {/* Mobile-optimized Savings Display */}
                {cartItems.some(item => item.product.discountPrice) && (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg lg:rounded-xl p-3 lg:p-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-6 h-6 lg:w-8 lg:h-8 bg-emerald-500 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Gift size={12} lg:size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs lg:text-sm font-semibold text-emerald-700 mb-0.5">You're Saving Big!</p>
                        <p className="text-sm lg:text-lg font-semibold text-emerald-600">
                          ₹{cartItems.reduce((total, item) => {
                            if (item.product.discountPrice) {
                              return total + ((item.product.price - item.product.discountPrice) * item.quantity);
                            }
                            return total;
                          }, 0).toLocaleString('en-IN')} saved on this order
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 lg:space-y-3">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 lg:h-14 text-sm lg:text-base font-semibold rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={cartItems.length === 0}
                >
                  <ShoppingBag className="mr-2" size={16} lg:size={18} />
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/categories')}
                  className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-9 lg:h-10 text-xs lg:text-sm rounded-lg lg:rounded-xl font-semibold transition-all duration-200"
                >
                  Continue Shopping
                </Button>
              </div>
              
              {/* Enhanced Premium Security & Trust Badges */}
              <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gradient-to-r from-slate-200 via-slate-100 to-slate-200">
                <div className="text-center mb-4 lg:mb-6">
                  <div className="inline-flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <h4 className="text-sm lg:text-base font-bold text-slate-900 tracking-wide">Premium Security & Trust</h4>
                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs lg:text-sm text-slate-600 font-medium">Enterprise-grade protection for your peace of mind</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  {/* Bank-Grade Security */}
                  <div className="group flex flex-col items-center gap-2 lg:gap-3 text-center p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-gradient-to-br hover:from-emerald-50/80 hover:to-emerald-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200/60">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:shadow-xl group-hover:shadow-emerald-300/60 group-hover:scale-110 transition-all duration-300 border border-emerald-200/40">
                        <Shield size={16} className="lg:hidden text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300" />
                        <Shield size={20} className="hidden lg:block text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs lg:text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition-colors duration-300">Bank-Grade Security</span>
                      <p className="text-xs text-slate-500 group-hover:text-emerald-600 transition-colors duration-300 hidden lg:block">256-bit SSL encryption</p>
                    </div>
                  </div>
                  
                  {/* Express Delivery */}
                  <div className="group flex flex-col items-center gap-2 lg:gap-3 text-center p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-blue-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/60">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:shadow-xl group-hover:shadow-blue-300/60 group-hover:scale-110 transition-all duration-300 border border-blue-200/40">
                        <Truck size={16} className="lg:hidden text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                        <Truck size={20} className="hidden lg:block text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs lg:text-sm font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">Express Delivery</span>
                      <p className="text-xs text-slate-500 group-hover:text-blue-600 transition-colors duration-300 hidden lg:block">Same day in metros</p>
                    </div>
                  </div>
                  
                  {/* Hassle-Free Returns */}
                  <div className="group flex flex-col items-center gap-2 lg:gap-3 text-center p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-gradient-to-br hover:from-purple-50/80 hover:to-purple-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200/60">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200/50 group-hover:shadow-xl group-hover:shadow-purple-300/60 group-hover:scale-110 transition-all duration-300 border border-purple-200/40">
                        <RotateCcw size={16} className="lg:hidden text-purple-700 group-hover:text-purple-800 transition-colors duration-300" />
                        <RotateCcw size={20} className="hidden lg:block text-purple-700 group-hover:text-purple-800 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs lg:text-sm font-bold text-slate-800 group-hover:text-purple-800 transition-colors duration-300">Hassle-Free Returns</span>
                      <p className="text-xs text-slate-500 group-hover:text-purple-600 transition-colors duration-300 hidden lg:block">30-day guarantee</p>
                    </div>
                  </div>
                  
                  {/* Premium Support */}
                  <div className="group flex flex-col items-center gap-2 lg:gap-3 text-center p-3 lg:p-4 rounded-xl lg:rounded-2xl hover:bg-gradient-to-br hover:from-orange-50/80 hover:to-orange-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-orange-200/60">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:shadow-xl group-hover:shadow-orange-300/60 group-hover:scale-110 transition-all duration-300 border border-orange-200/40">
                        <Headphones size={16} className="lg:hidden text-orange-700 group-hover:text-orange-800 transition-colors duration-300" />
                        <Headphones size={20} className="hidden lg:block text-orange-700 group-hover:text-orange-800 transition-colors duration-300" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-orange-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs lg:text-sm font-bold text-slate-800 group-hover:text-orange-800 transition-colors duration-300">Premium Support</span>
                      <p className="text-xs text-slate-500 group-hover:text-orange-600 transition-colors duration-300 hidden lg:block">24/7 expert assistance</p>
                    </div>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 lg:gap-4 text-xs lg:text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">SSL Secured</span>
                    </div>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">PCI Compliant</span>
                    </div>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">ISO Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile-optimized Recommended Products Section */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/60 p-4 lg:p-8 shadow-lg shadow-slate-200/50">
              <div className="text-center mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-1 lg:mb-2 flex items-center justify-center gap-2 lg:gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Star size={14} lg:size={16} className="text-white" />
                  </div>
                  Recommended for You
                </h2>
                <p className="text-slate-600 text-xs lg:text-sm">Hand-picked premium selections</p>
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                <div className="group p-3 lg:p-4 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <div className="text-lg lg:text-2xl">🚪</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm lg:text-base font-semibold text-slate-900 mb-1 line-clamp-1">Premium Smart Door Lock</h5>
                      <p className="text-slate-600 mb-1.5 lg:mb-2 text-xs lg:text-sm line-clamp-1">Advanced security with biometric access</p>
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <p className="text-sm lg:text-base text-emerald-600 font-semibold">₹2,999</p>
                        <p className="text-xs lg:text-sm text-slate-400 line-through">₹3,499</p>
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 lg:px-2 rounded-full text-xs font-semibold">14% OFF</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0">
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="group p-3 lg:p-4 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-orange-200 hover:shadow-lg">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <div className="text-lg lg:text-2xl">🍽️</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm lg:text-base font-semibold text-slate-900 mb-1 line-clamp-1">Luxury Welcome Tray Set</h5>
                      <p className="text-slate-600 mb-1.5 lg:mb-2 text-xs lg:text-sm line-clamp-1">Elegant hospitality essentials</p>
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <p className="text-sm lg:text-base text-emerald-600 font-semibold">₹1,499</p>
                        <p className="text-xs lg:text-sm text-slate-400 line-through">₹1,799</p>
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 lg:px-2 rounded-full text-xs font-semibold">17% OFF</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0">
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="group p-3 lg:p-4 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-500 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-lg">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <div className="text-lg lg:text-2xl">🧴</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm lg:text-base font-semibold text-slate-900 mb-1 line-clamp-1">Auto Sanitizer Dispenser</h5>
                      <p className="text-slate-600 mb-1.5 lg:mb-2 text-xs lg:text-sm line-clamp-1">Touchless hygiene solution</p>
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <p className="text-sm lg:text-base text-emerald-600 font-semibold">₹899</p>
                        <p className="text-xs lg:text-sm text-slate-400 line-through">₹1,199</p>
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 lg:px-2 rounded-full text-xs font-semibold">25% OFF</span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile-optimized Explore Link */}
              <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-slate-200">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/categories')}
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-9 lg:h-10 text-xs lg:text-sm rounded-lg lg:rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
                >
                  Explore Complete Collection →
                </Button>
              </div>
            </div>
            
            {/* Mobile-optimized Trust Indicators Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl lg:rounded-2xl border border-slate-700 p-4 lg:p-8 text-white shadow-lg">
              <div className="text-center mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold mb-1 lg:mb-2 flex items-center justify-center gap-2 lg:gap-3">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Shield size={14} lg:size={16} className="text-white" />
                  </div>
                  Premium Trust & Excellence
                </h2>
                <p className="text-slate-300 text-xs lg:text-sm">Trusted by hospitality leaders across India</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3 shadow-lg">
                    <div className="text-lg lg:text-xl">⭐</div>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-semibold mb-0.5 lg:mb-1">10,000+</p>
                    <p className="text-xs lg:text-sm font-semibold mb-1">Happy Customers</p>
                    <p className="text-slate-400 text-xs">Premium hotels & resorts across India trust our solutions</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3 shadow-lg">
                    <div className="text-lg lg:text-xl">🚚</div>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-semibold mb-0.5 lg:mb-1">Same Day</p>
                    <p className="text-xs lg:text-sm font-semibold mb-1">Express Delivery</p>
                    <p className="text-slate-400 text-xs">Lightning-fast delivery in major metropolitan cities</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3 shadow-lg">
                    <div className="text-lg lg:text-xl">🛡️</div>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl font-semibold mb-0.5 lg:mb-1">30-Day</p>
                    <p className="text-xs lg:text-sm font-semibold mb-1">Hassle-Free Returns</p>
                    <p className="text-slate-400 text-xs">Complete satisfaction guarantee with premium support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
             