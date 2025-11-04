import { apiSlice } from './apiSlice';

export const quotationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createQuotationRequest: builder.mutation({
      query: (data) => ({
        url: '/quotations/request',
        method: 'POST',
        body: data,
      }),
    }),
    
    getQuotationRequests: builder.query({
      query: () => '/quotations/my-requests',
      providesTags: ['Quotations'],
    }),
    
    // Admin endpoints
    getAllQuotationRequests: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params);
        return `/quotations/admin/requests?${searchParams.toString()}`;
      },
      providesTags: ['AdminQuotations'],
    }),
    
    respondToQuotation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quotations/admin/respond/${id}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['AdminQuotations', 'Quotations'],
    }),
    
    getQuotationById: builder.query({
      query: (id) => `/quotations/admin/requests/${id}`,
      providesTags: (result, error, id) => [{ type: 'AdminQuotations', id }],
    }),
  }),
});

export const {
  useCreateQuotationRequestMutation,
  useGetQuotationRequestsQuery,
  useGetAllQuotationRequestsQuery,
  useRespondToQuotationMutation,
  useGetQuotationByIdQuery,
} = quotationApiSlice;