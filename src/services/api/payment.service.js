import api from './client';

/**
 * Payment service
 * Handles all payment-related API calls
 */
export const paymentApi = {
  /**
   * Initialize a payment
   * @param {Object} data - Payment initialization data
   * @returns {Promise} API response
   */
  initialize: (data) => api.post('/payment/payments/initialize/', data),

  /**
   * Verify a payment
   * @param {Object} data - Payment verification data
   * @returns {Promise} API response
   */
  verify: (data) => api.post('/payment/payments/verify/', data),

  /**
   * List payments
   * @returns {Promise} API response
   */
  listPayments: () => api.get('/payment/payments/'),

  /**
   * List payouts
   * @returns {Promise} API response
   */
  listPayouts: () => api.get('/payment/payouts/'),

  /**
   * Create a new payout
   * @param {Object} data - Payout data
   * @returns {Promise} API response
   */
  createPayout: (data) => api.post('/payment/payouts/', data),

  /**
   * List bank details
   * @returns {Promise} API response
   */
  listBankDetails: () => api.get('/payment/bank-details/'),

  /**
   * Create bank details
   * @param {Object} data - Bank details data
   * @returns {Promise} API response
   */
  createBankDetail: (data) => api.post('/payment/bank-details/', data),

  /**
   * Delete bank details
   * @param {string|number} id - Bank detail ID
   * @returns {Promise} API response
   */
  deleteBankDetail: (id) => api.delete(`/payment/bank-details/${id}/`),
};
