import api from './client';

/**
 * Inventory service
 * Handles all inventory-related API calls
 */
export const inventoryApi = {
  /**
   * List inventory items
   * @returns {Promise} API response
   */
  listInventory: () => api.get('/inventory/inventory/'),

  /**
   * Get inventory statistics
   * @returns {Promise} API response
   */
  getStats: () => api.get('/inventory/stats/'),

  /**
   * Get marketplace listings with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getMarketplace: (params) => api.get('/inventory/marketplace/', { params }),

  /**
   * Get marketplace locations
   * @returns {Promise} API response
   */
  getMarketplaceLocations: () => api.get('/inventory/marketplace/locations/'),

  /**
   * List donations
   * @returns {Promise} API response
   */
  listDonations: () => api.get('/inventory/donations/'),

  /**
   * Create a new donation
   * @param {Object} data - Donation data
   * @returns {Promise} API response
   */
  createDonation: (data) => api.post('/inventory/donations/', data),

  /**
   * Update stock item
   * @param {string|number} id - Stock item ID
   * @param {Object} data - Updated stock data
   * @returns {Promise} API response
   */
  updateStock: (id, data) => api.patch(`/inventory/inventory/${id}/`, data),

  /**
   * Create a new inventory item
   * @param {Object} data - Inventory data
   * @returns {Promise} API response
   */
  createInventory: (data) => api.post('/inventory/inventory/', data),

  /**
   * Bulk create inventory items
   * @param {Object} data - Bulk inventory data
   * @returns {Promise} API response
   */
  bulkCreateInventory: (data) => api.post('/inventory/inventory/bulk-create/', data),
};
