import { apiSlice } from './apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get subscription plans
    getSubscriptionPlans: builder.query({
      query: () => '/payments/plans',
      providesTags: ['SubscriptionPlans'],
    }),
    
    // Get current subscription
    getCurrentSubscription: builder.query({
      query: () => '/payments/subscription',
      providesTags: ['Subscription'],
    }),
    
    // Check subscription status
    checkSubscriptionStatus: builder.query({
      query: () => '/payments/subscription/status',
      providesTags: ['SubscriptionStatus'],
    }),
    
    // Create subscription order
    createSubscriptionOrder: builder.mutation({
      query: (data) => ({
        url: '/payments/subscription/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'SubscriptionStatus'],
    }),
    
    // Verify payment
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/subscription/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription', 'SubscriptionStatus'],
    }),
    
    // Cancel subscription
    cancelSubscription: builder.mutation({
      query: () => ({
        url: '/payments/subscription/cancel',
        method: 'PUT',
      }),
      invalidatesTags: ['Subscription', 'SubscriptionStatus'],
    }),
    
    // Get payment history
    getPaymentHistory: builder.query({
      query: () => '/payments/history',
      providesTags: ['PaymentHistory'],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetCurrentSubscriptionQuery,
  useCheckSubscriptionStatusQuery,
  useCreateSubscriptionOrderMutation,
  useVerifyPaymentMutation,
  useCancelSubscriptionMutation,
  useGetPaymentHistoryQuery,
} = paymentApiSlice;
