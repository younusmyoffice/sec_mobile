/**
 * ============================================================================
 * COMPONENT: Notification Dashboard
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying doctor notifications in the dashboard
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - No user input, all data from API
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states
 * - Error messages
 * - Empty state handling
 * 
 * @module NotificationDashboard
 */

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

// Components
import CustomNotificationRoundedList from '../../../components/customNotificationRounded/CustomNotificationRoundedList';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useCommon} from '../../../Store/CommonContext';
import CustomToaster from '../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

export default function NotificationDashboard() {
  const {userId} = useCommon();

  // STATE: Notifications data and loading
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * API: Fetch doctor notifications
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchNotifications = async () => {
    // VALIDATION: Check if userId exists
    if (!userId) {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('User ID missing for notifications', { userId });
      setError(errorMsg);
      setLoading(false);
      
      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `Doctor/DoctorNotification/${userId}`);

      const response = await axiosInstance.get(`Doctor/DoctorNotification/${userId}`);
      const durations = response?.data?.response?.durations;

      // ERROR HANDLING: Validate response data
      if (!durations || !Array.isArray(durations)) {
        Logger.warn('Invalid notification data received', {
          hasResponse: !!response?.data,
          hasDurations: !!durations,
          isArray: Array.isArray(durations),
        });
        setNotifications([]);
        return;
      }

      Logger.info('Notifications fetched successfully', {
        count: durations.length,
      });

      setNotifications(durations);
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load notifications.';

      Logger.error('Error fetching notifications', {
        status: err?.response?.status,
        message: errorMessage,
        error: err,
      });

      setError(errorMessage);
      setNotifications([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // EFFECT: Fetch notifications on mount
  useEffect(() => {
    Logger.debug('NotificationDashboard mounted', { userId });
    fetchNotifications();
  }, [userId]); // Include userId in dependencies

  // LOADING STATE: Show reusable loader
  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomLoader />
        <Text style={styles.loadingText}>Loading Notifications...</Text>
      </View>
    );
  }

  // ERROR STATE: Show error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={fetchNotifications}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // SUCCESS STATE: Show notifications list
  return <CustomNotificationRoundedList data={notifications} />;
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    fontSize: 14,
  },
  errorText: {
    color: COLORS.ERROR, // DESIGN: Use color constant
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
