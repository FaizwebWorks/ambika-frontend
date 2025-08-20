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
} = authApiSlice;
