// Debounce function for search and input optimization
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Lazy loading helper
export const lazyLoad = (importFunc) => {
  return React.lazy(importFunc);
};

// Performance monitor
export const performanceMonitor = {
  mark: (name) => {
    if (performance && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },
  measure: (name) => {
    if (performance && performance.measure && performance.mark) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      } catch (e) {
        // Ignore if marks don't exist
      }
    }
  }
};

// Image optimization helper
export const optimizeImage = (url, width = 400, quality = 80) => {
  if (!url) return '';
  // Add image optimization parameters if using a service like Cloudinary
  if (url.includes('cloudinary')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  return url;
};

// Currency formatter (memoized)
export const formatCurrency = memoize((amount, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  }).format(amount);
});

// Date formatter (memoized)
export const formatDate = memoize((date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(new Date(date));
});

// Deep clone utility
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Validation helpers
export const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => /^[6-9]\d{9}$/.test(phone),
  password: (password) => password.length >= 8,
  required: (value) => value !== null && value !== undefined && value !== '',
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max
};

// API response helpers
export const apiHelpers = {
  handleResponse: (response) => {
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'API Error');
  },
  
  handleError: (error) => {
    console.error('API Error:', error);
    return {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: error.response?.status || 500
    };
  }
};

// Local storage helpers with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage:`, error);
      return false;
    }
  }
};
