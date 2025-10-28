// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { stripePromise, stripeConfig } from '../config/stripe';
import { Clock } from 'lucide-react';
import { Button } from './ui/button';

// Payment form component - Currently Disabled
const StripePaymentForm = ({ 
  clientSecret, 
  orderId, 
  amount, 
  onSuccess, 
  onError,
  isLoading = false 
}) => {
  // Stripe functionality temporarily disabled
  return (
    <div className="space-y-6">
      {/* Unavailable Notice */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={24} className="text-orange-600" />
          <h3 className="font-semibold text-orange-800">Payment Gateway Maintenance</h3>
        </div>
        <p className="text-orange-700 mb-4">
          Our online payment system is currently undergoing maintenance to serve you better. 
          Please choose "Cash on Delivery" for now.
        </p>
        <div className="text-sm text-orange-600">
          • Credit/Debit Card payments temporarily unavailable
          <br />
          • UPI and Digital Wallet payments temporarily unavailable
          <br />
          • Cash on Delivery is available and working normally
        </div>
      </div>

      {/* Disabled Submit Button */}
      <Button
        disabled={true}
        className="w-full h-12 bg-gray-400 text-white cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Clock size={16} />
          Payment Gateway Currently Unavailable
        </div>
      </Button>

      {/* Alternative Payment Notice */}
      <div className="text-center text-sm text-neutral-600">
        <p>Please use Cash on Delivery option to complete your order</p>
      </div>
    </div>
  );
};

// Main Stripe payment component wrapper - Currently Disabled
const StripePayment = ({ 
  clientSecret, 
  orderId, 
  amount, 
  onSuccess, 
  onError,
  isLoading = false 
}) => {
  // Return maintenance notice instead of actual Stripe payment
  return (
    <StripePaymentForm
      clientSecret={clientSecret}
      orderId={orderId}
      amount={amount}
      onSuccess={onSuccess}
      onError={onError}
      isLoading={isLoading}
    />
  );

  // Original Stripe implementation commented out:
  /*
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
  */
};

export default StripePayment;
