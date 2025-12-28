import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";

// Import non-lazy components (essential for initial load)
import AdminLayout from "../components/admin/AdminLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterB2B from "../pages/RegisterB2B";

// Import lazy components
import {
  About,
  AdminCategories,
  AdminCustomers,
  AdminDashboard,
  AdminNotifications,
  AdminOrderDetail,
  AdminOrders,
  AdminProducts,
  AdminSettings,
  AdminUsers,
  AdminPayments,
  Cart,
  Categories,
  Contact,
  ForgotPassword,
  Home,
  OrderSuccess,
  OrderSummary,
  PrivacyPolicy,
  ProductDetails,
  Profile,
  QuotationDetail,
  QuoteRequest,
  QuoteRequestSuccess,
  ResetPassword,
  TermsOfUse,
  Wishlist
} from "../components/LazyComponents.jsx";
import { AlertTriangle } from "lucide-react";

const isSiteDisabled = false;

const SiteDisabled = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 via-blue-50 to-neutral-100 px-4">
    
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center">
      
      {/* Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <AlertTriangle className="h-8 w-8 text-yellow-600" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-800">
        Website Temporarily Unavailable
      </h1>

      {/* Divider */}
      <div className="w-16 h-1 bg-blue-600 mx-auto my-6 rounded-full" />

      {/* Message */}
      <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
        The client hasn’t made the full payment yet, so the website is temporarily down.
        <br className="hidden sm:block" />
        Please check back again soon.
      </p>

      {/* Badge */}
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
        🔒 Service paused due to pending payment
      </div>

    </div>
  </div>
);

const AppRoutes = () => {

  if (isSiteDisabled) {
    return <SiteDisabled />;
  }

  return (

    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register-b2b" element={<RegisterB2B />} />
          <Route path="categories" element={<Categories />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms-of-use" element={<TermsOfUse />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="quote-request" element={
            <ProtectedRoute>
              <QuoteRequest />
            </ProtectedRoute>
          } />
          <Route path="quote-request-success" element={
            <ProtectedRoute>
              <QuoteRequestSuccess />
            </ProtectedRoute>
          } />
          <Route path="order-summary" element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          } />
          <Route path="order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
        </Route>

        {/* Password Reset Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="quotations/:id" element={<QuotationDetail />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;