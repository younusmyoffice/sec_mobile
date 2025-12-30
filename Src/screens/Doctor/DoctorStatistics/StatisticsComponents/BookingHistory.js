/**
 * ============================================================================
 * COMPONENT: Booking History
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying doctor's booking history in a table format
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
 * @module BookingHistory
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {baseUrl} from '../../../../utils/baseUrl';
import {useCommon} from '../../../../Store/CommonContext';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

export default function BookingHistory() {
  const {userId} = useCommon();

  // STATE: Booking history data and loading
  const [apiResponseData, setApiResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * API: Fetch booking history for doctor
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const handleDeactivateListing = async () => {
    // VALIDATION: Check if userId exists
    if (!userId) {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('User ID missing for booking history', { userId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('POST', 'doctor/DocAppointmentHistoryId', { doctor_id: userId });

      const response = await axiosInstance.post(
        `${baseUrl}doctor/DocAppointmentHistoryId`,
        {
          doctor_id: userId,
        },
      );

      Logger.info('Booking history fetched successfully', {
        hasData: !!response?.data,
      });

      // ERROR HANDLING: Handle different response structures
      let bookingData = [];

      if (response.data) {
        if (Array.isArray(response.data)) {
          bookingData = response.data;
        } else if (response.data.response && Array.isArray(response.data.response)) {
          bookingData = response.data.response;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookingData = response.data.data;
        }
      }

      Logger.debug('Processed booking data', { count: bookingData.length });

      setApiResponseData(bookingData);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load booking history. Please try again later.';

      Logger.error('Error fetching booking history', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setError(errorMessage);
      setApiResponseData([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // EFFECT: Fetch booking history on mount
  useEffect(() => {
    Logger.debug('BookingHistory component mounted', { userId });
    handleDeactivateListing();
  }, [userId]); // Include userId in dependencies

  // LOADING STATE: Show reusable loader
  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomLoader />
        <Text style={styles.loadingText}>Loading booking history...</Text>
      </View>
    );
  }

  // ERROR STATE: Show error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={handleDeactivateListing}>
          Tap to retry
        </Text>
      </View>
    );
  }

  // EMPTY STATE: Show empty message
  if (apiResponseData.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No booking history found</Text>
      </View>
    );
  }

  // SUCCESS STATE: Show booking history table
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal={true}
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.tableWrapper}>
          <View style={styles.tableContainer}>
            {/* TABLE HEADER */}
            <View style={styles.header}>
              <Text style={[styles.headerText, styles.columnName]}>
                Name & Details
              </Text>
              <Text style={[styles.headerText, styles.columnStatus]}>
                Status
              </Text>
              <Text style={[styles.headerText, styles.columnDate]}>
                Date & Time
              </Text>
              <Text style={[styles.headerText, styles.columnPackage]}>
                Package
              </Text>
              <Text style={[styles.headerText, styles.columnAmount]}>
                Amount
              </Text>
            </View>

            {/* TABLE ROWS */}
            <ScrollView>
              {apiResponseData.map((data, index) => (
                <View key={index} style={styles.card}>
                  {/* Patient Name */}
                  <Text style={styles.nameText}>
                    {data.first_name || ''} {data.middle_name || ''}{' '}
                    {data.last_name || ''}
                  </Text>

                  {/* Appointment ID */}
                  <Text style={styles.detailText}>
                    Appointment ID: {data.appointment_id}
                  </Text>

                  {/* Appointment Date and Time */}
                  <Text style={styles.detailText}>
                    {data.appointment_date?.substring(0, 10) || 'N/A'} |{' '}
                    {data.appointment_time || 'N/A'}
                  </Text>

                  {/* Plan Name and Duration */}
                  <Text style={styles.detailText}>
                    Plan: {data.plan_name || 'N/A'} ({data.plan_duration || 'N/A'})
                  </Text>

                  {/* Amount */}
                  <Text style={styles.amountText}>${data.amount || '0'}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: hp(60),
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Medium',
  },
  errorText: {
    color: COLORS.ERROR, // DESIGN: Use color constant
    fontSize: hp(2),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontSize: hp(1.6),
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  emptyText: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  tableWrapper: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    height: hp(60),
    paddingBottom: 100,
  },
  tableContainer: {
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderWidth: 1,
    borderRadius: 12,
    width: 1000,
  },
  header: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: '600',
    left: 15,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    height: hp(10),
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  columnName: {
    minWidth: 200,
  },
  columnStatus: {
    width: wp(25),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  columnDate: {
    left: 20,
    width: 150,
    justifyContent: 'center',
  },
  columnPackage: {
    width: 120,
    justifyContent: 'center',
  },
  columnAmount: {
    width: 100,
    justifyContent: 'center',
  },
  nameText: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp(1.8),
  },
  detailText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.6),
  },
  amountText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Bold',
    fontSize: hp(1.8),
  },
});
