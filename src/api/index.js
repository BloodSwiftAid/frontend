import api from './client';

export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  requestOTP: (data) => api.post('/auth/otp/request/', data),
  verifyOTP: (data) => api.post('/auth/otp/verify/', data),
  verifyAccount: (data) => api.post('/auth/verify-account/', data),
  changePassword: (data) => api.post('/auth/password/change/', data),
};

export const adminApi = {
  // Hospitals
  listHospitals: (params) => api.get('/user/hospitals/', { params }),
  createHospital: (data) => api.post('/user/hospitals/', data),
  updateHospital: (id, data) => api.patch(`/user/hospitals/${id}/`, data),
  deleteHospital: (id) => api.delete(`/user/hospitals/${id}/`),
  toggleHospitalActive: (id) => api.post(`/user/hospitals/${id}/toggle-active/`),
  toggleHospitalVerified: (id) => api.post(`/user/hospitals/${id}/toggle-verified/`),

  // Blood Banks
  listBloodBanks: (params) => api.get('/user/blood-banks/', { params }),
  createBloodBank: (data) => api.post('/user/blood-banks/', data),
  updateBloodBank: (id, data) => api.patch(`/user/blood-banks/${id}/`, data),
  deleteBloodBank: (id) => api.delete(`/user/blood-banks/${id}/`),
  toggleBloodBankActive: (id) => api.post(`/user/blood-banks/${id}/toggle-active/`),
  toggleBloodBankVerified: (id) => api.post(`/user/blood-banks/${id}/toggle-verified/`),

  // Users
  listUsers: (params) => api.get('/user/users/', { params }),
  createUser: (data) => api.post('/user/users/', data),
  updateUser: (id, data) => api.patch(`/user/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/user/users/${id}/`),
  toggleUserActive: (id) => api.post(`/user/users/${id}/toggle-active/`),
  toggleUserVerified: (id) => api.post(`/user/users/${id}/toggle-verified/`),
  
  // Profiles
  createProfile: (data) => api.post('/user/profiles/', data),

  // Blood Types
  listBloodTypes: (params) => api.get('/inventory/blood-types/', { params }),
  updateBloodType: (id, data) => api.patch(`/inventory/blood-types/${id}/`, data),
  createBloodType: (data) => api.post('/inventory/blood-types/', data),

  // Stats
  getSystemStats: () => api.get('/user/system-stats/'),
  getInventoryStats: () => api.get('/inventory/stats/'),
  getBloodTypeBreakdown: (bloodGroup) => api.get('/inventory/blood-type-breakdown/', { params: { blood_group: bloodGroup } }),
  getBloodBankInventory: (bloodBankId) => api.get('/inventory/inventory/', { params: { blood_bank_id: bloodBankId } }),
  
  // Global Config
  getGlobalConfig: () => api.get('/user/global-config/'),
  updateGlobalConfig: (data) => api.post('/user/global-config/', data),
};

export const usersApi = {
  listStaff: () => api.get('/user/staff/'),
  getStaff: () => api.get('/user/staff/'), // Alias for component compatibility
  createStaff: (data) => api.post('/user/staff/', data),
  updateStaff: (id, data) => api.patch(`/user/staff/${id}/`, data),
  deleteStaff: (id) => api.delete(`/user/staff/${id}/`),
  toggleStaffActive: (id) => api.post(`/user/staff/${id}/toggle-active/`),
  toggleStaffVerified: (id) => api.post(`/user/staff/${id}/toggle-verified/`),
  resetStaffPassword: (id, password) => api.post(`/user/staff/${id}/reset-password/`, { password }),
  getMe: () => api.get('/user/me/'),
  updateMe: (data) => api.patch('/user/me/', data),
};

export const inventoryApi = {
  listInventory: () => api.get('/inventory/inventory/'),
  getStats: () => api.get('/inventory/stats/'),
  getMarketplace: (params) => api.get('/inventory/marketplace/', { params }),
  getMarketplaceLocations: () => api.get('/inventory/marketplace/locations/'),
  listDonations: () => api.get('/inventory/donations/'),
  createDonation: (data) => api.post('/inventory/donations/', data),
  updateStock: (id, data) => api.patch(`/inventory/inventory/${id}/`, data),
  createInventory: (data) => api.post('/inventory/inventory/', data),
  bulkCreateInventory: (data) => api.post('/inventory/inventory/bulk-create/', data),
};

export const transactionApi = {
  listRequests: () => api.get('/transaction/requests/'),
  getRequests: () => api.get('/transaction/requests/'), // Alias for component compatibility
  createRequest: (data) => api.post('/transaction/requests/', data),
  updateRequest: (id, data) => api.patch(`/transaction/requests/${id}/`, data),
  approveRequest: (id) => api.post(`/transaction/requests/${id}/approve/`),
  rejectRequest: (id) => api.post(`/transaction/requests/${id}/reject/`),
  directPosSale: (data) => api.post('/transaction/requests/pos-sale/', data),
  bulkPosSale: (data) => api.post('/transaction/requests/bulk-pos-sale/', data),
  bulkCreate: (data) => api.post('/transaction/requests/bulk-create/', data),
  getRevenueStats: () => api.get('/transaction/revenue-stats/'),
  getLiveActivity: () => api.get('/transaction/live-activity/'),
};

export const paymentApi = {
  initialize: (data) => api.post('/payment/payments/initialize/', data),
  verify: (data) => api.post('/payment/payments/verify/', data),
  listPayments: () => api.get('/payment/payments/'),
  listPayouts: () => api.get('/payment/payouts/'),
  createPayout: (data) => api.post('/payment/payouts/', data),
  listBankDetails: () => api.get('/payment/bank-details/'),
  createBankDetail: (data) => api.post('/payment/bank-details/', data),
  deleteBankDetail: (id) => api.delete(`/payment/bank-details/${id}/`),
};
