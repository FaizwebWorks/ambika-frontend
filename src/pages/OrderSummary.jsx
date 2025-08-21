import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  useGetCartQuery, 
  useCreateOrderMutation,
  useCreateStripePaymentIntentMutation,
  useCreateStripeCheckoutSessionMutation
} from '../store/api/authApiSlice';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit3,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import StripePayment from '../components/StripePayment';
import toast from 'react-hot-toast';

const OrderSummary = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const { data: cartResponse, isLoading: cartLoading } = useGetCartQuery(undefined, {
    skip: !isLoggedIn
  });
  
  const [createOrder] = useCreateOrderMutation();
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const [createStripeCheckoutSession] = useCreateStripeCheckoutSessionMutation();
  
  const cart = cartResponse?.data?.cart;
  const cartItems = cart?.items || [];
  
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState('');
  
  // Delivery options
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      time: '5-7 business days',
      price: 0,
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      time: '2-3 business days',
      price: 150,
      icon: Clock
    },
    {
      id: 'priority',
      name: 'Priority Delivery',
      time: 'Next business day',
      price: 300,
      icon: CheckCircle
    }
  ];
  
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  
  // Mock addresses for testing (in real app, these would come from user profile)
  const mockAddresses = [
    {
      _id: 'addr1',
      type: 'Home',
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    {
      _id: 'addr2', 
      type: 'Office',
      street: '456 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra', 
      zipCode: '400002'
    }
  ];
  
  // Use user addresses if available, otherwise use mock addresses
  const availableAddresses = currentUser?.addresses || mockAddresses;
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const deliveryCharge = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + deliveryCharge + tax;
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Debug cart data
    console.log('Cart Response:', cartResponse);
    console.log('Cart Items:', cartItems);
    
    if (cartItems.length === 0 && !cartLoading) {
      toast.error('Your cart is empty. Please add items first.');
      navigate('/cart');
    }
  }, [isLoggedIn, navigate, cartItems.length, cartLoading, cartResponse]);
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const selectedAddressObj = availableAddresses.find(addr => addr._id === selectedAddress);
      const addressString = selectedAddressObj 
        ? `${selectedAddressObj.street}, ${selectedAddressObj.city}, ${selectedAddressObj.state} - ${selectedAddressObj.zipCode}`
        : selectedAddress;

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
          size: item.size,
          variants: item.variants || []
        })),
        customerInfo: {
          name: currentUser?.name || currentUser?.username,
          email: currentUser?.email,
          phone: currentUser?.phone || '9999999999',
          address: addressString
        },
        shipping: {
          address: addressString,
          method: selectedDelivery
        },
        payment: {
          method: paymentMethod
        },
        pricing: {
          subtotal,
          shipping: deliveryCharge,
          tax,
          total
        }
      };

      // Create order first
      const response = await createOrder(orderData).unwrap();
      const orderId = response.data._id;
      setCurrentOrderId(orderId);

      // Handle different payment methods
      if (paymentMethod === 'stripe_card') {
        // Create Stripe payment intent
        const paymentIntentResponse = await createStripePaymentIntent({ orderId }).unwrap();
        setStripeClientSecret(paymentIntentResponse.data.clientSecret);
        setShowStripePayment(true);
        setIsProcessing(false);
      } else if (paymentMethod === 'stripe_checkout') {
        // Create Stripe checkout session and redirect
        const checkoutResponse = await createStripeCheckoutSession({ orderId }).unwrap();
        window.location.href = checkoutResponse.data.url;
      } else {
        // COD or other payment methods
        toast.success('Order placed successfully!', {
          duration: 4000,
          position: 'top-center',
        });
        
        navigate(`/order-success?orderId=${orderId}&total=${total}`);
      }
      
    } catch (error) {
      console.error('Order placement failed:', error);
      const errorMessage = error?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

    const handleStripePaymentSuccess = () => {
    toast.success('Payment completed successfully!', {
      duration: 4000,
      position: 'top-center',
    });
    navigate(`/order-success?orderId=${currentOrderId}&total=${total}`);
  };

  const handleStripePaymentError = (error) => {
    console.error('Stripe payment error:', error);
    toast.error('Payment failed. Please try again.');
  };
  
  if (!isLoggedIn) {
    return null;
  }
  
  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-medium text-neutral-800">Order Summary</h1>
              <p className="text-sm text-neutral-500">Review your order before checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600" />
                Order Items ({cartItems.length})
              </h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 border border-neutral-100 rounded-lg">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product?.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-800">{item.product?.title}</h3>
                      <p className="text-sm text-neutral-600">{item.product?.category?.name}</p>
                      {item.size && (
                        <p className="text-sm text-neutral-500">Size: {item.size}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-neutral-600">Qty: {item.quantity}</span>
                        <span className="font-medium text-neutral-800">
                          ₹{((item.product?.discountPrice || item.product?.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Delivery Address
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>
              
              {availableAddresses && availableAddresses.length > 0 ? (
                <div className="space-y-3">
                  {availableAddresses.map((address) => (
                    <label key={address._id} className="block">
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}>
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          checked={selectedAddress === address._id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-neutral-800">{address.type}</p>
                            <p className="text-neutral-600 text-sm mt-1">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-neutral-600 text-sm">
                              {address.state} - {address.zipCode}
                            </p>
                          </div>
                          {selectedAddress === address._id && (
                            <CheckCircle size={20} className="text-blue-600" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">No delivery address found</p>
                  <Button 
                    onClick={() => navigate('/profile?tab=addresses')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Address
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-blue-600" />
                Delivery Options
              </h2>
              
              <div className="space-y-3">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label key={option.id} className="block">
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDelivery === option.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}>
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={(e) => setSelectedDelivery(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon size={20} className="text-blue-600" />
                            <div>
                              <p className="font-medium text-neutral-800">{option.name}</p>
                              <p className="text-sm text-neutral-600">{option.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-neutral-800">
                              {option.price === 0 ? 'Free' : `₹${option.price}`}
                            </p>
                            {selectedDelivery === option.id && (
                              <CheckCircle size={16} className="text-blue-600 ml-auto mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="block">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-neutral-800">Cash on Delivery</p>
                          <p className="text-sm text-neutral-600">Pay when you receive your order</p>
                        </div>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'stripe_card' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe_card"
                      checked={paymentMethod === 'stripe_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-blue-600" />
                        <div>
                          <p className="font-medium text-neutral-800">Credit/Debit Card</p>
                          <p className="text-sm text-neutral-600">Secure payment with Stripe</p>
                        </div>
                      </div>
                      {paymentMethod === 'stripe_card' && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'stripe_checkout' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe_checkout"
                      checked={paymentMethod === 'stripe_checkout'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-neutral-800">Stripe Checkout</p>
                          <p className="text-sm text-neutral-600">Cards, UPI, Wallets & More</p>
                        </div>
                      </div>
                      {paymentMethod === 'stripe_checkout' && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Stripe Payment Modal */}
            {showStripePayment && stripeClientSecret && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-600" />
                  Complete Payment
                </h2>
                <StripePayment
                  clientSecret={stripeClientSecret}
                  orderId={currentOrderId}
                  amount={total}
                  onSuccess={handleStripePaymentSuccess}
                  onError={handleStripePaymentError}
                  isLoading={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4">Order Total</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax (GST 18%)</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <hr className="border-neutral-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-neutral-800">Total</span>
                  <span className="font-bold text-neutral-900">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress || !paymentMethod}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>

              {/* Security */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-500">
                <Shield size={16} className="text-green-600" />
                Secure & encrypted checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
