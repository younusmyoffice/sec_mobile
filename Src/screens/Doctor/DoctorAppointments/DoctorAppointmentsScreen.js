/**
 * ============================================================================
 * SCREEN: Doctor Appointments
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for doctors to manage appointments (Requests, Upcoming, Completed, Cancelled)
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - No direct user input, all data from API
 * 
 * FEATURES:
 * - Appointment request management
 * - Upcoming appointments view
 * - Completed appointments view
 * - Cancelled appointments view
 * - Chat integration
 * - Pull-to-refresh functionality
 * 
 * @module DoctorAppointmentsScreen
 */

import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import Header from '../../../components/customComponents/Header/Header';
import UpComming from '../../../components/customCards/appiontmentCard/UpComming';
import Completed from '../../../components/customCards/appiontmentCard/Completed';
import Cancelled from '../../../components/customCards/appiontmentCard/Cancelled';
import ChatsScreen from '../../../components/AppointmentComponents/ChatsScreen';
import Request from '../../../components/customCards/appiontmentCard/Request';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import {baseUrl} from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useCommon} from '../../../Store/CommonContext';
import CustomToaster from '../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();

export default function DoctorAppointmentsScreen() {
  const {userId} = useCommon();
  const navigation = useNavigation();

  // STATE: Active tab selection
  const [activeTab, setActiveTab] = useState('Request');
  
  // STATE: Appointment data
  const [upcommingAppointment, setUpcommingAppointment] = useState([]);
  const [completedAppointment, setCompletedAppointment] = useState([]);
  const [cancelledAppointment, setCancelledAppointment] = useState([]);
  const [cardData, setCardData] = useState([]);
  
  // STATE: Loading and error management
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  Logger.debug('Doctor Appointments Screen initialized', { userId });

  /**
   * API: Fetch upcoming appointments
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with graceful empty states
   * 
   * @returns {Promise<void>}
   */
  const doctorUpcommingAppointment = async () => {
    setRefreshing(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/UpcomingAppointmentsDoctor', {
        doctor_id: userId,
        status_booked: 'booked',
      });

      const response = await axiosInstance.post(
        `${baseUrl}Doctor/UpcomingAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_booked: 'booked',
        },
      );

      Logger.info('Upcoming appointments fetched successfully', {
        count: response?.data?.response?.length || 0,
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setUpcommingAppointment(response.data.response);
      } else {
        Logger.warn('No upcoming appointments found');
        setUpcommingAppointment([]); // Set empty array for graceful empty state handling
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          'Failed to fetch upcoming appointments';

      Logger.error('Error fetching upcoming appointments', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // Handle 404 errors gracefully - show empty state instead of error
      if (err?.response?.status === 404) {
        Logger.info('404 Error - No upcoming appointments available');
        setUpcommingAppointment([]);
      } else {
        setError(errorMessage);
        setUpcommingAppointment([]);
        // REUSABLE TOAST: Show error only for non-404 errors
        CustomToaster.show('error', 'Error', errorMessage);
      }
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * API: Fetch appointment requests
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with graceful empty states
   * 
   * @returns {Promise<void>}
   */
  const doctorRequestAppointment = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/AppointmentsRequests', {
        doctor_id: userId,
        status_in_progress: 'in_progress',
      });

      const response = await axiosInstance.post(`Doctor/AppointmentsRequests`, {
        doctor_id: userId,
        status_in_progress: 'in_progress',
      });

      Logger.info('Appointment requests fetched successfully', {
        count: response?.data?.response?.length || 0,
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setCardData(response.data.response);
      } else {
        Logger.warn('No appointment requests found');
        setCardData([]); // Set empty array for graceful empty state handling
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          'Failed to fetch appointment requests. Please try again later.';

      Logger.error('Error fetching appointment requests', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // Handle 404 errors gracefully
      if (err?.response?.status === 404) {
        Logger.info('404 Error - No appointment requests available');
        setCardData([]);
      } else {
        setError(errorMessage);
        setCardData([]);
        // REUSABLE TOAST: Show error only for non-404 errors
        CustomToaster.show('error', 'Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * API: Fetch completed appointments
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with graceful empty states
   * 
   * @returns {Promise<void>}
   */
  const doctorCompletedAppointment = async () => {
    setRefreshing(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/CompletedAppointmentsDoctor', {
        doctor_id: userId,
        status_complete: 'completed',
      });

      const response = await axiosInstance.post(
        `${baseUrl}Doctor/CompletedAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_complete: 'completed',
        },
      );

      Logger.info('Completed appointments fetched successfully', {
        count: response?.data?.response?.length || 0,
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setCompletedAppointment(response.data.response);
      } else {
        Logger.warn('No completed appointments found');
        setCompletedAppointment([]); // Set empty array for graceful empty state handling
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          'Failed to fetch completed appointments';

      Logger.error('Error fetching completed appointments', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // Handle 404 errors gracefully
      if (err?.response?.status === 404) {
        Logger.info('404 Error - No completed appointments available');
        setCompletedAppointment([]);
      } else {
        setError(errorMessage);
        setCompletedAppointment([]);
        // REUSABLE TOAST: Show error only for non-404 errors
        CustomToaster.show('error', 'Error', errorMessage);
      }
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * API: Fetch cancelled appointments
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with graceful empty states
   * 
   * @returns {Promise<void>}
   */
  const doctorCancelledAppointment = async () => {
    setRefreshing(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/CancelledAppointmentsDoctor', {
        doctor_id: userId,
        status_cancel: 'canceled',
      });

      const response = await axiosInstance.post(
        `${baseUrl}Doctor/CancelledAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_cancel: 'canceled',
        },
      );

      Logger.info('Cancelled appointments fetched successfully', {
        count: response?.data?.response?.length || 0,
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setCancelledAppointment(response.data.response);
      } else {
        Logger.warn('No cancelled appointments found');
        setCancelledAppointment([]); // Set empty array for graceful empty state handling
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          'Failed to fetch cancelled appointments';

      Logger.error('Error fetching cancelled appointments', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // Handle 404 errors gracefully
      if (err?.response?.status === 404) {
        Logger.info('404 Error - No cancelled appointments available');
        setCancelledAppointment([]);
      } else {
        setError(errorMessage);
        setCancelledAppointment([]);
        // REUSABLE TOAST: Show error only for non-404 errors
        CustomToaster.show('error', 'Error', errorMessage);
      }
    } finally {
      setRefreshing(false);
    }
  };
  /**
   * HANDLER: Refresh appointment data
   * 
   * Called after appointment actions (accept, reject, etc.) to refresh the list
   */
  const reRenderApi = () => {
    Logger.debug('Refreshing appointment data');
    doctorRequestAppointment();
    doctorUpcommingAppointment();
  };

  /**
   * EFFECT: Fetch all appointment data when screen comes into focus
   * 
   * Refresh data when user navigates back to this screen
   */
  useFocusEffect(
    useCallback(() => {
      Logger.debug('Screen focused - Fetching all appointment data');
      doctorRequestAppointment();
      doctorUpcommingAppointment();
      doctorCompletedAppointment();
      doctorCancelledAppointment();
    }, [userId]), // Include userId in dependencies
  );

  /**
   * HANDLER: Navigate to chat or appointment details based on plan
   * 
   * @param {string} planName - Plan name from appointment data
   */
  const AppointmentNavigation = planName => {
    Logger.debug('Appointment navigation triggered', { planName });
    
    if (planName === 'null') {
      navigation.navigate('ChatHomeMain');
      Logger.info('Navigating to ChatHomeMain (no plan)');
    } else {
      Logger.info('Plan exists - staying on current screen', { planName });
      // TODO: Add navigation for appointments with plans
    }
  };

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate appointment list component for the selected tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Request':
        return (
          <Request
            data={cardData}
            reRenderApi={reRenderApi}
            loader={loading}
            option={'doctor'}
          />
        );
      case 'Upcomming':
        return (
          <UpComming
            isDoctor={true}
            rescheduleEndpiont={'patient/resheduleAppointment'}
            onPress={AppointmentNavigation}
            data={upcommingAppointment}
            loader={loading}
          />
        );

      case 'Completed':
        return <Completed data={completedAppointment} loader={loading} />;
      case 'Cancled':
        return <Cancelled data={cancelledAppointment} loader={loading} />;
      case 'ChatsScreen':
        return <ChatsScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          notificationUserIcon={true}
        />
      </View>
      <ScrollView
        refreshControl={
          activeTab === 'Request' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={doctorRequestAppointment}
              colors={[COLORS.PRIMARY]} // DESIGN: Use color constant
            />
          ) : activeTab === 'Upcomming' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={doctorUpcommingAppointment}
              colors={[COLORS.PRIMARY]} // DESIGN: Use color constant
            />
          ) : activeTab === 'Completed' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={doctorCompletedAppointment}
              colors={[COLORS.PRIMARY]} // DESIGN: Use color constant
            />
          ) : activeTab === 'Cancled' ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={doctorCancelledAppointment}
              colors={[COLORS.PRIMARY]} // DESIGN: Use color constant
            />
          ) : null
        }>
        
        {activeTab === 'Staff' ? (
          <View
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
              paddingHorizontal: 15,
            }}>
            <CustomButton
              title="Create Staff"
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.PRIMARY} // DESIGN: Use color constant
              borderWidth={1}
              borderRadius={30}
              width={wp(35)}
              fontfamily="Poppins-SemiBold"
              // TODO: Implement staff creation functionality
              // onPress={() => setisAllow(!isAllow)}
              // showhide={isAllow}
            />
          </View>
        ) : null}
        <View style={styles.tabsContainer}>
          <TopTabs
            borderRadius={8}
            bordercolor={COLORS.BG_WHITE} // DESIGN: Use color constant
            data={[
              {title: 'Request'},
              {title: 'Upcomming'},
              {title: 'Completed'},
              {title: 'Cancled'},
              {title: 'ChatsScreen'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>
        
        {/* REUSABLE LOADER: Show loader while fetching initial data */}
        {loading && activeTab === 'Request' && <CustomLoader />}
        
        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    flex: 1,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
