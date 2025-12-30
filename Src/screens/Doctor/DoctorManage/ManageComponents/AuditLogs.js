/**
 * ============================================================================
 * COMPONENT: Audit Logs
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying doctor audit logs in a table format
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - No user input, read-only data display
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states
 * - Error messages
 * - Empty state handling
 * 
 * @module AuditLogs
 */

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

// Components
import CustomTable from '../../../../components/customTable/CustomTable';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useCommon} from '../../../../Store/CommonContext';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

export default function AuditLogs() {
  const {userId} = useCommon();

  // DATA: Table headers
  const header = ['Name ', 'Action', 'Action Id', 'TimeStamp', 'Status'];

  // STATE: Audit logs data and loading
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * API: Fetch doctor audit logs
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const clinicAuditlogs = async () => {
    // VALIDATION: Check if userId exists
    if (!userId) {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('User ID missing for audit logs', { userId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `doctor/DoctorAuditlogs?doctor_id=${userId}`);

      const response = await axiosInstance.get(
        `doctor/DoctorAuditlogs?doctor_id=${userId}`,
      );

      Logger.info('Audit logs fetched successfully', {
        count: response?.data?.response?.length || 0,
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setCardData(response.data.response);
      } else {
        Logger.warn('No audit logs found');
        setCardData([]); // Set empty array for graceful empty state handling
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to fetch audit logs. Please try again later.';

      Logger.error('Error fetching audit logs', {
        status: err?.response?.status,
        message: errorMessage,
        error: err,
      });

      setError(errorMessage);
      setCardData([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // EFFECT: Fetch audit logs on mount
  useEffect(() => {
    Logger.debug('AuditLogs component mounted', { userId });
    clinicAuditlogs();
  }, [userId]); // Include userId in dependencies

  // LOADING STATE: Show reusable loader
  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomLoader />
        <Text style={styles.loadingText}>Loading audit logs...</Text>
      </View>
    );
  }

  // ERROR STATE: Show error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={clinicAuditlogs}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // SUCCESS STATE: Show audit logs table
  return (
    <View>
      {cardData && cardData.length > 0 ? (
        <CustomTable
          data={cardData}
          header={header}
          isUserDetails={false}
          flexvalue={1}
          rowDataCenter={true}
          textCenter={'center'}
          backgroundkey={'action'}
          statusNumber={true}
        />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No audit logs available</Text>
        </View>
      )}
    </View>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
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
  emptyText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
