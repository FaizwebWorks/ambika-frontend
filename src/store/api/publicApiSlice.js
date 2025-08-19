import { apiSlice } from './apiSlice';

export const publicApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public Categories API
    getCategories: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/categories?${searchParams.toString()}`;
      },
      providesTags: ['Category']
    }),

    // Public Products API
    getProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/products?${searchParams.toString()}`;
      },
      providesTags: ['Product']
    }),

    // Public Single Product API
    getPublicProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),

    // Products by Category API
    getProductsByCategory: builder.query({
      query: (categoryId, params = {}) => {
        const searchParams = new URLSearchParams({
          category: categoryId,
          ...params
        });
        return `/products?${searchParams.toString()}`;
      },
      providesTags: ['Product']
    })
  })
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetPublicProductByIdQuery,
  useGetProductsByCategoryQuery
} = publicApiSlice;
