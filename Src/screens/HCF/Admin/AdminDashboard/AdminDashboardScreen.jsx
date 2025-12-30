/**
 * ============================================================================
 * SCREEN: Admin Dashboard
 * ============================================================================
 * 
 * PURPOSE:
 * Main dashboard screen for HCF Admin users displaying:
 * - Doctor count and Lab Technician count cards
 * - Notifications section
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Validates userId before API calls
 * - Handles AsyncStorage access securely
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states with reusable loader
 * - Error messages with CustomToaster
 * - Graceful fallbacks for missing data
 * 
 * PERFORMANCE:
 * - Uses Promise.all for concurrent API calls
 * 
 * @module AdminDashboardScreen
 */

import {View, Text, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomCountDisplayCard from '../../../../components/customCountDisplayCard/CustomCountDisplayCard';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomNotificationRoundedList from '../../../../components/customNotificationRounded/CustomNotificationRoundedList';
import Header from '../../../../components/customComponents/Header/Header';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useAuth} from '../../../../Store/Authentication';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboardScreen = () => {
  const {userId} = useAuth();

  // STATE: Dashboard cards and loading
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  Logger.debug('AdminDashboardScreen initialized', { userId, type: typeof userId });

  /**
   * API: Fetch dashboard data with specific HCF ID
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * PERFORMANCE: Concurrent API calls using Promise.all
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string|number} hcfId - HCF ID to fetch dashboard data for
   * @returns {Promise<void>}
   */
  const fetchDashboardDataWithUserId = async (hcfId) => {
    // VALIDATION: Check if hcfId exists
    if (!hcfId || hcfId === 'null' || hcfId === 'token') {
      const errorMsg = 'Invalid HCF ID. Please log in again.';
      Logger.error('Invalid hcfId for dashboard', { hcfId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      setCards([
        {id: 1, count: '0', desc: 'Doctors'},
        {id: 2, count: '0', desc: 'Lab Technicians'},
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `hcf/dashboardClinicDoctorCount/${hcfId}, dashboardDiagnosticCount/${hcfId} (2 concurrent calls)`);

      // PERFORMANCE: Fetch data concurrently
      const [dashboardClinicDoctorCount, dashboardDiagnosticCount] =
        await Promise.all([
          axiosInstance.get(`hcf/dashboardClinicDoctorCount/${hcfId}`),
          axiosInstance.get(`hcf/dashboardDiagnosticCount/${hcfId}`),
        ]);

      Logger.info('Dashboard API responses received', {
        hasDoctorCount: !!dashboardClinicDoctorCount?.data,
        hasDiagnosticCount: !!dashboardDiagnosticCount?.data,
      });

      // ERROR HANDLING: Parse doctor count data - API returns array with objects
      let doctorCount = '0';
      if (dashboardClinicDoctorCount?.data) {
        if (
          Array.isArray(dashboardClinicDoctorCount.data) &&
          dashboardClinicDoctorCount.data.length > 0
        ) {
          doctorCount =
            dashboardClinicDoctorCount.data[0]?.doctor_count?.toString() || '0';
        } else if (dashboardClinicDoctorCount.data?.doctor_count) {
          doctorCount = dashboardClinicDoctorCount.data.doctor_count.toString();
        }
      }

      // ERROR HANDLING: Parse diagnostic count data - API returns array with objects
      let diagCount = '0';
      if (dashboardDiagnosticCount?.data) {
        if (
          Array.isArray(dashboardDiagnosticCount.data) &&
          dashboardDiagnosticCount.data.length > 0
        ) {
          diagCount =
            dashboardDiagnosticCount.data[0]?.diagnostic_staff_count?.toString() ||
            '0';
        } else if (dashboardDiagnosticCount.data?.diagnostic_staff_count) {
          diagCount = dashboardDiagnosticCount.data.diagnostic_staff_count.toString();
        }
      }

      Logger.debug('Dashboard counts extracted', { doctorCount, diagCount });

      setCards([
        {id: 1, count: doctorCount, desc: 'Doctors'},
        {id: 2, count: diagCount, desc: 'Lab Technicians'},
      ]);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load dashboard data. Please try again later.';

      Logger.error('Error fetching HCF dashboard data', {
        status: error?.response?.status,
        message: errorMessage,
        hcfId: hcfId,
        error: error,
      });

      setError(errorMessage);

      // Set default values on error
      setCards([
        {id: 1, count: '0', desc: 'Doctors'},
        {id: 2, count: '0', desc: 'Lab Technicians'},
      ]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * API: Fetch dashboard data using userId from auth context
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * PERFORMANCE: Concurrent API calls using Promise.all
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchDashboardData = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for HCF dashboard', { userId });
      setCards([
        {id: 1, count: '0', desc: 'Doctors'},
        {id: 2, count: '0', desc: 'Lab Technicians'},
      ]);
      setLoading(false);
      setError(errorMsg);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `hcf/dashboardClinicDoctorCount/${userId}, dashboardDiagnosticCount/${userId} (2 concurrent calls)`);

      // PERFORMANCE: Fetch data concurrently
      const [dashboardClinicDoctorCount, dashboardDiagnosticCount] =
        await Promise.all([
          axiosInstance.get(`hcf/dashboardClinicDoctorCount/${userId}`),
          axiosInstance.get(`hcf/dashboardDiagnosticCount/${userId}`),
        ]);

      Logger.info('Dashboard API responses received', {
        hasDoctorCount: !!dashboardClinicDoctorCount?.data,
        hasDiagnosticCount: !!dashboardDiagnosticCount?.data,
      });

      // ERROR HANDLING: Parse doctor count data - API returns array with objects
      let doctorCount = '0';
      if (dashboardClinicDoctorCount?.data) {
        if (
          Array.isArray(dashboardClinicDoctorCount.data) &&
          dashboardClinicDoctorCount.data.length > 0
        ) {
          doctorCount =
            dashboardClinicDoctorCount.data[0]?.doctor_count?.toString() || '0';
        } else if (dashboardClinicDoctorCount.data?.doctor_count) {
          doctorCount = dashboardClinicDoctorCount.data.doctor_count.toString();
        }
      }

      // ERROR HANDLING: Parse diagnostic count data - API returns array with objects
      let diagCount = '0';
      if (dashboardDiagnosticCount?.data) {
        if (
          Array.isArray(dashboardDiagnosticCount.data) &&
          dashboardDiagnosticCount.data.length > 0
        ) {
          diagCount =
            dashboardDiagnosticCount.data[0]?.diagnostic_staff_count?.toString() ||
            '0';
        } else if (dashboardDiagnosticCount.data?.diagnostic_staff_count) {
          diagCount = dashboardDiagnosticCount.data.diagnostic_staff_count.toString();
        }
      }

      Logger.debug('Dashboard counts extracted', { doctorCount, diagCount });

      setCards([
        {id: 1, count: doctorCount, desc: 'Doctors'},
        {id: 2, count: diagCount, desc: 'Lab Technicians'},
      ]);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load dashboard data. Please try again later.';

      Logger.error('Error fetching HCF dashboard data', {
        status: error?.response?.status,
        message: errorMessage,
        userId: userId,
        error: error,
      });

      setError(errorMessage);

      // Set default values on error
      setCards([
        {id: 1, count: '0', desc: 'Doctors'},
        {id: 2, count: '0', desc: 'Lab Technicians'},
      ]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  /**
   * EFFECT: Fetch dashboard data on mount
   * 
   * SECURITY: Handles AsyncStorage access with proper error handling
   * FALLBACK: If userId from context is invalid, checks AsyncStorage directly
   */
  useEffect(() => {
    Logger.debug('useEffect triggered', { userId });

    if (userId && userId !== 'null' && userId !== 'token') {
      Logger.debug('Valid userId found, fetching dashboard data');
      fetchDashboardData();
    } else {
      Logger.debug('Invalid userId from context, checking AsyncStorage');

      // SECURITY: Check AsyncStorage directly for HCF Admin (fallback)
      const checkAsyncStorage = async () => {
        try {
          const storedSuid = await AsyncStorage.getItem('suid');
          const storedRoleId = await AsyncStorage.getItem('role_id');

          Logger.debug('AsyncStorage check', {
            hasStoredSuid: !!storedSuid,
            storedRoleId: storedRoleId,
          });

          if (storedSuid && storedSuid !== 'token' && storedSuid !== 'null') {
            try {
              const parsedSuid = JSON.parse(storedSuid);
              Logger.info('Using parsed suid from AsyncStorage', { parsedSuid });
              fetchDashboardDataWithUserId(parsedSuid);
              return;
            } catch (parseError) {
              Logger.error('Error parsing storedSuid', { error: parseError });
            }
          }

          Logger.warn('No valid userId found, setting default cards');
          setCards([
            {id: 1, count: '0', desc: 'Doctors'},
            {id: 2, count: '0', desc: 'Lab Technicians'},
          ]);
          setLoading(false);
        } catch (error) {
          Logger.error('Error checking AsyncStorage', { error });
          setCards([
            {id: 1, count: '0', desc: 'Doctors'},
            {id: 2, count: '0', desc: 'Lab Technicians'},
          ]);
          setLoading(false);
        }
      };

      checkAsyncStorage();
    }
  }, [userId]);

  Logger.debug('Rendering AdminDashboardScreen', {
    cardsCount: cards.length,
    loading,
    hasError: !!error,
  });

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* DASHBOARD CARDS */}
          <View>
            {loading ? (
              <View style={styles.centerContainer}>
                <CustomLoader />
                <Text style={styles.loadingText}>Loading dashboard data...</Text>
              </View>
            ) : error ? (
              <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Text style={styles.retryText} onPress={fetchDashboardData}>
                  Tap to retry
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>
                  Dashboard Cards: {cards.length} items
                </Text>
                <CustomCountDisplayCard cards={cards} />
              </>
            )}
          </View>

          {/* NOTIFICATIONS BUTTON */}
          <View>
            <CustomButton
              title="Notifications"
              bgColor={COLORS.PRIMARY} // DESIGN: Use color constant
              borderRadius={8}
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              height={hp(5.5)}
              width={wp(35)}
              fontSize={hp(1.8)}
              fontfamily={'Poppins-Medium'}
            />
          </View>

          {/* NOTIFICATIONS SECTION */}
          <View style={styles.notificationsContainer}>
            <Text style={styles.sectionTitle}>Notifications Section</Text>
            <CustomNotificationRoundedList />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  safeArea: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  content: {
    padding: 15,
    gap: 10,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: hp(30),
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Medium',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.ERROR, // DESIGN: Use color constant
    fontSize: hp(2),
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
  retryText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontSize: hp(1.6),
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
  },
  notificationsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    padding: 15,
  },
});

export default AdminDashboardScreen;
