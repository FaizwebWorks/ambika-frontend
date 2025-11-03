import { api } from '../api/apiSlice';

export const quotationApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createQuotationRequest: builder.mutation({
      query: (data) => ({
        url: '/quotations',
        method: 'POST',
        body: data,
      }),
    }),
    
    getQuotationRequests: builder.query({
      query: () => '/quotations',
      providesTags: ['Quotations'],
    }),
    
    // Admin endpoints
    getAllQuotationRequests: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(params);
        return `/admin/quotations?${searchParams.toString()}`;
      },
      providesTags: ['AdminQuotations'],
    }),
    
    respondToQuotation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/quotations/${id}/respond`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminQuotations', 'Quotations'],
    }),
  }),
});

export const {
  useCreateQuotationRequestMutation,
  useGetQuotationRequestsQuery,
  useGetAllQuotationRequestsQuery,
  useRespondToQuotationMutation,
} = quotationApiSlice;