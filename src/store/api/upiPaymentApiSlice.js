import { apiSlice } from './apiSlice';

export const upiPaymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateUPIPayment: builder.mutation({
            query: (orderId) => ({
                url: `/upi-payments/generate/${orderId}`,
                method: 'GET',
            }),
        }),
        verifyUPIPayment: builder.mutation({
            query: (data) => ({
                url: '/upi-payments/verify',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGenerateUPIPaymentMutation,
    useVerifyUPIPaymentMutation,
} = upiPaymentApiSlice;