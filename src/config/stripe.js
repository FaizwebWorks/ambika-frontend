import { loadStripe } from '@stripe/stripe-js';

// This is your Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

// Validate environment variables in development
if (import.meta.env.DEV && stripePublishableKey === 'pk_test_placeholder') {
  console.warn('⚠️  VITE_STRIPE_PUBLISHABLE_KEY not found in .env file. Using placeholder.');
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Stripe configuration
export const stripeConfig = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb', // Blue-600
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
      borderRadius: '8px',
    },
  },
  
  // Payment element options
  paymentElementOptions: {
    layout: 'tabs',
  },
  
  // Success and error URLs
  returnUrl: window.location.origin + '/order-success',
};
