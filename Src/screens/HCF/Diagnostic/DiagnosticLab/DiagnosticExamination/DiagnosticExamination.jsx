/**
 * ============================================================================
 * DIAGNOSTIC EXAMINATION
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display examined test requests in a table format.
 * 
 * FEATURES:
 * - Display examined test requests in CustomTable
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
 * @module DiagnosticExamination
 */

import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomTable from '../../../../../components/customTable/CustomTable';
import { useCommon } from '../../../../../Store/CommonContext';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../../../../../constants/colors';

const DiagnosticExamination = () => {
  const [examined, setExamined] = useState([]);
  const [load, setLoad] = useState(false);
  const {userId} = useCommon();

  /**
   * Table headers for examination list
   */
  const header = [
    'Name/Booking ID',
    'Test Name',
    'Date & Time',
    'Status',
    'Amount'
  ];

  /**
   * Fetch examined test requests
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleRecieved = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for examination list', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoad(true);

    try {
      Logger.api('GET', `hcf/testExamined/${userId}`);
      
      const response = await axiosInstance.get(`hcf/testExamined/${userId}`);
      
      Logger.debug('Examination list response', { 
        count: response?.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setExamined(responseData);
        Logger.info('Examination list fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setExamined([]);
        Logger.warn('No examination data in response');
      }
    } catch (e) {
      Logger.error('Error fetching examination list', e);
      
      const errorMessage = e?.response?.data?.message || 
        'Failed to fetch examination list. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setExamined([]);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('DiagnosticExamination initialized', { userId });
      handleRecieved();
    } else {
      Logger.warn('DiagnosticExamination: userId not available');
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Examination List
        </Text>
      </View>
      <View style={styles.tableContainer}>
        <CustomTable
          header={header}
          data={examined}
          isUserDetails={true}
          rowDataCenter={true}
          flexvalue={1}
          textCenter={'center'}
          roundedBtn={'action'}
          loading={load}
        />
      </View>
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
  },
  titleContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
  tableContainer: {
    flex: 1,
  },
});

export default DiagnosticExamination;
