import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Shield,
  Truck
} from 'lucide-react';
import { useGetSettingsQuery } from '../store/api/settingsApiSlice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InlineAddressManager from '../components/InlineAddressManager';
import { Button } from '../components/ui/button';
import UPIPayment from '../components/UPIPayment';
import {
  useAddAddressMutation,
  useClearCartMutation,
  useCreateOrderMutation,
  // useCreateStripeCheckoutSessionMutation, // Commented out - Stripe temporarily disabled
  // useCreateStripePaymentIntentMutation, // Commented out - Stripe temporarily disabled
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useGetCartQuery,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation
} from '../store/api/authApiSlice';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';

const OrderSummary = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const { data: cartResponse, isLoading: cartLoading } = useGetCartQuery(undefined, {
    skip: !isLoggedIn
  });
  
  const [createOrder] = useCreateOrderMutation();
  // const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation(); // Commented out - Stripe temporarily disabled
  // const [createStripeCheckoutSession] = useCreateStripeCheckoutSessionMutation(); // Commented out - Stripe temporarily disabled
  const [clearCart] = useClearCartMutation();
  
  // Address management hooks
  const { 
    data: addressesData, 
    isLoading: addressesLoading, 
    error: addressesError 
  } = useGetAddressesQuery();
  
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  
  const addresses = addressesData?.addresses || [];
  
  const cart = cartResponse?.data?.cart;
  const cartItems = cart?.items || [];
  
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
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
      price: 60,
      icon: Clock
    },
    {
      id: 'priority',
      name: 'Priority Delivery',
      time: 'Next business day',
      price: 100,
      icon: CheckCircle
    }
  ];
  
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  
  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else {
        setSelectedAddressId(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddressId]);

  // Read settings to determine which payment methods are available on site
  const { data: settingsResp } = useGetSettingsQuery();
  const paymentsVisibility = settingsResp?.data?.payments || { upi: true, cod: true };

  // If selected paymentMethod becomes unavailable, clear it
  useEffect(() => {
    if (paymentMethod) {
      if ((paymentMethod === 'upi' && !paymentsVisibility.upi) || (paymentMethod === 'cod' && !paymentsVisibility.cod)) {
        setPaymentMethod('');
      }
    }
  }, [paymentsVisibility, paymentMethod]);
  
  // Use real addresses from API
  const availableAddresses = addresses;
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const deliveryCharge = deliveryOptions.find(d => d.id === selectedDelivery)?.price || 0;
  // GST removed globally
  const tax = 0;
  const total = subtotal + deliveryCharge; // exclude tax since it's zero
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Debug cart data
  // console.log('Cart Response:', cartResponse);
  // console.log('Cart Items:', cartItems);
    
    if (cartItems.length === 0 && !cartLoading) {
      toast.error('Your cart is empty. Please add items first.');
      navigate('/cart');
    }
  }, [isLoggedIn, navigate, cartItems.length, cartLoading, cartResponse]);
  
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
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
      const selectedAddressObj = availableAddresses.find(addr => addr._id === selectedAddressId);
      const addressString = selectedAddressObj 
        ? `${selectedAddressObj.street}, ${selectedAddressObj.city}, ${selectedAddressObj.state} - ${selectedAddressObj.zipCode}`
        : selectedAddressId;
        
      // Get delivery option details
      const deliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);

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
          method: paymentMethod === 'upi' ? 'upi' : 'cod'
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
      if (paymentMethod === 'upi') {
        setCurrentOrderId(orderId);
        setShowUPIPayment(true);
        setIsProcessing(false);
      } else if (paymentMethod === 'cod') {
        // COD payment method
        toast.success('Order placed successfully!', {
          duration: 4000,
          position: 'top-center',
        });
        // Clear cart after successful order placement
        await clearCart();
        navigate(`/order-success?orderId=${orderId}&total=${total}`);
      } else {
        // Other payment methods (currently disabled)
        toast.error('This payment method is currently unavailable. Please choose UPI or Cash on Delivery.');
        setIsProcessing(false);
        return;
      }

      // Original Stripe implementation commented out:
      /*
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
      }
      */
      
    } catch (error) {
      console.error('Order placement failed:', error);
      const errorMessage = error?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  // Stripe payment handlers commented out - temporarily disabled
  /*
  const handleStripePaymentSuccess = () => {
    toast.success('Payment completed successfully!', {
      duration: 4000,
      position: 'top-center',
    });
    // Clear cart after successful Stripe payment
    clearCart();
    navigate(`/order-success?orderId=${currentOrderId}&total=${total}`);
  };

  const handleStripePaymentError = (error) => {
    console.error('Stripe payment error:', error);
    setIsProcessing(false);
    toast.error('Payment failed. Please try again.');
  };
  */
  
  // Let ProtectedRoute handle authentication - component code starts below
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
              <InlineAddressManager
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
                onAddAddress={async (formData) => {
                  try {
                    await addAddress(formData).unwrap();
                  } catch (error) {
                    throw new Error(error?.data?.message || 'Failed to add address');
                  }
                }}
                onUpdateAddress={async (addressId, formData) => {
                  try {
                    await updateAddress({ addressId, ...formData }).unwrap();
                  } catch (error) {
                    throw new Error(error?.data?.message || 'Failed to update address');
                  }
                }}
                onDeleteAddress={async (addressId) => {
                  try {
                    await deleteAddress(addressId).unwrap();
                    // Reset selected address if deleted address was selected
                    if (selectedAddressId === addressId) {
                      setSelectedAddressId(null);
                    }
                  } catch (error) {
                    throw new Error(error?.data?.message || 'Failed to delete address');
                  }
                }}
                onSetDefault={async (addressId) => {
                  try {
                    await setDefaultAddress(addressId).unwrap();
                  } catch (error) {
                    throw new Error(error?.data?.message || 'Failed to set default address');
                  }
                }}
                isLoading={addressesLoading}
              />
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
              
              {/* Payment Gateway Maintenance Notice */}
              {/* <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-orange-600" />
                  <span className="font-medium text-orange-800">Payment Gateway Maintenance</span>
                </div>
                <p className="text-sm text-orange-700">
                  Online payment options are temporarily unavailable. We're working to restore them soon. 
                  Cash on Delivery is available for all orders.
                </p>
              </div> */}
              
              <div className="space-y-3">
                {/* UPI Payment Option */}
                {paymentsVisibility.upi && (
                  <label className="block">
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm-1.77 16.5l-3.46-3.47 1.41-1.41 2.05 2.05 4.65-4.64 1.41 1.41-6.06 6.06z"/>
                        </svg>
                        <div>
                          <p className="font-medium text-neutral-800">UPI Payment</p>
                          <p className="text-sm text-neutral-600">Pay using any UPI app</p>
                          <p className="mt-2 text-xs text-orange-600">
                            Automatic UPI verification is not available yet. After paying you will need to share the transaction ID with support for manual confirmation.
                            We currently recommend selecting Cash on Delivery.
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'upi' && (
                        <CheckCircle size={20} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                  </label>
                )}

                {/* Cash on Delivery Option */}
                {paymentsVisibility.cod && (
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
                )}

                {/* <label className="block">
                  <div className="p-4 border-2 rounded-lg opacity-50 cursor-not-allowed border-neutral-200 bg-neutral-100">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe_card"
                      disabled={true}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-neutral-400" />
                        <div>
                          <p className="font-medium text-neutral-500">Credit/Debit Card</p>
                          <p className="text-sm text-neutral-400">Currently unavailable - Under maintenance</p>
                        </div>
                      </div>
                      <Clock size={16} className="text-orange-500" />
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className="p-4 border-2 rounded-lg opacity-50 cursor-not-allowed border-neutral-200 bg-neutral-100">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe_checkout"
                      disabled={true}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-neutral-400" />
                        <div>
                          <p className="font-medium text-neutral-500">Stripe Checkout</p>
                          <p className="text-sm text-neutral-400">Cards, UPI, Wallets - Currently unavailable</p>
                        </div>
                      </div>
                      <Clock size={16} className="text-orange-500" />
                    </div>
                  </div>
                </label> */}
              </div>
            </div>

            {/* UPI Payment Modal */}
            {showUPIPayment && currentOrderId && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div 
                  className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative transform transition-all scale-in-center max-h-[90vh] flex flex-col"
                  style={{
                    animation: 'scale-in-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both'
                  }}
                >
                  {/* Modal Header - Fixed */}
                  <div className="px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowUPIPayment(false)}
                          className="p-2 hover:bg-neutral-100 rounded-xl transition-colors duration-200 -ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2.5 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm-1.77 16.5l-3.46-3.47 1.41-1.41 2.05 2.05 4.65-4.64 1.41 1.41-6.06 6.06z"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-800">UPI Payment</h3>
                            <p className="text-sm text-neutral-500">Pay using any UPI app, then enter your transaction ID below to verify and place your order.</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowUPIPayment(false)}
                        className="p-2 hover:bg-neutral-100 rounded-xl transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Amount Display */}
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-50 via-blue-50 to-white border-b border-neutral-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-500">Amount to Pay</span>
                      <span className="text-sm text-neutral-500">Order #{currentOrderId.slice(-8)}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-neutral-800">₹{total.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-neutral-500">.00</span>
                    </div>
                  </div>

                  {/* UPI Payment Component */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      <UPIPayment
                        orderId={currentOrderId}
                        amount={total}
                        onClose={() => setShowUPIPayment(false)}
                        onSuccess={async (transactionId) => {
                          setShowUPIPayment(false);
                          await clearCart();
                          navigate(`/order-success?orderId=${currentOrderId}&transactionId=${transactionId}&total=${total}`);
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer with Security Info - Fixed */}
                  <div className="px-6 py-4 bg-neutral-50 rounded-b-2xl border-t border-neutral-100 sticky bottom-0">
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                      <span className="text-sm text-neutral-600">End-to-end encrypted payment</span>
                    </div>
                  </div>
                </div>

                {/* Add CSS Animation */}
                <style>{`
                  @keyframes scale-in-center {
                    0% {
                      transform: scale(0.95);
                      opacity: 0;
                    }
                    100% {
                      transform: scale(1);
                      opacity: 1;
                    }
                  }
                  
                  .animate-in {
                    animation: fade-in 0.3s ease-out;
                  }
                  
                  @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}</style>
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
                {/* Tax removed (was GST 18%). If reintroduced later, add line back. */}
                <hr className="border-neutral-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-neutral-800">Total</span>
                  <span className="font-bold text-neutral-900">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddressId || !paymentMethod}
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
