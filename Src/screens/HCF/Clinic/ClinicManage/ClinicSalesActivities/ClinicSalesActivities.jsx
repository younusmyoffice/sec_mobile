/**
 * ============================================================================
 * CLINIC SALES ACTIVITIES
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display and manage clinic sales activities in a table format.
 * 
 * FEATURES:
 * - Display sales activities data in CustomTable
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
 * @module ClinicSalesActivities
 */

import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';
import CustomLoader from '../../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

export default function ClinicSalesActivities() {
  const { userId } = useCommon();
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Table headers for sales activities
   */
  const header = [
    'Name & Details',
    'Status',
    'Amount',
    'Plan name',
  ];

  /**
   * Fetch clinic sales activities
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling with user-friendly messages
   */
  const handleReceived = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for sales activities', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      Logger.api('GET', `hcf/${userId}/clinicSaleActivity`);
      
      const response = await axiosInstance.get(`hcf/${userId}/clinicSaleActivity`);
      
      Logger.debug('Sales activities response', { 
        count: response.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setCardData(responseData);
        Logger.info('Sales activities fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setCardData([]);
        Logger.warn('No sales activities in response');
      }
    } catch (err) {
      Logger.error('Error fetching sales activities', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to fetch sales activities. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      setCardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('ClinicSalesActivities initialized', { userId });
      handleReceived();
    } else {
      Logger.warn('ClinicSalesActivities: userId not available');
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && <CustomLoader />}
      
      <CustomTable
        header={header}
        backgroundkey={'status'}
        isUserDetails={true}
        data={cardData}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        loading={loading}
      />
    </View>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_WHITE,
    width: '100%',
  },
});
