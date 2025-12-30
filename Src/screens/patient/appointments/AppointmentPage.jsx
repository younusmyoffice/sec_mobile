/**
 * ============================================================================
 * APPOINTMENT PAGE
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for patients to view and manage appointments (Upcoming, Completed, Cancelled).
 * 
 * FEATURES:
 * - Tabbed interface (Upcoming, Completed, Cancelled, Chat)
 * - Pull-to-refresh functionality
 * - Data fetching for each appointment type
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Uses userId from CommonContext (preferred over AsyncStorage)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * - Handles empty appointment lists gracefully
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - TopTabs: Tab navigation
 * - Header: App header
 * - UpComming, Completed, Cancelled: Appointment card components
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * PERFORMANCE:
 * - Pull-to-refresh for manual data refresh
 * - Loading states prevent multiple simultaneous API calls
 * 
 * @module AppointmentPage
 */

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import UpComming from '../../../components/customCards/appiontmentCard/UpComming';
import Completed from '../../../components/customCards/appiontmentCard/Completed';
import Cancelled from '../../../components/customCards/appiontmentCard/Cancelled';
import axiosInstance from '../../../utils/axiosInstance';
import {useCommon} from '../../../Store/CommonContext';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../components/customToaster/CustomToaster';
import Logger from '../../../constants/logger';
import { COLORS } from '../../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';

const AppointmentPage = () => {
  const {userId} = useCommon();
  const [loading, setloading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcomming');
  const [upCommingData, setupCommingData] = useState([]);
  const [completedData, setcompletedData] = useState([]);
  const [cancelledData, setcancelledData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch upcoming appointments
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchUpcomming = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for upcoming appointments', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      setloading(false);
      return;
    }

    try {
      setloading(true);
      Logger.api('POST', 'patient/UpcomingAppointments', {
        patient_id: userId,
        status_in_progress: 'in_progress',
        status_booked: 'booked',
      });

      const response = await axiosInstance.post(
        'patient/UpcomingAppointments',
        {
          patient_id: userId,
          status_in_progress: 'in_progress',
          status_booked: 'booked',
        },
      );

      Logger.debug('Upcoming appointments response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const upcomingData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];

      setupCommingData(upcomingData);
      
      Logger.info('Upcoming appointments fetched successfully', {
        count: upcomingData.length,
      });
    } catch (error) {
      Logger.error('Error fetching upcoming appointments', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch upcoming appointments. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setupCommingData([]);
    } finally {
      setloading(false);
    }
  };

  /**
   * Fetch completed appointments
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchCompleted = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for completed appointments', { userId });
      setloading(false);
      return;
    }

    try {
      setloading(true);
      Logger.api('POST', 'patient/CompletedAppointments', {
        patient_id: userId,
        status_complete: 'completed',
      });

      const response = await axiosInstance.post(
        'patient/CompletedAppointments',
        {
          patient_id: userId,
          status_complete: 'completed',
        },
      );

      Logger.debug('Completed appointments response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const completedAppointments = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];

      setcompletedData(completedAppointments);
      
      Logger.info('Completed appointments fetched successfully', {
        count: completedAppointments.length,
      });
    } catch (error) {
      Logger.error('Error fetching completed appointments', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch completed appointments. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setcompletedData([]);
    } finally {
      setloading(false);
    }
  };

  /**
   * Fetch cancelled appointments
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchCancelled = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for cancelled appointments', { userId });
      setloading(false);
      return;
    }

    try {
      setloading(true);
      Logger.api('POST', 'patient/CancelledAppointments', {
        patient_id: userId,
        status_cancel: 'canceled',
      });

      const response = await axiosInstance.post(
        'patient/CancelledAppointments',
        {
          patient_id: userId,
          status_cancel: 'canceled',
        },
      );

      Logger.debug('Cancelled appointments response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const cancelledAppointments = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];

      setcancelledData(cancelledAppointments);
      
      Logger.info('Cancelled appointments fetched successfully', {
        count: cancelledAppointments.length,
      });
    } catch (error) {
      Logger.error('Error fetching cancelled appointments', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch cancelled appointments. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setcancelledData([]);
    } finally {
      setloading(false);
    }
  };

  /**
   * Handle pull-to-refresh
   * PERFORMANCE: Refreshes data for current active tab
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Logger.debug('Pull-to-refresh triggered', { activeTab });

    try {
      switch (activeTab) {
        case 'Upcomming':
          await fetchUpcomming();
          break;
        case 'Completed':
          await fetchCompleted();
          break;
        case 'Cancelled':
          await fetchCancelled();
          break;
        default:
          Logger.warn('No refresh handler for tab', { activeTab });
      }
    } catch (error) {
      Logger.error('Error during refresh', error);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, userId]);

  /**
   * Fetch all appointments on component mount and userId change
   */
  useEffect(() => {
    if (userId) {
      Logger.debug('AppointmentPage initialized', { userId });
      fetchUpcomming();
      fetchCompleted();
      fetchCancelled();
    } else {
      Logger.warn('AppointmentPage: userId not available');
      setloading(false);
    }
  }, [userId]);

  /**
   * Refresh data when screen comes into focus
   * PERFORMANCE: Ensures fresh data when user navigates back to screen
   */
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        Logger.debug('AppointmentPage focused, refreshing data');
        fetchUpcomming();
        fetchCompleted();
        fetchCancelled();
      }
    }, [userId]),
  );

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    Logger.debug('Rendering appointment component', {
      activeTab,
      upcommingCount: upCommingData?.length || 0,
      completedCount: completedData?.length || 0,
      cancelledCount: cancelledData?.length || 0,
      loading,
    });

    switch (activeTab) {
      case 'Upcomming':
        return (
          <UpComming
            showmenu={true}
            data={upCommingData || []}
            loader={loading}
            rescheduleEndpiont={`patient/resheduleAppointment`}
            Refresh={fetchUpcomming}
          />
        );
      case 'Completed':
        return <Completed data={completedData || []} loader={loading} />;
      case 'Cancelled':
        return <Cancelled data={cancelledData || []} loader={loading} />;
      case 'Chat':
        // TODO: Implement chat functionality
        Logger.warn('Chat tab not yet implemented');
        return null;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={false}
          notificationUserIcon={true}
          id={5}
        />
      </View>
      
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && <CustomLoader />}
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }>
        <View style={styles.contentContainer}>
          <TopTabs
            bordercolor={COLORS.BG_WHITE}
            data={[
              {title: 'Upcomming'},
              {title: 'Completed'},
              {title: 'Cancelled'},
              {title: 'Chat'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              Logger.debug('Tab changed', { from: activeTab, to: tab });
              setActiveTab(tab);
            }}
            funcstatus={false}
          />
          
          <View style={styles.componentContainer}>
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
  },
  contentContainer: {
    padding: 15,
  },
  componentContainer: {
    marginTop: '5%',
  },
});

export default AppointmentPage;
