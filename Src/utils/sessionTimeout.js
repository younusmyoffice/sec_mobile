/**
 * ============================================================================
 * SECURITY: Session Timeout Management
 * ============================================================================
 * 
 * PURPOSE:
 * - Automatically log out users after inactivity
 * - Clear sensitive data on timeout
 * - Prevent unauthorized access to stored sessions
 * - Improve overall application security
 * 
 * CONFIGURATION:
 * - Default timeout: 30 minutes of inactivity
 * - Customizable per user role
 * - Automatic background detection
 * 
 * SECURITY BENEFITS:
 * - Prevents session hijacking
 * - Reduces unauthorized access risk
 * - Automatic data cleanup
 * - Privacy protection
 * 
 * @module sessionTimeout
 */

import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

/**
 * SECURITY: Session timeout configuration
 * 
 * Timeouts are configurable per role for flexibility
 */
const SESSION_TIMEOUTS = {
  PATIENT: 30 * 60 * 1000,      // 30 minutes
  DOCTOR: 60 * 60 * 1000,       // 60 minutes
  DIAGNOSTIC: 45 * 60 * 1000,   // 45 minutes
  ADMIN: 20 * 60 * 1000,        // 20 minutes
  DEFAULT: 30 * 60 * 1000,      // 30 minutes default
};

const LAST_ACTIVITY_KEY = 'last_activity_timestamp';
const IS_TIMEOUT_ACTIVE_KEY = 'session_timeout_active';

/**
 * Get session timeout based on user role
 * 
 * @param {number} roleId - User role ID (2=Admin, 3=Doctor, 4=Diagnostic, 5=Patient)
 * @returns {number} Timeout in milliseconds
 */
export const getSessionTimeout = (roleId) => {
  const timeoutMap = {
    2: SESSION_TIMEOUTS.ADMIN,
    3: SESSION_TIMEOUTS.DOCTOR,
    4: SESSION_TIMEOUTS.DIAGNOSTIC,
    5: SESSION_TIMEOUTS.PATIENT,
  };
  
  return timeoutMap[roleId] || SESSION_TIMEOUTS.DEFAULT;
};

/**
 * Update last activity timestamp
 * 
 * SECURITY: Called on every user interaction to track activity
 */
export const updateLastActivity = async () => {
  try {
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
};

/**
 * Get last activity timestamp
 * 
 * @returns {Promise<number|null>} Last activity timestamp or null
 */
export const getLastActivity = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error getting last activity:', error);
    return null;
  }
};

/**
 * Check if session has expired
 * 
 * @param {number} roleId - User role ID
 * @returns {Promise<boolean>} True if session expired
 */
export const checkSessionExpired = async (roleId) => {
  try {
    const lastActivity = await getLastActivity();
    if (!lastActivity) return true;
    
    const timeout = getSessionTimeout(roleId);
    const elapsed = Date.now() - lastActivity;
    
    return elapsed > timeout;
  } catch (error) {
    console.error('Error checking session expired:', error);
    return false;
  }
};

/**
 * Clear session data
 * 
 * SECURITY: Removes all authentication data on logout/timeout
 */
export const clearSession = async () => {
  try {
    await AsyncStorage.multiRemove([
      'access_token',
      'suid',
      'role_id',
      LAST_ACTIVITY_KEY,
    ]);
    console.log('✅ Session cleared');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Handle session timeout - log out user
 * 
 * @param {Function} handleLogout - Logout handler function
 */
export const handleSessionTimeout = async (handleLogout) => {
  try {
    console.log('⏰ Session timeout detected');
    
    // Clear session data
    await clearSession();
    
    // Show timeout alert
    Alert.alert(
      'Session Expired',
      'Your session has expired due to inactivity. Please log in again.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (handleLogout) {
              handleLogout();
            }
          },
        },
      ],
      { cancelable: false }
    );
    
  } catch (error) {
    console.error('Error handling session timeout:', error);
  }
};

/**
 * Start session timeout monitoring
 * 
 * @param {Function} handleLogout - Logout handler function
 * @param {number} roleId - User role ID
 * @returns {NodeJS.Timeout} Interval ID
 */
export const startSessionTimeout = (handleLogout, roleId) => {
  // SECURITY: Monitor app state changes for background detection
  const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'background') {
      console.log('📱 App moved to background - session monitoring paused');
    } else if (nextAppState === 'active') {
      console.log('📱 App moved to foreground - checking session');
      // Check session when app comes to foreground
      checkAndHandleTimeout(handleLogout, roleId);
    }
  });
  
  // SECURITY: Check session every minute
  const intervalId = setInterval(async () => {
    await checkAndHandleTimeout(handleLogout, roleId);
  }, 60 * 1000); // Check every minute
  
  // Cleanup function
  return () => {
    clearInterval(intervalId);
    appStateSubscription?.remove();
  };
};

/**
 * Check session and handle timeout if expired
 * 
 * @param {Function} handleLogout - Logout handler function
 * @param {number} roleId - User role ID
 */
const checkAndHandleTimeout = async (handleLogout, roleId) => {
  try {
    const isExpired = await checkSessionExpired(roleId);
    if (isExpired) {
      console.log('⏰ Session expired - logging out');
      await handleSessionTimeout(handleLogout);
    }
  } catch (error) {
    console.error('Error checking session timeout:', error);
  }
};

/**
 * Reset session timeout
 * 
 * Call this on user interactions to reset the timeout
 */
export const resetSessionTimeout = async () => {
  await updateLastActivity();
};

export default {
  getSessionTimeout,
  updateLastActivity,
  getLastActivity,
  checkSessionExpired,
  clearSession,
  handleSessionTimeout,
  startSessionTimeout,
  resetSessionTimeout,
};

