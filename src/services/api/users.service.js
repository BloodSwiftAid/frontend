import api from './client';

/**
 * Users service
 * Handles all user-related API calls
 */
export const usersApi = {
  /**
   * List staff members
   * @returns {Promise} API response
   */
  listStaff: () => api.get('/user/staff/'),

  /**
   * Get staff members (alias for listStaff)
   * @returns {Promise} API response
   */
  getStaff: () => api.get('/user/staff/'),

  /**
   * Create a new staff member
   * @param {Object} data - Staff data
   * @returns {Promise} API response
   */
  createStaff: (data) => api.post('/user/staff/', data),

  /**
   * Update staff member details
   * @param {string|number} id - Staff ID
   * @param {Object} data - Updated staff data
   * @returns {Promise} API response
   */
  updateStaff: (id, data) => api.patch(`/user/staff/${id}/`, data),

  /**
   * Delete a staff member
   * @param {string|number} id - Staff ID
   * @returns {Promise} API response
   */
  deleteStaff: (id) => api.delete(`/user/staff/${id}/`),

  /**
   * Toggle staff active status
   * @param {string|number} id - Staff ID
   * @returns {Promise} API response
   */
  toggleStaffActive: (id) => api.post(`/user/staff/${id}/toggle-active/`),

  /**
   * Toggle staff verified status
   * @param {string|number} id - Staff ID
   * @returns {Promise} API response
   */
  toggleStaffVerified: (id) => api.post(`/user/staff/${id}/toggle-verified/`),

  /**
   * Reset staff password
   * @param {string|number} id - Staff ID
   * @param {string} password - New password
   * @returns {Promise} API response
   */
  resetStaffPassword: (id, password) => api.post(`/user/staff/${id}/reset-password/`, { password }),

  /**
   * Get current user information
   * @returns {Promise} API response
   */
  getMe: () => api.get('/user/me/'),

  /**
   * Update current user information
   * @param {Object} data - Updated user data
   * @returns {Promise} API response
   */
  updateMe: (data) => api.patch('/user/me/', data),
};
