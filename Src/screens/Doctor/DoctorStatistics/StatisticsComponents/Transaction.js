/**
 * ============================================================================
 * COMPONENT: Transaction History
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying doctor's transaction history
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
 * @module Transaction
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
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

export default function Transaction() {
  const {userId} = useCommon();

  // STATE: Transaction data and loading
  const [apiResponseData, setApiResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * API: Fetch transaction history for doctor
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
      Logger.error('User ID missing for transaction history', { userId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('POST', 'doctor/DocTransaction/', { doctor_id: userId });

      const response = await axiosInstance.post(`${baseUrl}doctor/DocTransaction/`, {
        doctor_id: userId,
      });

      Logger.info('Transaction history fetched successfully', {
        hasData: !!response?.data,
      });

      // ERROR HANDLING: Handle different response structures
      let transactionData = [];

      if (response.data) {
        if (Array.isArray(response.data)) {
          transactionData = response.data;
        } else if (response.data.response && Array.isArray(response.data.response)) {
          transactionData = response.data.response;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          transactionData = response.data.data;
        }
      }

      Logger.debug('Processed transaction data', { count: transactionData.length });

      setApiResponseData(transactionData);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load transaction history. Please try again later.';

      Logger.error('Error fetching transaction history', {
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

  // EFFECT: Fetch transaction history on mount
  useEffect(() => {
    Logger.debug('Transaction component mounted', { userId });
    handleDeactivateListing();
  }, [userId]); // Include userId in dependencies
  

  // LOADING STATE: Show reusable loader
  if (loading) {
    return (
      <View style={styles.centered}>
        <CustomLoader />
        <Text style={styles.loadingText}>Loading transaction history...</Text>
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
        <Text style={styles.emptyText}>No transaction history found</Text>
      </View>
    );
  }

  // SUCCESS STATE: Show transaction history table
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
                Transaction & ID
              </Text>
              <Text style={[styles.headerText, styles.columnDate]}>
                Date & Time
              </Text>
              <Text style={[styles.headerText, styles.columnAmount]}>
                Amount
              </Text>
            </View>

            {/* TABLE ROWS */}
            <ScrollView>
              {apiResponseData.map((data, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.transactionInfo}>
                    <View>
                      {/* ICON: Transaction status icon */}
                      {data.status == 'canceled' ? (
                        <Image
                          source={require('../../../../assets/images/Send.png')}
                          style={styles.transactionIcon}
                        />
                      ) : (
                        <Image
                          source={require('../../../../assets/images/Recieve.png')}
                          style={styles.transactionIcon}
                        />
                      )}
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle}>
                        Appointment Payment
                      </Text>
                      <Text style={styles.transactionId}>
                        TRX Id: {data.transaction_id || 'N/A'}
                      </Text>
                      <Text style={styles.transactionId}>
                        Appointment Id: {data.appointment_id || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.columnDate, styles.dateColumn]}>
                    <Text style={styles.GreyText}>
                      {data.appointment_date?.substring(0, 10) || 'N/A'} |{' '}
                      {data.appointment_time || 'N/A'}
                    </Text>
                  </View>

                  <View style={[styles.columnAmount, styles.amountColumn]}>
                    <Text style={styles.amount}>${data.amount || '0'}</Text>
                  </View>
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
    minHeight: hp(50),
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
    marginBottom: 90,
  },
  tableWrapper: {
    flex: 1,
    padding: 10,
    height: hp(50),
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    marginBottom: 70,
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
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(60),
  },
  transactionIcon: {
    height: hp(7),
    width: wp(17),
    borderRadius: 15,
    resizeMode: 'contain',
  },
  transactionDetails: {
    marginHorizontal: 7,
  },
  transactionTitle: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.8),
  },
  transactionId: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.4),
  },
  columnName: {
    width: 200,
  },
  columnDate: {
    width: 150,
    justifyContent: 'center',
    left: 50,
  },
  dateColumn: {
    left: 30,
  },
  columnAmount: {
    width: 100,
    justifyContent: 'center',
  },
  amountColumn: {
    left: 20,
  },
  GreyText: {
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontSize: hp(1.7),
  },
  amount: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.8),
  },
});
