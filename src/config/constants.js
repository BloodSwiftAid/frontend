/**
 * Application constants
 * Centralized configuration values used throughout the application
 */

/**
 * User roles
 */
export const USER_ROLES = {
  INTERNAL_ADMIN: 'INTERNAL_ADMIN',
  BLOODBANK_ADMIN: 'BLOODBANK_ADMIN',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  BLOODBANK_STAFF: 'BLOODBANK_STAFF',
  HOSPITAL_STAFF: 'HOSPITAL_STAFF',
  USER: 'USER',
};

/**
 * Blood types
 */
export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

/**
 * Facility types
 */
export const FACILITY_TYPES = {
  HOSPITAL: 'HOSPITAL',
  BLOODBANK: 'BLOODBANK',
};

/**
 * Request status
 */
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

/**
 * Payment status
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  ROLE: 'role',
  FACILITY_VERIFIED: 'facility_verified',
  USER_DATA: 'user_data',
};

/**
 * Theme options
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};
