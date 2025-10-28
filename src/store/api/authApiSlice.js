import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    registerB2B: builder.mutation({
      query: (userData) => ({
        url: '/users/register-b2b',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
    // Cart endpoints
    getCart: builder.query({
      query: () => ({
        url: '/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: '/cart/add',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    updateCartItem: builder.mutation({
      query: ({ itemId, ...updateData }) => ({
        url: `/cart/item/${itemId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Wishlist endpoints
    getWishlist: builder.query({
      query: () => ({
        url: '/users/wishlist',
        method: 'GET',
      }),
      providesTags: ['Wishlist'],
    }),
    
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/add/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/users/wishlist/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // Quote request endpoints (B2B)
    createQuoteRequest: builder.mutation({
      query: (quoteData) => ({
        url: '/users/quote-request',
        method: 'POST',
        body: quoteData,
      }),
      invalidatesTags: ['QuoteRequest'],
    }),
    
    getQuoteRequests: builder.query({
      query: (params = {}) => ({
        url: '/users/quote-requests',
        method: 'GET',
        params,
      }),
      providesTags: ['QuoteRequest'],
    }),
    
    getQuoteRequest: builder.query({
      query: (id) => ({
        url: `/users/quote-request/${id}`,
        method: 'GET',
      }),
      providesTags: ['QuoteRequest'],
    }),

    // Order endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),

    getUserOrders: builder.query({
      query: ({ page = 1, limit = 10, status = 'all' } = {}) => ({
        url: `/orders?page=${page}&limit=${limit}&status=${status}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),

    trackOrder: builder.query({
      query: (orderNumber) => ({
        url: `/orders/track/${orderNumber}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

        // Stripe payment endpoints - Temporarily commented out
    /*
    createStripePaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payments/stripe/create-payment-intent',
        method: 'POST',
        body: data,
      }),
    }),
    
    confirmStripePayment: builder.mutation({
      query: (data) => ({
        url: '/payments/stripe/confirm-payment',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    
    createStripeCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payments/stripe/create-checkout-session',
        method: 'POST',
        body: data,
      }),
    }),
    
    getStripeSession: builder.query({
      query: (sessionId) => ({
        url: `/payments/stripe/session/${sessionId}`,
        method: 'GET',
      }),
    }),
    */

    // Address management endpoints
    getAddresses: builder.query({
      query: () => ({
        url: '/users/addresses',
        method: 'GET',
      }),
      providesTags: ['Address'],
    }),

    addAddress: builder.mutation({
      query: (addressData) => ({
        url: '/users/addresses',
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),

    updateAddress: builder.mutation({
      query: ({ addressId, ...addressData }) => ({
        url: `/users/addresses/${addressId}`,
        method: 'PUT',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),

    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/users/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),

    setDefaultAddress: builder.mutation({
      query: (addressId) => ({
        url: `/users/addresses/${addressId}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterB2BMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCreateQuoteRequestMutation,
  useGetQuoteRequestsQuery,
  useGetQuoteRequestQuery,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useTrackOrderQuery,
  // Stripe payment hooks - Temporarily commented out
  // useCreateStripePaymentIntentMutation,
  // useConfirmStripePaymentMutation,
  // useCreateStripeCheckoutSessionMutation,
  // useGetStripeSessionQuery,
  // Address management hooks
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = authApiSlice;
