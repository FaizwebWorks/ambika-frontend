import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { notificationApiSlice } from './api/notificationApiSlice';
import authReducer from './slices/authSlice';

// Import API slices to activate them
import './api/adminApiSlice';
import './api/authApiSlice';
import './api/paymentApiSlice';
import './api/publicApiSlice';
import './api/settingsApiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these paths in state
        ignoredPaths: ['api.queries'],
      },
      // Disable immutability checks in production for performance
      immutableCheck: process.env.NODE_ENV === 'development',
    }).concat(apiSlice.middleware, notificationApiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development',
  // Preload state for better performance
  preloadedState: undefined,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
