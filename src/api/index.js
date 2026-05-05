import api from './client';

export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  requestOTP: (data) => api.post('/auth/otp/request/', data),
  verifyOTP: (data) => api.post('/auth/otp/verify/', data),
  changePassword: (data) => api.post('/auth/password/change/', data),
};

export const adminApi = {
  // Hospitals
  listHospitals: (params) => api.get('/user/hospitals/', { params }),
  createHospital: (data) => api.post('/user/hospitals/', data),
  updateHospital: (id, data) => api.patch(`/user/hospitals/${id}/`, data),
  deleteHospital: (id) => api.delete(`/user/hospitals/${id}/`),

  // Blood Banks
  listBloodBanks: (params) => api.get('/user/blood-banks/', { params }),
  createBloodBank: (data) => api.post('/user/blood-banks/', data),
  updateBloodBank: (id, data) => api.patch(`/user/blood-banks/${id}/`, data),
  deleteBloodBank: (id) => api.delete(`/user/blood-banks/${id}/`),

  // Users
  listUsers: (params) => api.get('/user/users/', { params }),
  createUser: (data) => api.post('/user/users/', data),
  updateUser: (id, data) => api.patch(`/user/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/user/users/${id}/`),
  
  // Profiles
  createProfile: (data) => api.post('/user/profiles/', data),

  // Stats
  getSystemStats: () => api.get('/user/system-stats/'),
};
