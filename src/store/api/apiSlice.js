import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return '/api'; // Use Vite proxy in development
  }
  
  // In production, use the full backend URL
  return 'https://ambika-backend-weyi.onrender.com/api';
};

// Base API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if available
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Add Content-Type header for JSON requests
      headers.set('Content-Type', 'application/json');
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Category', 'Order', 'Cart', 'Wishlist', 'Dashboard', 'AdminProducts', 'AdminOrders', 'AdminCustomers', 'AdminCategories', 'Settings', 'AdminProfile', 'Subscription', 'SubscriptionPlans', 'SubscriptionStatus', 'PaymentHistory'],
  endpoints: () => ({}),
});
