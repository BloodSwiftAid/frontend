import api from './client';

/**
 * Admin service
 * Handles all admin-related API calls
 */
export const adminApi = {
  // Hospitals
  /**
   * List hospitals with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  listHospitals: (params) => api.get('/user/hospitals/', { params }),

  /**
   * Create a new hospital
   * @param {Object} data - Hospital data
   * @returns {Promise} API response
   */
  createHospital: (data) => api.post('/user/hospitals/', data),

  /**
   * Update hospital details
   * @param {string|number} id - Hospital ID
   * @param {Object} data - Updated hospital data
   * @returns {Promise} API response
   */
  updateHospital: (id, data) => api.patch(`/user/hospitals/${id}/`, data),

  /**
   * Delete a hospital
   * @param {string|number} id - Hospital ID
   * @returns {Promise} API response
   */
  deleteHospital: (id) => api.delete(`/user/hospitals/${id}/`),

  /**
   * Toggle hospital active status
   * @param {string|number} id - Hospital ID
   * @returns {Promise} API response
   */
  toggleHospitalActive: (id) => api.post(`/user/hospitals/${id}/toggle-active/`),

  /**
   * Toggle hospital verified status
   * @param {string|number} id - Hospital ID
   * @returns {Promise} API response
   */
  toggleHospitalVerified: (id) => api.post(`/user/hospitals/${id}/toggle-verified/`),

  // Blood Banks
  /**
   * List blood banks with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  listBloodBanks: (params) => api.get('/user/blood-banks/', { params }),

  /**
   * Create a new blood bank
   * @param {Object} data - Blood bank data
   * @returns {Promise} API response
   */
  createBloodBank: (data) => api.post('/user/blood-banks/', data),

  /**
   * Update blood bank details
   * @param {string|number} id - Blood bank ID
   * @param {Object} data - Updated blood bank data
   * @returns {Promise} API response
   */
  updateBloodBank: (id, data) => api.patch(`/user/blood-banks/${id}/`, data),

  /**
   * Delete a blood bank
   * @param {string|number} id - Blood bank ID
   * @returns {Promise} API response
   */
  deleteBloodBank: (id) => api.delete(`/user/blood-banks/${id}/`),

  /**
   * Toggle blood bank active status
   * @param {string|number} id - Blood bank ID
   * @returns {Promise} API response
   */
  toggleBloodBankActive: (id) => api.post(`/user/blood-banks/${id}/toggle-active/`),

  /**
   * Toggle blood bank verified status
   * @param {string|number} id - Blood bank ID
   * @returns {Promise} API response
   */
  toggleBloodBankVerified: (id) => api.post(`/user/blood-banks/${id}/toggle-verified/`),

  // Users
  /**
   * List users with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  listUsers: (params) => api.get('/user/users/', { params }),

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise} API response
   */
  createUser: (data) => api.post('/user/users/', data),

  /**
   * Update user details
   * @param {string|number} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise} API response
   */
  updateUser: (id, data) => api.patch(`/user/users/${id}/`, data),

  /**
   * Delete a user
   * @param {string|number} id - User ID
   * @returns {Promise} API response
   */
  deleteUser: (id) => api.delete(`/user/users/${id}/`),

  /**
   * Toggle user active status
   * @param {string|number} id - User ID
   * @returns {Promise} API response
   */
  toggleUserActive: (id) => api.post(`/user/users/${id}/toggle-active/`),

  /**
   * Toggle user verified status
   * @param {string|number} id - User ID
   * @returns {Promise} API response
   */
  toggleUserVerified: (id) => api.post(`/user/users/${id}/toggle-verified/`),
  
  // Profiles
  /**
   * Create a user profile
   * @param {Object} data - Profile data
   * @returns {Promise} API response
   */
  createProfile: (data) => api.post('/user/profiles/', data),

  // Blood Types
  /**
   * List blood types with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  listBloodTypes: (params) => api.get('/inventory/blood-types/', { params }),

  /**
   * Update blood type details
   * @param {string|number} id - Blood type ID
   * @param {Object} data - Updated blood type data
   * @returns {Promise} API response
   */
  updateBloodType: (id, data) => api.patch(`/inventory/blood-types/${id}/`, data),

  /**
   * Create a new blood type
   * @param {Object} data - Blood type data
   * @returns {Promise} API response
   */
  createBloodType: (data) => api.post('/inventory/blood-types/', data),

  // Stats
  /**
   * Get system statistics
   * @returns {Promise} API response
   */
  getSystemStats: () => api.get('/user/system-stats/'),

  /**
   * Get inventory statistics
   * @returns {Promise} API response
   */
  getInventoryStats: () => api.get('/inventory/stats/'),

  /**
   * Get blood type breakdown
   * @param {string} bloodGroup - Blood group to filter
   * @returns {Promise} API response
   */
  getBloodTypeBreakdown: (bloodGroup) => api.get('/inventory/blood-type-breakdown/', { params: { blood_group: bloodGroup } }),

  /**
   * Get blood bank inventory
   * @param {string|number} bloodBankId - Blood bank ID
   * @returns {Promise} API response
   */
  getBloodBankInventory: (bloodBankId) => api.get('/inventory/inventory/', { params: { blood_bank_id: bloodBankId } }),
  
  // Global Config
  /**
   * Get global configuration
   * @returns {Promise} API response
   */
  getGlobalConfig: () => api.get('/user/global-config/'),

  /**
   * Update global configuration
   * @param {Object} data - Configuration data
   * @returns {Promise} API response
   */
  updateGlobalConfig: (data) => api.post('/user/global-config/', data),

  // Enquiries
  /**
   * List enquiries with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  listEnquiries: (params) => api.get('/user/enquiries/', { params }),

  /**
   * Update enquiry details
   * @param {string|number} id - Enquiry ID
   * @param {Object} data - Updated enquiry data
   * @returns {Promise} API response
   */
  updateEnquiry: (id, data) => api.patch(`/user/enquiries/${id}/`, data),

  /**
   * Delete an enquiry
   * @param {string|number} id - Enquiry ID
   * @returns {Promise} API response
   */
  deleteEnquiry: (id) => api.delete(`/user/enquiries/${id}/`),
};
