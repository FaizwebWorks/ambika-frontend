import { apiSlice } from './apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
        }),
        verifyUPIPayment: builder.mutation({
            query: ({ orderId, paymentDetails }) => ({
                url: `/orders/${orderId}/verify-payment`,
                method: 'POST',
                body: paymentDetails,
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useVerifyUPIPaymentMutation,
} = orderApiSlice;