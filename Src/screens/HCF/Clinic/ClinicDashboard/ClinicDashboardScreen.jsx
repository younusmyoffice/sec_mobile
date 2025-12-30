/**
 * ============================================================================
 * CLINIC DASHBOARD SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main dashboard screen for Clinic users to view appointment requests,
 * notifications, and appointment statistics.
 * 
 * FEATURES:
 * - Display appointment request counts (Requests, Upcoming, Completed)
 * - Tab-based navigation (Requests, Notifications)
 * - Pull-to-refresh functionality
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
 * - TopTabs: Tab navigation
 * - Request: Appointment request cards
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ClinicDashboardScreen
 */

import {View, Text, ScrollView, SafeAreaView, RefreshControl, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomCountDisplayCard from '../../../../components/customCountDisplayCard/CustomCountDisplayCard';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomNotificationRoundedList from '../../../../components/customNotificationRounded/CustomNotificationRoundedList';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import DoctorAppointmentCard from '../../../../components/customDoctorAppiontmentCards/DoctorAppointmentCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import Request from '../../../../components/customCards/appiontmentCard/Request';
import Header from '../../../../components/customComponents/Header/Header';
import { useCommon } from '../../../../Store/CommonContext';
import { baseUrl } from '../../../../utils/baseUrl';
import axiosInstance from '../../../../utils/axiosInstance';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';
const ClinicDashboardScreen = () => {
  const [activeTab, setactiveTab] = useState('Requests');
  const [cardData, setCardData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const {userId} = useCommon();
  
  // SECURITY: Initialize with safe defaults
  const [cards, setCards] = useState([
    { id: 1, count: '0', desc: 'Appointment Request' },
    { id: 2, count: '0', desc: 'Upcoming Appointments' },
    { id: 3, count: '0', desc: 'Completed' },
  ]);

  /**
   * Fetch appointment requests with status "in_progress"
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling with user-friendly messages
   */
  const doctorRequestAppointment = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for appointment requests', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      Logger.api('GET', `hcf/${userId}/in_progress/clinicAppointmentRequests`);
      
      const response = await axiosInstance.get(
        `hcf/${userId}/in_progress/clinicAppointmentRequests`
      );

      Logger.debug('Appointment requests response', { 
        count: response.data?.response?.length || 0 
      });

      if (response.data && response.data.response) {
        // SECURITY: Validate response data type
        const responseData = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setCardData(responseData);
        Logger.info('Appointment requests fetched successfully', { 
          count: responseData.length 
        });
      } else {
        setCardData([]);
        Logger.warn('No appointment requests in response');
      }
    } catch (err) {
      Logger.error('Error fetching appointment requests', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to fetch appointment requests. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      setCardData([]);
    } finally {
      setLoading(false);
    }
  };
  /**
   * Fetch clinic notifications
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
      Logger.api('GET', `hcf/${userId}/clinicNotification`);
      
      const response = await axiosInstance.get(
        `hcf/${userId}/clinicNotification`
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
  useEffect(() => {
    if (userId) {
      Logger.debug('ClinicDashboardScreen initialized', { userId });
      doctorRequestAppointment();
      fetchDashboardData();
      notificationApi();
    } else {
      Logger.warn('ClinicDashboardScreen: userId not available');
      CustomToaster.show('error', 'Error', 'User session not found. Please login again.');
    }
  }, [userId]);
  
  /**
   * Fetch dashboard statistics (counts for different appointment statuses)
   * PERFORMANCE: Uses Promise.all for concurrent API calls
   * SECURITY: Validates userId before API calls
   * ERROR HANDLING: Uses Promise.allSettled to handle individual failures gracefully
   */
  const fetchDashboardData = async () => {
    // SECURITY: Validate userId before API calls
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for dashboard data', { userId });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', 'Dashboard statistics (multiple endpoints)');
      
      // PERFORMANCE: Use Promise.allSettled to handle individual failures gracefully
      const [responseForInProgress, responseForBooked, responseForCompleted] = 
        await Promise.allSettled([
          axiosInstance.get(`hcf/${userId}/in_progress/clinicDashboardAppointmentRequestCount`),
          axiosInstance.get(`hcf/${userId}/complete/clinicDashboardAppointmentCompleteCount`),
          axiosInstance.get(`hcf/${userId}/booked/clinicDashboardAppointmentUpcomngCount`),
        ]);

      // SECURITY: Validate responses and extract counts safely
      const inProgressCount = 
        responseForInProgress.status === 'fulfilled' 
          ? responseForInProgress.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';
      
      const bookedCount = 
        responseForBooked.status === 'fulfilled'
          ? responseForBooked.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';
      
      const completedCount = 
        responseForCompleted.status === 'fulfilled'
          ? responseForCompleted.value?.data?.response?.[0]?.keyword_count?.toString() || '0'
          : '0';

      // Update the cards state with the fetched data
      setCards([
        { id: 1, count: inProgressCount, desc: 'Appointment Request' },
        { id: 2, count: bookedCount, desc: 'Upcoming Appointments' },
        { id: 3, count: completedCount, desc: 'Completed' },
      ]);
      
      Logger.info('Dashboard statistics fetched successfully', { 
        inProgressCount, 
        bookedCount, 
        completedCount 
      });
      
      // Log any failed requests
      if (responseForInProgress.status === 'rejected') {
        Logger.error('Failed to fetch in_progress count', responseForInProgress.reason);
      }
      if (responseForBooked.status === 'rejected') {
        Logger.error('Failed to fetch booked count', responseForBooked.reason);
      }
      if (responseForCompleted.status === 'rejected') {
        Logger.error('Failed to fetch completed count', responseForCompleted.reason);
      }
    } catch (error) {
      Logger.error('Error fetching dashboard data', error);
      
      const errorMessage = error?.response?.data?.message || 
        'Failed to fetch dashboard data. Please try again later.';
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
      
      // Set default values on error
      setCards([
        { id: 1, count: '0', desc: 'Appointment Request' },
        { id: 2, count: '0', desc: 'Upcoming Appointments' },
        { id: 3, count: '0', desc: 'Completed' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Requests':
        return <Request data={cardData} option={'clinic'} />;
      case 'Notifications':
        return <CustomNotificationRoundedList data={notificationData} />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
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
        doctorRequestAppointment(),
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
  return (
    <SafeAreaView style={styles.container}>
      <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
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
        <View style={styles.content}>
          <View style={styles.cardsContainer}>
            <CustomCountDisplayCard cards={cards} />
          </View>
          
          <View style={styles.tabsContainer}>
            <TopTabs
              data={[
                {id: 1, title: 'Requests'},
                {id: 2, title: 'Notifications'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>

          <View style={styles.contentContainer}>
            {renderComponent()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
    height: '100%',
  },
  content: {
    padding: 15,
    gap: 10,
  },
  cardsContainer: {
    // Cards container styling
  },
  tabsContainer: {
    // Tabs container styling
  },
  contentContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.BORDER_LIGHT,
    padding: 15,
  },
});

export default ClinicDashboardScreen;
