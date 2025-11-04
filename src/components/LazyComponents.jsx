import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react';

// Loading component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 size={32} className="animate-spin text-blue-600 mb-2 mx-auto" />
      <p className="text-neutral-600">{message}</p>
    </div>
  </div>
);

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600">Something went wrong loading this component.</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for lazy loading with error boundary
export const withLazyLoading = (LazyComponent, loadingMessage) => {
  return React.forwardRef((props, ref) => (
    <LazyErrorBoundary>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </LazyErrorBoundary>
  ));
};

// Lazy loaded pages
export const LazyHome = React.lazy(() => 
  import('../pages/Home').then(module => ({ default: module.default }))
);

export const LazyProductDetails = React.lazy(() => 
  import('../pages/ProductDetails').then(module => ({ default: module.default }))
);

export const LazyCategories = React.lazy(() => 
  import('../pages/Categories').then(module => ({ default: module.default }))
);

export const LazyProfile = React.lazy(() => 
  import('../pages/Profile').then(module => ({ default: module.default }))
);

export const LazyCart = React.lazy(() => 
  import('../pages/Cart').then(module => ({ default: module.default }))
);

export const LazyWishlist = React.lazy(() => 
  import('../pages/Wishlist').then(module => ({ default: module.default }))
);

export const LazyAbout = React.lazy(() => 
  import('../pages/About').then(module => ({ default: module.default }))
);

export const LazyContact = React.lazy(() => 
  import('../pages/Contact').then(module => ({ default: module.default }))
);

export const LazyQuoteRequest = React.lazy(() => 
  import('../pages/QuoteRequest').then(module => ({ default: module.default }))
);

export const LazyOrderSummary = React.lazy(() => 
  import('../pages/OrderSummary').then(module => ({ default: module.default }))
);

export const LazyOrderSuccess = React.lazy(() => 
  import('../pages/OrderSuccess').then(module => ({ default: module.default }))
);

export const LazyQuoteRequestSuccess = React.lazy(() => 
  import('../pages/QuoteRequestSuccess').then(module => ({ default: module.default }))
);

export const LazyTermsOfUse = React.lazy(() => 
  import('../pages/TermsOfUse').then(module => ({ default: module.default }))
);

export const LazyPrivacyPolicy = React.lazy(() => 
  import('../pages/PrivacyPolicy').then(module => ({ default: module.default }))
);

export const LazyForgotPassword = React.lazy(() => 
  import('../pages/ForgotPassword').then(module => ({ default: module.default }))
);

export const LazyResetPassword = React.lazy(() => 
  import('../pages/ResetPassword').then(module => ({ default: module.default }))
);

// Admin lazy components
export const LazyAdminDashboard = React.lazy(() => 
  import('../pages/admin/AdminDashboard').then(module => ({ default: module.default }))
);

export const LazyAdminProducts = React.lazy(() => 
  import('../pages/admin/AdminProducts').then(module => ({ default: module.default }))
);

export const LazyAdminOrders = React.lazy(() => 
  import('../pages/admin/AdminOrders').then(module => ({ default: module.default }))
);

export const LazyAdminOrderDetail = React.lazy(() => 
  import('../pages/admin/AdminOrderDetail').then(module => ({ default: module.default }))
);

export const LazyAdminCustomers = React.lazy(() => 
  import('../pages/admin/AdminCustomers').then(module => ({ default: module.default }))
);

export const LazyAdminCategories = React.lazy(() => 
  import('../pages/admin/AdminCategories').then(module => ({ default: module.default }))
);

export const LazyAdminUsers = React.lazy(() => 
  import('../pages/admin/AdminUsers').then(module => ({ default: module.default }))
);

export const LazyAdminSettings = React.lazy(() => 
  import('../pages/admin/AdminSettings').then(module => ({ default: module.default }))
);

export const LazyAdminNotifications = React.lazy(() => 
  import('../pages/admin/AdminNotifications').then(module => ({ default: module.default }))
);

export const LazyQuotationDetail = React.lazy(() => 
  import('../pages/admin/QuotationDetail').then(module => ({ default: module.default }))
);

// Wrap components with lazy loading
export const Home = withLazyLoading(LazyHome, 'Loading homepage...');
export const ProductDetails = withLazyLoading(LazyProductDetails, 'Loading product details...');
export const Categories = withLazyLoading(LazyCategories, 'Loading categories...');
export const Profile = withLazyLoading(LazyProfile, 'Loading profile...');
export const Cart = withLazyLoading(LazyCart, 'Loading cart...');
export const Wishlist = withLazyLoading(LazyWishlist, 'Loading wishlist...');
export const About = withLazyLoading(LazyAbout, 'Loading about page...');
export const Contact = withLazyLoading(LazyContact, 'Loading contact page...');
export const QuoteRequest = withLazyLoading(LazyQuoteRequest, 'Loading quote request...');
export const OrderSummary = withLazyLoading(LazyOrderSummary, 'Loading order summary...');
export const OrderSuccess = withLazyLoading(LazyOrderSuccess, 'Loading order confirmation...');
export const QuoteRequestSuccess = withLazyLoading(LazyQuoteRequestSuccess, 'Loading quote success...');
export const TermsOfUse = withLazyLoading(LazyTermsOfUse, 'Loading terms of use...');
export const PrivacyPolicy = withLazyLoading(LazyPrivacyPolicy, 'Loading privacy policy...');
export const ForgotPassword = withLazyLoading(LazyForgotPassword, 'Loading forgot password...');
export const ResetPassword = withLazyLoading(LazyResetPassword, 'Loading reset password...');

// Admin components
export const AdminDashboard = withLazyLoading(LazyAdminDashboard, 'Loading admin dashboard...');
export const AdminProducts = withLazyLoading(LazyAdminProducts, 'Loading products management...');
export const AdminOrders = withLazyLoading(LazyAdminOrders, 'Loading orders management...');
export const AdminOrderDetail = withLazyLoading(LazyAdminOrderDetail, 'Loading order details...');
export const AdminCustomers = withLazyLoading(LazyAdminCustomers, 'Loading customers management...');
export const AdminCategories = withLazyLoading(LazyAdminCategories, 'Loading categories management...');
export const AdminUsers = withLazyLoading(LazyAdminUsers, 'Loading users management...');
export const AdminSettings = withLazyLoading(LazyAdminSettings, 'Loading admin settings...');
export const AdminNotifications = withLazyLoading(LazyAdminNotifications, 'Loading notifications...');
export const QuotationDetail = withLazyLoading(LazyQuotationDetail, 'Loading quotation details...');
