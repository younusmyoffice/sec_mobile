/**
 * ============================================================================
 * REJECTED TEST REQUESTS
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display rejected test requests in a table format.
 * 
 * FEATURES:
 * - Display rejected test requests in CustomTable
 * - Loading states
 * - Error handling
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Loading states
 * - Empty state handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator (via CustomTable loading prop)
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
 * @module Rejected
 */

import {View, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';

const Rejected = () => {
  const [rejected, setRejected] = useState([]);
  const [load, setLoad] = useState(false);
  const {userId} = useCommon();

  /**
   * Table headers for rejected requests
   */
  const header = [
    'Name/Booking ID',
    'Date ',
    'Time ',
    'Status',
    'Test Name',
    'Price',
  ];

  /**
   * Fetch rejected test requests
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleRejected = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for rejected requests', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoad(true);

    try {
      Logger.api('GET', `hcf/testRejected/${userId}`);
      
      const response = await axiosInstance.get(`hcf/testRejected/${userId}`);
      
      Logger.debug('Rejected requests response', { 
        count: response?.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setRejected(responseData);
        Logger.info('Rejected requests fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setRejected([]);
        Logger.warn('No rejected requests in response');
      }
    } catch (e) {
      Logger.error('Error fetching rejected requests', e);
      
      const errorMessage = e?.response?.data?.message || 
        'Failed to fetch rejected requests. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setRejected([]);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('Rejected component initialized', { userId });
      handleRejected();
    } else {
      Logger.warn('Rejected: userId not available');
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <CustomTable
        header={header}
        id={'test_id'}
        isUserDetails={true}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        data={rejected}
        enableMenu={false}
        loading={load}
      />
    </View>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Rejected;
