import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Fallback logic
  if (import.meta.env.DEV) {
    return '/api'; // Use Vite proxy in development
  }
  
  // Default production URL (update this when deploying)
  return 'https://ambika-e6if.onrender.com/api';
};

// Base API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers, { getState, endpoint, type }) => {
      // Add authorization token if available
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Don't set Content-Type for FormData endpoints (let browser handle it)
      // Check if this is a FormData request by checking if Content-Type is already removed
      const formDataEndpoints = ['createCategory', 'updateCategory', 'createProduct', 'updateProduct'];
      if (!headers.has('Content-Type') && !formDataEndpoints.includes(endpoint)) {
        headers.set('Content-Type', 'application/json');
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Category', 'Order', 'Cart', 'Wishlist', 'Dashboard', 'AdminProducts', 'AdminOrders', 'AdminCustomers', 'AdminCategories', 'Settings', 'AdminProfile', 'Subscription', 'SubscriptionPlans', 'SubscriptionStatus', 'PaymentHistory'],
  endpoints: () => ({}),
});
