import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, stripeConfig } from '../config/stripe';
import { Button } from './ui/button';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Payment form component
const StripePaymentForm = ({ 
  clientSecret, 
  orderId, 
  amount, 
  onSuccess, 
  onError,
  isLoading = false 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${stripeConfig.returnUrl}?orderId=${orderId}`,
      },
      redirect: 'if_required'
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      if (onError) {
        onError(error);
      }
      toast.error(error.message);
    } else {
      // Payment succeeded
      setIsProcessing(false);
      if (onSuccess) {
        onSuccess();
      }
      toast.success('Payment completed successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-neutral-50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-blue-600" />
          <h3 className="font-medium text-neutral-800">Payment Details</h3>
        </div>
        
        <PaymentElement 
          options={stripeConfig.paymentElementOptions}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-600" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || isLoading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock size={16} />
            Pay ₹{amount?.toLocaleString('en-IN')}
          </div>
        )}
      </Button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
        <Lock size={14} className="text-green-600" />
        Your payment information is secure and encrypted
      </div>
    </form>
  );
};

// Main Stripe payment component wrapper
const StripePayment = ({ 
  clientSecret, 
  orderId, 
  amount, 
  onSuccess, 
  onError,
  isLoading = false 
}) => {
  const [stripeInstance, setStripeInstance] = useState(null);

  useEffect(() => {
    stripePromise.then((stripe) => {
      setStripeInstance(stripe);
    });
  }, []);

  if (!clientSecret || !stripeInstance) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: stripeConfig.appearance,
  };

  return (
    <Elements stripe={stripeInstance} options={options}>
      <StripePaymentForm
        clientSecret={clientSecret}
        orderId={orderId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        isLoading={isLoading}
      />
    </Elements>
  );
};

export default StripePayment;
