// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REGISTER_B2B: '/api/auth/register-b2b',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,
  
  // Cart
  CART: '/api/cart',
  CART_ADD: '/api/cart/add',
  CART_UPDATE: '/api/cart/update',
  CART_REMOVE: '/api/cart/remove',
  
  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_ADD: '/api/wishlist/add',
  WISHLIST_REMOVE: (id) => `/api/wishlist/remove/${id}`,
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id) => `/api/orders/${id}`,
  
  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_CUSTOMERS: '/api/admin/customers',
  
  // Payments
  PAYMENT_INTENT: '/api/payments/create-payment-intent',
  PAYMENT_CONFIRM: '/api/payments/confirm',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATIONS_MARK_READ: '/api/notifications/mark-read'
};

// Cache Keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: 'userProfile',
  CART: 'cart',
  WISHLIST: 'wishlist'
};

// App Configuration
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  CURRENCY: 'INR',
  LOCALE: 'en-IN'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_B2B: '/register-b2b',
  CATEGORIES: '/categories',
  PRODUCT_DETAILS: (id) => `/product/${id}`,
  PROFILE: '/profile',
  CART: '/cart',
  WISHLIST: '/wishlist',
  ABOUT: '/about',
  CONTACT: '/contact',
  QUOTE_REQUEST: '/quote-request',
  ORDER_SUMMARY: '/order-summary',
  ORDER_SUCCESS: '/order-success',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_NOTIFICATIONS: '/admin/notifications'
};

// Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const CUSTOMER_TYPES = {
  B2C: 'B2C',
  B2B: 'B2B'
};

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft'
};

// UI Constants
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

export const TOAST_POSITIONS = {
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size should not exceed ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Please select a valid image file (JPEG, PNG, WebP)'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logout successful!',
  PRODUCT_ADDED: 'Product added successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  PRODUCT_DELETED: 'Product deleted successfully!',
  CART_ADDED: 'Added to cart successfully!',
  CART_UPDATED: 'Cart updated successfully!',
  WISHLIST_ADDED: 'Added to wishlist!',
  WISHLIST_REMOVED: 'Removed from wishlist!',
  ORDER_PLACED: 'Order placed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  GSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
};

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    page: 1,
    limit: APP_CONFIG.ITEMS_PER_PAGE
  },
  USER: {
    customerType: CUSTOMER_TYPES.B2C,
    role: USER_ROLES.USER
  },
  PRODUCT: {
    status: PRODUCT_STATUS.DRAFT,
    featured: false,
    minOrderQuantity: 1
  }
};
