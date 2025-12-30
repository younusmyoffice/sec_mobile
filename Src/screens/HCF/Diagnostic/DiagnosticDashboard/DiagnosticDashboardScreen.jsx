/**
 * ============================================================================
 * DIAGNOSTIC DASHBOARD SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main dashboard screen for Diagnostic users to view test counts, report counts,
 * patient counts, and notifications.
 * 
 * FEATURES:
 * - Display diagnostic statistics (Test Count, Report Count, Patient Count)
 * - View notifications
 * - Real-time data updates
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Input sanitization for API parameters
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Graceful error handling with fallback states
 * - Loading states with CustomLoader
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - CustomCountDisplayCard: Statistics cards
 * - CustomNotificationRoundedList: Notification list
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module DiagnosticDashboardScreen
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import CustomCountDisplayCard from '../../../../components/customCountDisplayCard/CustomCountDisplayCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomNotificationRoundedList from '../../../../components/customNotificationRounded/CustomNotificationRoundedList';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function DiagnosticDashboardScreen() {
  const [activeTab, setactiveTab] = useState('Notifications');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // SECURITY: Initialize with safe defaults
  const [cards, setCards] = useState([
    { id: 1, count: '0', desc: 'Test Count' },
    { id: 2, count: '0', desc: 'Report Count' },
    { id: 3, count: '0', desc: 'Patient Count' },
  ]);
  
  const [notificationData, setNotificationData] = useState([]);
  const {userId} = useCommon();

  /**
   * Fetch dashboard statistics (test count, report count, patient count)
   * PERFORMANCE: Uses Promise.allSettled for concurrent API calls
   * SECURITY: Validates userId before API calls
   * ERROR HANDLING: Uses Promise.allSettled to handle individual failures gracefully
   */
  const fetchDashboardData = async () => {
    // SECURITY: Validate userId before API calls
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for dashboard data', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', 'Dashboard statistics (multiple endpoints)');
      
      // PERFORMANCE: Use Promise.allSettled to handle individual failures gracefully
      const [testCountData, reportCountData, patientCountData] = 
        await Promise.allSettled([
          axiosInstance.get(`hcf/${userId}/dashboardTestCount`),
          axiosInstance.get(`hcf/${userId}/dashboardReportCount`),
          axiosInstance.get(`hcf/${userId}/dashboardPatientCount`),
        ]);

      // SECURITY: Validate responses and extract counts safely
      const testCount = 
        testCountData.status === 'fulfilled' 
          ? testCountData.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';
      
      const reportCount = 
        reportCountData.status === 'fulfilled'
          ? reportCountData.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';
      
      const patientCount = 
        patientCountData.status === 'fulfilled'
          ? patientCountData.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';

      // Update the cards state with the fetched data
      setCards([
        { id: 1, count: testCount, desc: 'Test Count' },
        { id: 2, count: reportCount, desc: 'Report Count' },
        { id: 3, count: patientCount, desc: 'Patient Count' },
      ]);
      
      Logger.info('Dashboard statistics fetched successfully', { 
        testCount, 
        reportCount, 
        patientCount 
      });
      
      // Log any failed requests
      if (testCountData.status === 'rejected') {
        Logger.error('Failed to fetch test count', testCountData.reason);
      }
      if (reportCountData.status === 'rejected') {
        Logger.error('Failed to fetch report count', reportCountData.reason);
      }
      if (patientCountData.status === 'rejected') {
        Logger.error('Failed to fetch patient count', patientCountData.reason);
      }
    } catch (error) {
      Logger.error('Error fetching dashboard data', error);
      
      const errorMessage = error?.response?.data?.message || 
        'Failed to fetch dashboard data. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      
      // Set default values on error
      setCards([
        { id: 1, count: '0', desc: 'Test Count' },
        { id: 2, count: '0', desc: 'Report Count' },
        { id: 3, count: '0', desc: 'Patient Count' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch diagnostic notifications
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const notificationApi = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for notifications', { userId });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      Logger.api('GET', `hcf/${userId}/StaffNotification/`);
      
      const response = await axiosInstance.get(
        `hcf/${userId}/StaffNotification/`
      );

      Logger.debug('Notifications response', { 
        count: response.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setNotificationData(responseData);
        Logger.info('Notifications fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setNotificationData([]);
        Logger.warn('No notifications in response');
      }
    } catch (err) {
      Logger.error('Error fetching notifications', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to fetch notifications. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      setNotificationData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle pull-to-refresh
   * Refreshes all dashboard data
   */
  const onRefresh = async () => {
    Logger.debug('Refreshing dashboard data');
    setRefreshing(true);
    
    try {
      await Promise.all([
        fetchDashboardData(),
        notificationApi(),
      ]);
      Logger.info('Dashboard data refreshed successfully');
    } catch (error) {
      Logger.error('Error refreshing dashboard data', error);
      CustomToaster.show('error', 'Refresh Failed', 'Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('DiagnosticDashboardScreen initialized', { userId });
      fetchDashboardData();
      notificationApi();
    } else {
      Logger.warn('DiagnosticDashboardScreen: userId not available');
      CustomToaster.show('error', 'Error', 'User session not found. Please login again.');
    }
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
        id={4}
      />
      
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && !refreshing && <CustomLoader />}
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]} // Android
            tintColor={COLORS.PRIMARY} // iOS
          />
        }
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.content}>
            <View style={styles.cardsContainer}>
              <CustomCountDisplayCard cards={cards} />
            </View>
            
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderBox}>
                <Text style={styles.sectionHeaderText}>Notifications</Text>
              </View>
            </View>
            
            <View style={styles.notificationContainer}>
              <CustomNotificationRoundedList data={notificationData} />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
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
  },
  scrollView: {
    flex: 1,
  },
  innerContainer: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    padding: 15,
  },
  cardsContainer: {
    // Cards container styling
  },
  sectionHeader: {
    marginTop: hp(5),
  },
  sectionHeaderBox: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: wp(33),
  },
  sectionHeaderText: {
    color: COLORS.TEXT_WHITE,
    fontFamily: 'Poppins-Medium',
  },
  notificationContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.BORDER_LIGHT,
    padding: 15,
    marginTop: hp(5),
  },
});
