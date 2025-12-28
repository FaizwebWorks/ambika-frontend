import {
  AlertCircle,
  ArrowLeft,
  Eye,
  Gift,
  Headphones,
  Loader2,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Star,
  Trash2,
  Truck
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  useAddToCartMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation
} from '../store/api/authApiSlice';
import { useGetProductsQuery } from '../store/api/publicApiSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Cart = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  
  // Local state for quantity inputs to allow typing multiple digits
  const [quantityInputs, setQuantityInputs] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(''); // 'UPI', 'COD', etc.
  const [showUPIPayment, setShowUPIPayment] = useState(false);

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
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const cart = cartResponse?.data?.cart;
  
  // Filter out items with deleted/null products using useMemo to prevent infinite re-renders
  const cartItems = useMemo(() => {
    return (cart?.items || []).filter(item => item.product && item.product._id);
  }, [cart?.items]);

  // Initialize quantity inputs when cart items change
  useEffect(() => {
    const newQuantityInputs = {};
    cartItems.forEach(item => {
      newQuantityInputs[item._id] = item.quantity.toString();
    });
    setQuantityInputs(newQuantityInputs);
    setQuantityErrors({}); // Clear errors when cart items change
  }, [cartItems]);

  // Get unique categories from cart items using useMemo
  const cartCategories = useMemo(() => {
    return [...new Set(cartItems.map(item => item.product?.category?._id).filter(Boolean))];
  }, [cartItems]);

  // Fetch recommended products from cart categories using general products API
  const { data: recommendedProducts, error: recommendedError, isLoading: recommendedLoading } = useGetProductsQuery(
    cartCategories.length > 0 ? { category: cartCategories[0], limit: 10 } : {},
    { skip: cartCategories.length === 0 }
  );
  
  // Fallback to get general products if no category-based recommendations
  const { data: fallbackProducts } = useGetProductsQuery(
    { limit: 6 },
    { skip: cartCategories.length > 0 || !!recommendedProducts }
  );

  // Filter recommended products (exclude cart items, limit to 3)
  const getRecommendedItems = () => {
    // Use category-based recommendations if available, otherwise use fallback
    const productsData = recommendedProducts?.data?.products || fallbackProducts?.data?.products;
    
    if (!productsData || productsData.length === 0) {
      return [];
    }

    const cartProductIds = cartItems.map(item => item.product._id);
    
    const filtered = productsData
      .filter(product => !cartProductIds.includes(product._id))
      .slice(0, 3);
      
    return filtered;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.discountPrice || item.product.price || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  const tax = 0;
  const cartTotal = subtotal; // No shipping charges

  // Handle quantity update
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem({
        itemId,
        quantity: newQuantity
      }).unwrap();

      // Removed toast message for quantity updates
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };

  // Handle quantity input change (for typing)
  const handleQuantityInputChange = (itemId, value) => {
    // Allow empty string and only positive numbers
    if (value === '' || /^\d+$/.test(value)) {
      setQuantityInputs(prev => ({
        ...prev,
        [itemId]: value
      }));
      
      // Clear error when user starts typing
      if (quantityErrors[itemId]) {
        setQuantityErrors(prev => ({
          ...prev,
          [itemId]: ''
        }));
      }
    }
  };

  // Handle quantity input blur or enter key
  const handleQuantityInputSubmit = (itemId, item) => {
    const inputValue = quantityInputs[itemId];
    
    // If empty, set to 1
    if (inputValue === '' || inputValue === '0') {
      setQuantityInputs(prev => ({
        ...prev,
        [itemId]: '1'
      }));
      handleQuantityUpdate(itemId, 1);
      return;
    }
    
    const newQuantity = parseInt(inputValue);
    
    // Validate quantity
    if (newQuantity < 1) {
      setQuantityInputs(prev => ({
        ...prev,
        [itemId]: '1'
      }));
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: 'Minimum quantity is 1'
      }));
      handleQuantityUpdate(itemId, 1);
      // Clear error after 3 seconds
      setTimeout(() => {
        setQuantityErrors(prev => ({
          ...prev,
          [itemId]: ''
        }));
      }, 3000);
    } else if (newQuantity > item.product.stock) {
      setQuantityInputs(prev => ({
        ...prev,
        [itemId]: item.product.stock.toString()
      }));
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Maximum available stock is ${item.product.stock}`
      }));
      handleQuantityUpdate(itemId, item.product.stock);
      // Clear error after 3 seconds
      setTimeout(() => {
        setQuantityErrors(prev => ({
          ...prev,
          [itemId]: ''
        }));
      }, 3000);
    } else if (newQuantity !== item.quantity) {
      handleQuantityUpdate(itemId, newQuantity);
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
    // Proceed to order summary — payment selection happens on the Order Summary page
    navigate('/order-summary', {
      state: {
        cartTotal,
        cartItems: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price
        }))
      }
    });
  };

  // Handle add to cart from recommendations
  const handleAddToCart = async (product) => {
    try {
      await addToCart({
        productId: product._id,
        quantity: 1
      }).unwrap();

      toast.success(`${product.name || product.title} added to cart!`, {
        duration: 2000,
        position: 'bottom-center',
      });

      // Refetch cart to update the UI
      refetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <Loader2 className='animate-spin h-4 w-4' />
            <h3 className="text-xl font-semibold text-slate-800">Loading your cart</h3>
            <p className="text-slate-600 text-sm">Please wait while we fetch your items...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-red-50/20 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">Unable to load cart</h3>
          <p className="text-slate-600 mb-6 leading-relaxed">We encountered an issue while loading your cart. Please try again.</p>
          <Button
            onClick={refetchCart}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Modern Header */}
      <header className="sticky top-16 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Shopping Cart</h1>
                <p className="text-slate-600 text-sm mt-0.5">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 text-sm font-medium border border-red-200 hover:border-red-300"
              >
                <span className="hidden sm:inline">Clear Cart</span>
                <span className="sm:hidden">Clear</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {cartItems.length === 0 ? (
          // Empty Cart State - Modern Design
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Discover our premium collection of hotel supplies crafted for excellence.
              </p>

              <div className="space-y-4 mb-8">
                <Button
                  onClick={() => navigate('/categories')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  <ShoppingBag className="mr-3" size={20} />
                  Explore Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/categories')}
                  className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-10 rounded-xl font-medium"
                >
                  Browse Products
                </Button>
              </div>

              {/* Benefits Grid */}
              <div className="border-t border-slate-200 pt-6">
                <h4 className="font-semibold text-slate-900 mb-4">Why Choose Us</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Truck size={20} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Fast Delivery</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield size={20} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Secure Payment</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <RotateCcw size={20} className="text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Easy Returns</span>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Headphones size={20} className="text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Cart with Items - Modern Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Cart Items</h2>

                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={`${item.product._id}-${item.size || 'no-size'}`}
                      className="group p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300"
                    >
                      {/* Discount Badge */}
                      {item.product.discountPrice && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-xl font-bold text-sm shadow-lg">
                            {Math.round(((item.product.price - item.product.discountPrice) / item.product.price) * 100)}% OFF
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <Link
                          to={`/product/${item.product._id}`}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300">
                            <img
                              src={item.product.images?.[0] || '/placeholder-product.jpg'}
                              alt={item.product.name || item.product.title}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="block hover:text-blue-600 transition-colors duration-300"
                          >
                            <h3 className="text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors duration-300">
                              {item.product.name || item.product.title}
                            </h3>
                          </Link>

                          {/* Category Badge */}
                          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">
                              {item.product.category?.name || 'Premium Hotel Supplies'}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-3">
                            {item.product.discountPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-emerald-600">
                                  ₹{item.product.discountPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-slate-400 line-through font-medium">
                                  ₹{item.product.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-slate-900">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="flex items-center gap-2">
                            {item.product.stock > 0 ? (
                              <div className="flex items-center gap-2 text-emerald-600">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-medium">In Stock ({item.product.stock} available)</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm font-medium">Out of Stock</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 items-end">
                          {/* Quantity Controls */}
                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex items-center bg-white rounded-xl border border-slate-300 overflow-hidden">
                              <button
                                onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                              >
                                <Minus size={16} className="text-slate-700" />
                              </button>
                              <input
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={quantityInputs[item._id] || item.quantity}
                                onChange={(e) => handleQuantityInputChange(item._id, e.target.value)}
                                onBlur={() => handleQuantityInputSubmit(item._id, item)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                min="1"
                                max={item.product.stock}
                                disabled={isUpdating}
                                className="px-3 py-2 font-bold text-slate-900 min-w-[4rem] text-center bg-transparent border-none outline-none disabled:opacity-50"
                              />
                              <button
                                onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                                disabled={isUpdating || item.quantity >= item.product.stock}
                                className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                              >
                                <Plus size={16} className="text-slate-700" />
                              </button>
                            </div>
                            
                            {/* Error Message */}
                            {quantityErrors[item._id] && (
                              <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                                {quantityErrors[item._id]}
                              </div>
                            )}
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm text-slate-600">Item Total</p>
                            <p className="text-xl font-bold text-slate-900">
                              ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                            </p>
                            {item.product.discountPrice && (
                              <p className="text-sm text-green-600 font-medium">
                                Saved ₹{((item.product.price - item.product.discountPrice) * item.quantity).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id, item.product.name || item.product.title)}
                            disabled={isRemoving}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            <span className="font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Order Summary - Right Side */}
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Package size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-lg text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>



                  {/* Tax removed (GST now 0). If needed later, reintroduce here. */}

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-slate-900">Total Amount</span>
                      <span className="font-bold text-2xl text-slate-900">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  

                  {/* Savings Display */}
                  {cartItems.some(item => item.product.discountPrice) && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <Gift size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-700">You're saving big!</p>
                          <p className="font-bold text-emerald-600">
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

                <div className="space-y-3">
                    <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
                    disabled={cartItems.length === 0}
                    >
                      <ShoppingBag className="mr-3" size={20} />
                      {paymentMethod ? `Pay ${cartTotal.toLocaleString('en-IN')} with ${paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'cod' ? 'COD' : paymentMethod}` : 'Proceed to Checkout'}
                    </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate('/categories')}
                    className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 h-10 rounded-xl font-medium"
                  >
                    Continue Shopping
                  </Button>
                </div>



                {/* Premium Security & Trust Section - Keep as is */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <h4 className="text-base font-bold text-slate-900 tracking-wide">Premium Security & Trust</h4>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Enterprise-grade protection for your peace of mind</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Bank-Grade Security */}
                    <div className="group flex flex-col items-center gap-2 text-center p-3 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50/80 hover:to-emerald-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200/60">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:shadow-xl group-hover:shadow-emerald-300/60 group-hover:scale-110 transition-all duration-300 border border-emerald-200/40">
                          <Shield size={18} className="text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-md"></div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-800 transition-colors duration-300">Bank-Grade Security</span>
                        <p className="text-xs text-slate-500 group-hover:text-emerald-600 transition-colors duration-300">256-bit SSL encryption</p>
                      </div>
                    </div>

                    {/* Express Delivery */}
                    <div className="group flex flex-col items-center gap-2 text-center p-3 rounded-xl hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-blue-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200/60">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:shadow-xl group-hover:shadow-blue-300/60 group-hover:scale-110 transition-all duration-300 border border-blue-200/40">
                          <Truck size={18} className="text-blue-700 group-hover:text-blue-800 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-md"></div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">Express Delivery</span>
                        <p className="text-xs text-slate-500 group-hover:text-blue-600 transition-colors duration-300">Same day in metros</p>
                      </div>
                    </div>

                    {/* Hassle-Free Returns */}
                    <div className="group flex flex-col items-center gap-2 text-center p-3 rounded-xl hover:bg-gradient-to-br hover:from-purple-50/80 hover:to-purple-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-200/60">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50 group-hover:shadow-xl group-hover:shadow-purple-300/60 group-hover:scale-110 transition-all duration-300 border border-purple-200/40">
                          <RotateCcw size={18} className="text-purple-700 group-hover:text-purple-800 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-md"></div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-purple-800 transition-colors duration-300">Hassle-Free Returns</span>
                        <p className="text-xs text-slate-500 group-hover:text-purple-600 transition-colors duration-300">30-day guarantee</p>
                      </div>
                    </div>

                    {/* Premium Support */}
                    <div className="group flex flex-col items-center gap-2 text-center p-3 rounded-xl hover:bg-gradient-to-br hover:from-orange-50/80 hover:to-orange-100/80 transition-all duration-300 cursor-pointer border border-transparent hover:border-orange-200/60">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50 group-hover:shadow-xl group-hover:shadow-orange-300/60 group-hover:scale-110 transition-all duration-300 border border-orange-200/40">
                          <Headphones size={18} className="text-orange-700 group-hover:text-orange-800 transition-colors duration-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-md"></div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-orange-800 transition-colors duration-300">Premium Support</span>
                        <p className="text-xs text-slate-500 group-hover:text-orange-600 transition-colors duration-300">24/7 expert assistance</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  {/* <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommended Products Section - Only show when cart has items */}
        {cartItems.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Recommended for You</h2>
              </div>
              <p className="text-slate-600">Products from your cart categories</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getRecommendedItems().length > 0 ? (
                getRecommendedItems().map((product) => (
                  <div key={product._id} className="group bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-all duration-300 border border-slate-200 hover:border-slate-300">
                    <div className="relative mb-4">
                      <div className="w-full h-48 bg-white rounded-xl overflow-hidden shadow-md">
                        <img
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name || product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {product.discountPrice && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white px-2 py-1 rounded-lg font-bold text-sm">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">
                      {product.name || product.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {product.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-emerald-600">
                            ₹{product.discountPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-400 line-through font-medium">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-4">
                      {product.stock > 0 ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm font-medium">In Stock</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/product/${product._id}`)}
                        variant="outline"
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        disabled={isAdding || product.stock === 0}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
                      >
                        {isAdding ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <ShoppingBag size={16} className="mr-2" />
                        )}
                        {isAdding ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-600">No recommendations available at the moment</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/categories')}
                className="border-2 border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-12 px-8 rounded-xl font-semibold"
              >
                Explore Complete Collection →
              </Button>
            </div>
          </div>
        )}
        
        {/* Premium Trust & Excellence Section - Keep as is */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-lg">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold">Premium Trust & Excellence</h2>
            </div>
            <p className="text-slate-300">Trusted by hospitality leaders across India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-2xl">⭐</div>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">10,000+</p>
                <p className="font-semibold mb-2">Happy Customers</p>
                <p className="text-slate-400 text-sm">Premium hotels & resorts across India trust our solutions</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-2xl">🚚</div>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">Same Day</p>
                <p className="font-semibold mb-2">Express Delivery</p>
                <p className="text-slate-400 text-sm">Lightning-fast delivery in major metropolitan cities</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="text-2xl">🛡️</div>
              </div>
              <div>
                <p className="text-2xl font-bold mb-1">30-Day</p>
                <p className="font-semibold mb-2">Hassle-Free Returns</p>
                <p className="text-slate-400 text-sm">Complete satisfaction guarantee with premium support</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;