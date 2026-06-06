import api from './client';

/**
 * Authentication service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Login user with credentials
   * @param {Object} data - Login credentials
   * @param {string} data.email - User email
   * @param {string} data.password - User password
   * @returns {Promise} API response
   */
  login: (data) => api.post('/auth/login/', data),

  /**
   * Logout current user
   * @returns {Promise} API response
   */
  logout: () => api.post('/auth/logout/'),

  /**
   * Request OTP for password reset
   * @param {Object} data - OTP request data
   * @returns {Promise} API response
   */
  requestOTP: (data) => api.post('/auth/otp/request/', data),

  /**
   * Verify OTP code
   * @param {Object} data - OTP verification data
   * @returns {Promise} API response
   */
  verifyOTP: (data) => api.post('/auth/otp/verify/', data),

  /**
   * Verify user account
   * @param {Object} data - Account verification data
   * @returns {Promise} API response
   */
  verifyAccount: (data) => api.post('/auth/verify-account/', data),

  /**
   * Change user password
   * @param {Object} data - Password change data
   * @returns {Promise} API response
   */
  changePassword: (data) => api.post('/auth/password/change/', data),
};
