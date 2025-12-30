/**
 * ============================================================================
 * CLINIC AUDIT LOGS
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display clinic audit logs in a table format.
 * 
 * FEATURES:
 * - Display audit logs data in CustomTable
 * - Loading states
 * - Error handling
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Loading states with CustomLoader
 * - Empty state handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - CustomTable: Table display component
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ClinicAuditLogs
 */

import {View, Text, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomLoader from '../../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const ClinicAuditLogs = () => {
  const header = ['Name ', 'Action', 'TimeStamp', 'Status'];
  
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userId } = useCommon();

  /**
   * Fetch clinic audit logs
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling with user-friendly messages
   */
  const clinicAuditlogs = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for audit logs', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `hcf/clinicAuditlogs/${userId}`);
      
      const response = await axiosInstance.get(`hcf/clinicAuditlogs/${userId}`);

      Logger.debug('Audit logs response', { 
        count: response.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setCardData(responseData);
        Logger.info('Audit logs fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setCardData([]);
        Logger.warn('No audit logs in response');
      }
    } catch (err) {
      Logger.error('Error fetching audit logs', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to fetch audit logs. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      setCardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('ClinicAuditLogs initialized', { userId });
      clinicAuditlogs();
    } else {
      Logger.warn('ClinicAuditLogs: userId not available');
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && <CustomLoader />}
      
      <CustomTable
        data={cardData}
        header={header}
        isUserDetails={false}
        flexvalue={1}
        rowDataCenter={true}
        textCenter={'center'}
        backgroundkey={'action'}
        statusNumber={true}
        loading={loading}
      />
    </View>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_WHITE,
  },
});

export default ClinicAuditLogs;
