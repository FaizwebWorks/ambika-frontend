import { apiSlice } from './apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all settings
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    
    // Update general settings
    updateGeneralSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/general',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Update notification settings
    updateNotificationSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/notifications',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Update security settings
    updateSecuritySettings: builder.mutation({
      query: (data) => ({
        url: '/settings/security',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Update system settings
    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/system',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Update business settings
    updateBusinessSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/business',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Update payment visibility settings (UPI / COD)
    updatePaymentSettings: builder.mutation({
      query: (data) => ({
        url: '/settings/payments',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Get admin profile
    getAdminProfile: builder.query({
      query: () => '/settings/profile',
      providesTags: ['AdminProfile'],
    }),
    
    // Update admin profile
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: '/settings/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['AdminProfile'],
    }),
    
    // Upload company logo
    uploadCompanyLogo: builder.mutation({
      query: (formData) => ({
        url: '/settings/upload-logo',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // Reset settings
    resetSettings: builder.mutation({
      query: () => ({
        url: '/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useUpdatePaymentSettingsMutation,
  useUpdateNotificationSettingsMutation,
  useUpdateSecuritySettingsMutation,
  useUpdateSystemSettingsMutation,
  useUpdateBusinessSettingsMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUploadCompanyLogoMutation,
  useResetSettingsMutation,
} = settingsApiSlice;
