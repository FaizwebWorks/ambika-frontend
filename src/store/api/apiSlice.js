import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // Use proxy in development, full URL in production
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if available
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Product', 'Category', 'Order', 'Cart', 'Dashboard', 'AdminProducts', 'AdminOrders', 'AdminCustomers', 'AdminCategories'],
  endpoints: () => ({}),
});
