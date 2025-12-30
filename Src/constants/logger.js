/**
 * ============================================================================
 * UTILITY: Structured Logging System
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized logging utility for consistent, structured logging throughout
 * the application
 * 
 * SECURITY:
 * - Logs can be disabled in production
 * - Sensitive data should not be logged
 * 
 * USAGE:
 * import { Logger } from '../constants/logger';
 * 
 * Logger.info('User logged in', { userId: 123 });
 * Logger.error('API call failed', error);
 * 
 * @module logger
 */

const isDevelopment = __DEV__;

/**
 * Logger utility for structured logging
 */
const Logger = {
  /**
   * Log informational messages
   * @param {string} message - Log message
   * @param {Object} data - Additional data to log
   */
  info: (message, data = {}) => {
    if (isDevelopment) {
      console.log(`ℹ️ INFO: ${message}`, Object.keys(data).length > 0 ? data : '');
    }
  },

  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or error data
   */
  error: (message, error = {}) => {
    if (isDevelopment) {
      console.error(`❌ ERROR: ${message}`, error);
    }
  },

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {Object} data - Additional data to log
   */
  warn: (message, data = {}) => {
    if (isDevelopment) {
      console.warn(`⚠️ WARN: ${message}`, Object.keys(data).length > 0 ? data : '');
    }
  },

  /**
   * Log debug messages
   * @param {string} message - Debug message
   * @param {Object} data - Additional data to log
   */
  debug: (message, data = {}) => {
    if (isDevelopment) {
      console.log(`🔍 DEBUG: ${message}`, Object.keys(data).length > 0 ? data : '');
    }
  },

  /**
   * Log API request/response
   * @param {string} method - HTTP method
   * @param {string} url - API endpoint
   * @param {Object} data - Request/Response data (sanitized)
   */
  api: (method, url, data = {}) => {
    if (isDevelopment) {
      console.log(`📡 API: ${method.toUpperCase()} ${url}`, data);
    }
  },
};

export default Logger;

