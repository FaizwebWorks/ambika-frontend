import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard APIs
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Dashboard']
    }),
    
    // Products APIs
    getAdminProducts: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/admin/products?${searchParams.toString()}`;
      },
      providesTags: ['AdminProducts']
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),

    createProduct: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'images' && data[key] && data[key].length > 0) {
            // Handle multiple images
            Array.from(data[key]).forEach(image => {
              formData.append('images', image);
            });
          } else if (key === 'tags' && Array.isArray(data[key])) {
            formData.append(key, data[key].join(','));
          } else if (key === 'features' && Array.isArray(data[key])) {
            formData.append(key, data[key].join('\n'));
          } else if (key === 'specifications' && typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else if (data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        return {
          url: '/products',
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['AdminProducts', 'Dashboard', 'Products']
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'images' && data[key] && data[key].length > 0) {
            // Handle multiple images
            Array.from(data[key]).forEach(image => {
              formData.append('images', image);
            });
          } else if (key === 'removeImages' && Array.isArray(data[key])) {
            data[key].forEach(url => formData.append('removeImages', url));
          } else if (key === 'tags' && Array.isArray(data[key])) {
            formData.append(key, data[key].join(','));
          } else if (key === 'features' && Array.isArray(data[key])) {
            formData.append(key, data[key].join('\n'));
          } else if (key === 'specifications' && typeof data[key] === 'object') {
            formData.append(key, JSON.stringify(data[key]));
          } else if (data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        return {
          url: `/products/${id}`,
          method: 'PUT',
          body: formData
        };
      },
      invalidatesTags: ['AdminProducts', 'Dashboard', 'Products']
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminProducts', 'Dashboard', 'Products']
    }),

    bulkUpdateProducts: builder.mutation({
      query: (data) => ({
        url: '/admin/products/bulk',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['AdminProducts', 'Dashboard']
    }),

    // Orders APIs
    getAdminOrders: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/admin/orders?${searchParams.toString()}`;
      },
      providesTags: ['AdminOrders']
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['AdminOrders', 'Dashboard']
    }),

    // Customers APIs
    getAdminCustomers: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/admin/customers?${searchParams.toString()}`;
      },
      providesTags: ['AdminCustomers']
    }),

    getCustomerById: builder.query({
      query: (id) => `/admin/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }]
    }),

    approveCustomer: builder.mutation({
      query: (customerId) => ({
        url: `/admin/customers/${customerId}/approve`,
        method: 'PUT'
      }),
      invalidatesTags: ['AdminCustomers', 'Customer', 'Dashboard']
    }),

    rejectCustomer: builder.mutation({
      query: ({ customerId, reason }) => ({
        url: `/admin/customers/${customerId}/reject`,
        method: 'PUT',
        body: { reason }
      }),
      invalidatesTags: ['AdminCustomers', 'Customer', 'Dashboard']
    }),

    // Categories APIs
    getAdminCategories: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/categories?${searchParams.toString()}`;
      },
      providesTags: ['AdminCategories']
    }),

    getCategoryById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }]
    }),

    createCategory: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key]) {
            formData.append('image', data[key]);
          } else if (data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        return {
          url: '/categories',
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['AdminCategories', 'Category']
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (key === 'image' && data[key]) {
            formData.append('image', data[key]);
          } else if (data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        return {
          url: `/categories/${id}`,
          method: 'PUT',
          body: formData
        };
      },
      invalidatesTags: ['AdminCategories', 'Category']
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminCategories', 'Category']
    }),

    bulkUpdateCategories: builder.mutation({
      query: (data) => ({
        url: '/categories/bulk',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['AdminCategories']
    }),

    // Export APIs
    exportData: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/admin/export?${searchParams.toString()}`;
      }
    }),

    // User Management APIs
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== '') {
            searchParams.append(key, params[key]);
          }
        });
        return `/admin/users?${searchParams.toString()}`;
      },
      providesTags: ['AdminUsers']
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role }
      }),
      invalidatesTags: ['AdminUsers', 'Dashboard']
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['AdminUsers', 'Dashboard']
    })
  })
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkUpdateProductsMutation,
  useGetAdminCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkUpdateCategoriesMutation,
  useGetAdminCustomersQuery,
  useGetCustomerByIdQuery,
  useApproveCustomerMutation,
  useRejectCustomerMutation,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation
} = adminApiSlice;
