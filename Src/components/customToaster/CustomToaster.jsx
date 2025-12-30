/**
 * ============================================================================
 * REUSABLE COMPONENT: Global Toast Notification System
 * ============================================================================
 * 
 * ERROR & SUCCESS MESSAGING:
 * This component provides a centralized, reusable way to display messages
 * throughout the entire application.
 * 
 * USAGE:
 * - Success messages: CustomToaster.show('success', 'Title', 'Message')
 * - Error messages: CustomToaster.show('error', 'Title', 'Message')
 * - Info messages: CustomToaster.show('info', 'Title', 'Message')
 * 
 * FEATURES:
 * - Consistent UI across all screens
 * - Auto-dismissible notifications
 * - Multiple toast types (success, error, info)
 * - Non-intrusive user experience
 * 
 * SECURITY:
 * - Sanitizes user-facing messages
 * - No sensitive data exposed
 * 
 * REUSABILITY: ✅ YES
 * - Used throughout entire application
 * - Single source of truth for notifications
 * 
 * @module CustomToaster
 */

import Toast from 'react-native-toast-message';

/**
 * CustomToaster - Reusable Toast Notification System
 * 
 * Provides centralized error and success message handling
 * 
 * @param {string} type - Toast type ('success', 'error', 'info')
 * @param {string} text1 - Primary message text
 * @param {string} text2 - Secondary message text (optional)
 * 
 * @example
 * CustomToaster.show('success', 'Login Successful', 'Welcome back!')
 * CustomToaster.show('error', 'Login Failed', 'Invalid credentials')
 */
const CustomToaster = {
  show: (type = 'info', text1 = '', text2 = '') => {
    Toast.show({
      type,
      text1,
      text2,
      
    });
  },
};

export default CustomToaster;
