/**
 * ============================================================================
 * COMPONENT: Earnings Overview
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying doctor's earnings overview and detailed earnings list
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
 * @module Overview
 */

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomTable from '../../../../components/customTable/CustomTable';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {baseUrl} from '../../../../utils/baseUrl';
import {useCommon} from '../../../../Store/CommonContext';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Overview() {
  const {userId} = useCommon();

  // STATE: Earnings overview cards
  const [overview, setOverview] = useState([
    {
      id: 1,
      title: 'Doctor Earning',
      price: '0',
      item: 0,
    },
    {
      id: 2,
      title: 'Affiliate Earning',
      price: '0',
      item: 0,
    },
    {
      id: 3,
      title: 'Total Earning',
      price: '0',
      item: 0,
    },
  ]);

  // STATE: Earnings list data and loading
  const [apiResponseData, setApiResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  Logger.debug('Overview component initialized', { userId });

  /**
   * API: Fetch earnings dashboard data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * PERFORMANCE: Concurrent API calls using Promise.all
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchDashboardData = async () => {
    // VALIDATION: Check if userId exists
    if (!userId) {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('User ID missing for earnings overview', { userId });
      setError(errorMsg);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    try {
      Logger.api('POST', 'doctor/DocEarningCount, DocAffiliateEarningCount, DocTotalEarningCount (3 concurrent calls)');

      // PERFORMANCE: Fetch all earnings data concurrently
      const [responseForInProgress, responseForBooked, responseForCompleted] =
        await Promise.all([
          axiosInstance.post(`${baseUrl}doctor/DocEarningCount`, {
            doctor_id: userId,
          }),
          axiosInstance.post(`${baseUrl}doctor/DocAffiliateEarningCount`, {
            doctor_id: userId,
          }),
          axiosInstance.post(`${baseUrl}doctor/DocTotalEarningCount`, {
            doctor_id: userId,
          }),
        ]);

      Logger.info('Earnings dashboard data fetched successfully', {
        hasDoctorEarning: !!responseForInProgress?.data,
        hasAffiliateEarning: !!responseForBooked?.data,
        hasTotalEarning: !!responseForCompleted?.data,
      });

      // ERROR HANDLING: Extract earnings from response data
      const doctorEarningData = responseForInProgress?.data?.response;
      const affiliateEarningData = responseForBooked?.data?.response;
      const totalEarningData = responseForCompleted?.data;

      // ERROR HANDLING: Handle different response structures - extract from arrays if needed
      let doctorEarning = '0';
      let affiliateEarning = '0';

      // Extract doctor earning (handle array response)
      if (Array.isArray(doctorEarningData) && doctorEarningData.length > 0) {
        const firstItem = doctorEarningData[0];
        doctorEarning =
          firstItem?.doctor_earning || firstItem?.amount || '0';
      } else if (doctorEarningData?.doctor_earning) {
        doctorEarning = doctorEarningData.doctor_earning;
      } else if (doctorEarningData?.amount) {
        doctorEarning = doctorEarningData.amount;
      } else {
        doctorEarning = '0';
      }

      // SECURITY: Ensure doctorEarning is always a string/number, never an object
      if (
        typeof doctorEarning === 'object' ||
        doctorEarning === null ||
        doctorEarning === undefined
      ) {
        doctorEarning = '0';
      }

      // Extract affiliate earning (handle array response)
      if (Array.isArray(affiliateEarningData) && affiliateEarningData.length > 0) {
        const firstItem = affiliateEarningData[0];
        affiliateEarning =
          firstItem?.hcf_doctor_earning || firstItem?.amount || '0';
      } else if (affiliateEarningData?.hcf_doctor_earning) {
        affiliateEarning = affiliateEarningData.hcf_doctor_earning;
      } else if (affiliateEarningData?.amount) {
        affiliateEarning = affiliateEarningData.amount;
      } else {
        affiliateEarning = '0';
      }

      // SECURITY: Ensure affiliateEarning is always a string/number, never an object
      if (
        typeof affiliateEarning === 'object' ||
        affiliateEarning === null ||
        affiliateEarning === undefined
      ) {
        affiliateEarning = '0';
      }

      const totalEarning =
        totalEarningData?.totalEarnings ||
        totalEarningData?.totalEarningsSum ||
        totalEarningData ||
        '0';

      Logger.debug('Processed earnings', {
        doctorEarning,
        affiliateEarning,
        totalEarning,
      });

      setOverview([
        {
          id: 1,
          title: 'Doctor Earning',
          price: String(doctorEarning),
          item: 10,
        },
        {
          id: 2,
          title: 'Affiliate Earning',
          price: String(affiliateEarning),
          item: 10,
        },
        {
          id: 3,
          title: 'Total Earning',
          price: String(totalEarning),
          item: 10,
        },
      ]);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to fetch earnings data. Please try again later.';

      Logger.error('Error fetching dashboard data', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setError(errorMessage);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  /**
   * API: Fetch detailed earnings list
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
      Logger.error('User ID missing for earnings list', { userId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('POST', 'doctor/DocAllEarningList', { doctor_id: userId });

      const response = await axiosInstance.post(`${baseUrl}doctor/DocAllEarningList`, {
        doctor_id: userId,
      });

      Logger.info('Earnings list fetched successfully', {
        hasData: !!response?.data,
      });

      // ERROR HANDLING: Handle different response structures
      let earningListData = [];

      if (response.data) {
        if (Array.isArray(response.data)) {
          earningListData = response.data;
        } else if (response.data.response && Array.isArray(response.data.response)) {
          earningListData = response.data.response;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          earningListData = response.data.data;
        } else if (typeof response.data === 'object') {
          // If it's a single object, wrap it in an array
          earningListData = [response.data];
        }
      }

      Logger.debug('Processed earning list data', { count: earningListData.length });

      setApiResponseData(earningListData);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        error?.response?.status === 500
          ? 'Server error loading earning list. Please try again later.'
          : 'Failed to load earning list. Please try again later.';

      Logger.error('Error fetching earning list', {
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

  /**
   * EFFECT: Fetch earnings data on mount
   */
  useEffect(() => {
    Logger.debug('Overview component mounted', { userId });
    handleDeactivateListing();
    fetchDashboardData();
  }, [userId]); // Include userId in dependencies

  /**
   * HANDLER: Toggle accordion for overview cards
   */
  const toggleAccordion = () => {
    Logger.debug('Toggle accordion', { expanded: !expanded });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  // DATA: Table headers for earnings list
  const header = ['Date', 'Time', 'Affiliate Earning', 'Direct Earning', 'Total'];
  return (
    <SafeAreaView>
        {/* <ScrollView nestedScrollEnabled={true}> */}
        {/* <View
          style={{
            borderWidth: 1.5,
            borderColor: '#E6E1E5',
            borderRadius: 16,
            padding: 15,
            margin: 10,
          }}>
          {overview.map((item, i) => (
            <View key={i} style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: '#E72B4A',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 40,
                }}>
                ${item.price}
              </Text>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  top: -10,
                }}>
                {item.title}
              </Text>
              <View
                style={{
                  backgroundColor: '#EFEFEF',
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 20,
                  top: -10,
                }}>
                <Text
                  style={{
                    color: '#AEAAAE',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                  }}>
                  {item.item} item
                </Text>
              </View>
            </View>
          ))}
        </View> */}
      {/* ACCORDION: Earnings overview cards */}
      <View style={styles.overviewContainer}>
        <TouchableOpacity onPress={toggleAccordion}>
          <Text style={styles.accordionToggle}>
            {expanded ? 'Hide Overview ▲' : 'Show Overview ▼'}
          </Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.overviewContent}>
            {overview.map((item, i) => (
              <View key={i} style={styles.overviewCard}>
                <Text style={styles.overviewPrice}>${item.price}</Text>
                <Text style={styles.overviewTitle}>{item.title}</Text>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewItemCount}>{item.item} item</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* CONTENT: Earnings list table */}
      {loading ? (
        <View style={styles.centered}>
          <CustomLoader />
          <Text style={styles.loadingText}>Loading earnings list...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={handleDeactivateListing}>
            Tap to retry
          </Text>
        </View>
      ) : (
        <CustomTable
          header={header}
          isUserDetails={false}
          data={apiResponseData}
          flexvalue={1}
          rowDataCenter={true}
          textCenter={'center'}
          loading={loading}
        />
      )}
    {/* </ScrollView> */}
      </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: hp(40),
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
  overviewContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderRadius: 16,
    padding: 10,
    margin: 10,
  },
  accordionToggle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    textAlign: 'center',
  },
  overviewContent: {
    marginTop: 10,
  },
  overviewCard: {
    alignItems: 'center',
    marginVertical: 10,
  },
  overviewPrice: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
  },
  overviewTitle: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginTop: -10,
  },
  overviewBadge: {
    backgroundColor: COLORS.BG_LIGHT, // DESIGN: Use color constant
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: -10,
  },
  overviewItemCount: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});
