/**
 * ============================================================================
 * RECEIVED TEST REQUESTS
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display and manage received test requests with accept/reject functionality.
 * 
 * FEATURES:
 * - Display received test requests in CustomTable
 * - Accept/reject test requests
 * - Loading states
 * - Error handling
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Input validation for test_id and staff_id
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomToaster: Toast notifications
 * - CustomTable: Table display component with action buttons
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module Recieved
 */

import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useCommon } from '../../../../../Store/CommonContext';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';

const Recieved = () => {
  const [recieved, setRecieved] = useState([]);
  const [load, setLoad] = useState(false);
  const {userId} = useCommon();

  /**
   * Table headers for received requests
   */
  const header = [
    'Name/Booking ID',
    'Date ',
    'Time ',
    'Status',
    'Test Name',
    'Price',
    'Action',
  ];

  /**
   * Fetch received test requests
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleRecieved = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for received requests', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoad(true);
    
    try {
      Logger.api('GET', `hcf/testRequests/${userId}`);
      
      const response = await axiosInstance.get(`hcf/testRequests/${userId}`);
      
      Logger.debug('Received requests response', { 
        count: response?.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setRecieved(responseData);
        Logger.info('Received requests fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setRecieved([]);
        Logger.warn('No received requests in response');
      }
    } catch (e) {
      Logger.error('Error fetching received requests', e);
      
      const errorMessage = e?.response?.data?.message || 
        'Failed to fetch test requests. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setRecieved([]);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('Recieved component initialized', { userId });
      handleRecieved();
    } else {
      Logger.warn('Recieved: userId not available');
    }
  }, [userId]);

  /**
   * Handle test request acceptance
   * SECURITY: Validates test_id before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string|number} id - Test ID to accept
   */
  const handleAccept = async (id) => {
    // SECURITY: Validate test_id
    if (!id || id === 'null' || id === 'undefined') {
      Logger.error('Invalid test_id for acceptance', { id });
      CustomToaster.show('error', 'Error', 'Invalid test request. Please try again.');
      return;
    }

    // SECURITY: Validate userId
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for accept request', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    try {
      Logger.api('POST', 'hcf/testRequestsAccept', { test_id: id });
      
      // SECURITY: Prepare payload with validated data
      const payload = {
        test_id: String(id).trim(),
        staff_id: String(userId).trim(), // Use userId instead of hardcoded '17'
      };

      const response = await axiosInstance.post('hcf/testRequestsAccept', payload);
      
      Logger.debug('Accept response', { 
        body: response.data?.response?.body,
        statusCode: response.data?.response?.statusCode 
      });

      const successMessage = response.data?.response?.body || 'Test request accepted successfully.';
      
      CustomToaster.show('success', 'Accepted', successMessage, {
        duration: 2000,
      });
      
      Logger.info('Test request accepted successfully', { test_id: id });
      
      // Refresh the list
      handleRecieved();
    } catch (e) {
      Logger.error('Error accepting test request', e);
      
      const errorMessage = e?.response?.data?.message || e?.response?.data?.error || 
        'Failed to accept test request. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  /**
   * Handle test request rejection
   * SECURITY: Validates test_id before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string|number} id - Test ID to reject
   */
  const handleReject = async (id) => {
    // SECURITY: Validate test_id
    if (!id || id === 'null' || id === 'undefined') {
      Logger.error('Invalid test_id for rejection', { id });
      CustomToaster.show('error', 'Error', 'Invalid test request. Please try again.');
      return;
    }

    // SECURITY: Validate userId
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for reject request', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    try {
      Logger.api('POST', 'hcf/testRequestReject', { test_id: id });
      
      // SECURITY: Prepare payload with validated data
      const payload = {
        test_id: String(id).trim(),
        staff_id: String(userId).trim(), // Use userId instead of hardcoded '17'
      };

      const response = await axiosInstance.post('hcf/testRequestReject', payload);
      
      Logger.debug('Reject response', { 
        body: response.data?.response?.body,
        statusCode: response.data?.response?.statusCode 
      });

      const successMessage = response.data?.response?.body || 'Test request rejected successfully.';
      
      CustomToaster.show('success', 'Rejected', successMessage, {
        duration: 2000,
      });
      
      Logger.info('Test request rejected successfully', { test_id: id });
      
      // Refresh the list
      handleRecieved();
    } catch (e) {
      Logger.error('Error rejecting test request', e);
      
      const errorMessage = e?.response?.data?.message || e?.response?.data?.error || 
        'Failed to reject test request. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <CustomTable
        header={header}
        id={'test_id'}
        isUserDetails={true}
        flexvalue={2}
        rowDataCenter={true}
        textCenter={'center'}
        data={recieved}
        roundedBtn={'action'}
        enableMenu={true}
        acceptPress={handleAccept}
        rejectPress={handleReject}
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

export default Recieved;
