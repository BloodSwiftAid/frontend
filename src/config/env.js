/**
 * Environment configuration
 * Centralized access to environment variables with validation
 */

/**
 * Get API base URL from environment variables
 * @returns {string} API base URL
 */
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
};

/**
 * Check if application is in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

/**
 * Check if application is in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = () => {
  return import.meta.env.PROD;
};

/**
 * Get application version
 * @returns {string} Application version
 */
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0';
};
