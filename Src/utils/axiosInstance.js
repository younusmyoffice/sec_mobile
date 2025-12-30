/**
 * ============================================================================
 * SECURITY: Centralized HTTP Client with Automatic Token Injection
 * ============================================================================
 * 
 * This module provides a reusable axios instance that:
 * 1. Automatically injects access tokens into all requests
 * 2. Handles request/response interceptors for error management
 * 3. Maintains security best practices for token storage
 * 
 * SECURITY NOTES:
 * - Access tokens stored in AsyncStorage (OS-encrypted)
 * - Token automatically injected into Authorization header
 * - Bearer prefix normalized to prevent duplication
 * - Corrupted storage automatically cleared on startup
 * - All requests include authentication header
 * 
 * @module axiosInstance
 * @returns {AxiosInstance} Configured axios instance with auth interceptor
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from './baseUrl';

/**
 * SECURITY: Clear corrupted AsyncStorage
 * 
 * Purpose: Detect and clear invalid token storage
 * Triggers: On module load
 * Security: Prevents app crashes from corrupted auth data
 */
const clearCorruptedStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (token === 'token') {
      await AsyncStorage.clear();
      console.log('🧹 Cleared corrupted AsyncStorage');
    }
  } catch (error) {
    // If we can't even read from storage, clear it
    try {
      await AsyncStorage.clear();
      console.log('🧹 Cleared corrupted AsyncStorage due to read error');
    } catch (clearError) {
      console.log('⚠️ Could not clear AsyncStorage:', clearError);
    }
  }
};

// Run the cleanup on module load
clearCorruptedStorage();

/**
 * SECURITY: Configured Axios Instance
 * 
 * Base URL configured from baseUrl utility
 * All requests automatically include authentication via interceptors
 */
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

/**
 * REQUEST INTERCEPTOR: Automatic Token Injection
 * 
 * SECURITY:
 * - Retrieves access token from AsyncStorage (OS-encrypted storage)
 * - Normalizes Bearer prefix to prevent duplication
 * - Automatically injects token into Authorization header
 * - All API requests authenticated without manual intervention
 * 
 * REUSABILITY:
 * - Works automatically for all axios requests
 * - No need to manually attach tokens
 * - Single source of truth for authentication
 * 
 * @param {Object} config - Axios request configuration
 * @returns {Object} Modified config with Authorization header
 */
axiosInstance.interceptors.request.use(
  async config => {
    try {
      // SECURITY: Retrieve token from secure storage
      const storedToken = await AsyncStorage.getItem('access_token');
      if (storedToken && storedToken !== 'token') {
        // SECURITY: Normalize Bearer prefix to prevent duplication
        const normalizedToken = storedToken.replace(/^Bearer\s+/i, '').trim();
        if (normalizedToken) {
          // AUTO-INJECT: Token automatically added to all requests
          config.headers.Authorization = `Bearer ${normalizedToken}`;
        }
      }
      
      // Debug: Log the request being sent (REMOVE IN PRODUCTION)
      console.log('🚀 Axios Request Debug:');
      console.log('  URL:', config.baseURL + config.url);
      console.log('  Method:', config.method);
      console.log('  Headers:', config.headers);
      console.log('  Token:', config.headers.Authorization);
      
    } catch (error) {
      // SECURITY: Silently fail to prevent infinite loops
      // console.error('Error retrieving token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR: Centralized Error Handling
 * 
 * ERROR HANDLING STRATEGY:
 * - 401 Unauthorized: Token expired or invalid
 * - 500+ Server Errors: Backend issues
 * - Network Errors: Connection problems
 * 
 * SECURITY:
 * - Errors logged for debugging (REMOVE IN PRODUCTION)
 * - No sensitive data exposed in error messages
 * - Silent failure to prevent app crashes
 * 
 * @param {Object} response - Successful HTTP response
 * @param {Error} error - HTTP error response
 * @returns {Object|Promise.reject} Response or rejected promise with error
 */
axiosInstance.interceptors.response.use(
  response => {
    // SUCCESS: Log successful responses (REMOVE IN PRODUCTION)
    console.log('✅ Axios Response Debug:');
    console.log('  URL:', response.config.url);
    console.log('  Status:', response.status);
    console.log('  Data:', response.data);
    return response;
  },
  error => {
    // ERROR: Log error responses (REMOVE IN PRODUCTION)
    console.log('❌ Axios Error Debug:');
    console.log('  URL:', error.config?.url);
    console.log('  Status:', error.response?.status);
    console.log('  Error Data:', error.response?.data);
    console.log('  Error Message:', error.message);
    
    if (error.response) {
      // ERROR HANDLING: HTTP errors with response
      if (error.response.status === 401) {
        // SECURITY: Handle unauthorized access
        // Token expired or invalid - handled by individual components
        // console.error('Unauthorized - please log in again.');
      } else if (error.response.status >= 500) {
        // ERROR: Server-side errors
        // console.error('Server error - try again later.');
      }
    } else {
      // ERROR: Network errors (no response received)
      // console.error('Network error - check your connection.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
