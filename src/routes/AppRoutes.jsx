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
  Cart,
  Categories,
  Contact,
  Home,
  OrderSuccess,
  OrderSummary,
  ProductDetails,
  Profile,
  QuoteRequest,
  QuoteRequestSuccess,
  Wishlist
} from "../components/LazyComponents.jsx";

const AppRoutes = () => (
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
      </Route>
    </Routes>
  </>
);

export default AppRoutes;