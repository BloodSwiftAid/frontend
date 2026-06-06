import api from './client';

/**
 * Transaction service
 * Handles all transaction-related API calls
 */
export const transactionApi = {
  /**
   * List blood requests
   * @returns {Promise} API response
   */
  listRequests: () => api.get('/transaction/requests/'),

  /**
   * Get blood requests (alias for listRequests)
   * @returns {Promise} API response
   */
  getRequests: () => api.get('/transaction/requests/'),

  /**
   * Create a new blood request
   * @param {Object} data - Request data
   * @returns {Promise} API response
   */
  createRequest: (data) => api.post('/transaction/requests/', data),

  /**
   * Update blood request details
   * @param {string|number} id - Request ID
   * @param {Object} data - Updated request data
   * @returns {Promise} API response
   */
  updateRequest: (id, data) => api.patch(`/transaction/requests/${id}/`, data),

  /**
   * Approve a blood request
   * @param {string|number} id - Request ID
   * @returns {Promise} API response
   */
  approveRequest: (id) => api.post(`/transaction/requests/${id}/approve/`),

  /**
   * Reject a blood request
   * @param {string|number} id - Request ID
   * @returns {Promise} API response
   */
  rejectRequest: (id) => api.post(`/transaction/requests/${id}/reject/`),

  /**
   * Process a direct POS sale
   * @param {Object} data - Sale data
   * @returns {Promise} API response
   */
  directPosSale: (data) => api.post('/transaction/requests/pos-sale/', data),

  /**
   * Process bulk POS sales
   * @param {Object} data - Bulk sale data
   * @returns {Promise} API response
   */
  bulkPosSale: (data) => api.post('/transaction/requests/bulk-pos-sale/', data),

  /**
   * Bulk create requests
   * @param {Object} data - Bulk request data
   * @returns {Promise} API response
   */
  bulkCreate: (data) => api.post('/transaction/requests/bulk-create/', data),

  /**
   * Get revenue statistics
   * @returns {Promise} API response
   */
  getRevenueStats: () => api.get('/transaction/revenue-stats/'),

  /**
   * Get live activity feed
   * @returns {Promise} API response
   */
  getLiveActivity: () => api.get('/transaction/live-activity/'),
};
