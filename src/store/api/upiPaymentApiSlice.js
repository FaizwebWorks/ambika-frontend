import { apiSlice } from './apiSlice';

export const upiPaymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateUPIPayment: builder.mutation({
            query: (orderId) => ({
                url: `/upi-payments/generate/${orderId}`,
                method: 'GET',
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to generate UPI payment');
                }
                return response.data;
            },
        }),
        
        verifyUPIPayment: builder.mutation({
            query: (data) => ({
                url: '/upi-payments/verify',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Payment verification failed');
                }
                return {
                    success: true,
                    order: response.data.order,
                    payment: response.data.payment
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Optionally update order cache here if needed
                } catch (err) {
                    console.error('Payment verification error:', err);
                }
            },
        }),

        generateCollectQR: builder.mutation({
            query: (data) => ({
                url: '/upi-payments/collect-qr',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to generate collect QR');
                }
                return response.data;
            },
        }),

        checkUPIStatus: builder.mutation({
            query: ({ orderId, transactionId }) => ({
                url: '/upi-payments/status',
                method: 'POST',
                body: { orderId, transactionId }
            }),
            transformResponse: (response) => {
                if (!response.success) {
                    throw new Error(response.message || 'Failed to check payment status');
                }
                return response.data;
            },
        }),
    }),
});

export const {
    useGenerateUPIPaymentMutation,
    useVerifyUPIPaymentMutation,
    useCheckUPIStatusMutation,
    useGenerateCollectQRMutation,
} = upiPaymentApiSlice;