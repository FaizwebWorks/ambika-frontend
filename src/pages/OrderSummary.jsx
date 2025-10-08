import {
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    Package,
    Shield,
    Truck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InlineAddressManager from '../components/InlineAddressManager';
import StripePayment from '../components/StripePayment';
import { Button } from '../components/ui/button';
import {
    useAddAddressMutation,
    useClearCartMutation,
    useCreateOrderMutation,
    useCreateStripeCheckoutSessionMutation,
    useCreateStripePaymentIntentMutation,
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
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const [createStripeCheckoutSession] = useCreateStripeCheckoutSessionMutation();
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
    console.log('Cart Response:', cartResponse);
    console.log('Cart Items:', cartItems);
    
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
        // Clear cart after successful order placement
        await clearCart();
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
    // Clear cart after successful Stripe payment
    clearCart();
    navigate(`/order-success?orderId=${currentOrderId}&total=${total}`);
  };

  const handleStripePaymentError = (error) => {
    console.error('Stripe payment error:', error);
    setIsProcessing(false);
    toast.error('Payment failed. Please try again.');
  };
  
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
