import { Route, Routes } from 'react-router-dom';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminLayout from '../components/layouts/AdminLayout';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminUsers from '../pages/admin/AdminUsers';
import QuotationDetail from '../pages/admin/QuotationDetail';
import QuotationRequests from '../pages/admin/QuotationRequests';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProducts />} />
        <Route path="products/:id/edit" element={<AdminProducts />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="customers/:id" element={<AdminCustomers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/:id" element={<AdminCategories />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="quotations" element={<QuotationRequests />} />
        <Route path="quotations/:id" element={<QuotationDetail />} />
        <Route path="users" element={<AdminUsers />} />
        {/* <Route path="settings" element={<AdminSettings />} /> */}
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;