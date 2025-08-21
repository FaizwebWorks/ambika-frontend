import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/notifications`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const notificationApiSlice = createApi({
  reducerPath: 'notificationApi',
  baseQuery,
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query({
      query: ({ filter = 'all', search = '', page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => ({
        url: '/',
        params: { filter, search, page, limit, sortBy, sortOrder }
      }),
      providesTags: ['Notification'],
    }),

    // Get notification statistics
    getNotificationStats: builder.query({
      query: () => '/stats',
      providesTags: ['Notification'],
    }),

    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/mark-all-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Bulk delete notifications
    bulkDeleteNotifications: builder.mutation({
      query: (ids) => ({
        url: '/bulk-delete',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useBulkDeleteNotificationsMutation,
} = notificationApiSlice;
