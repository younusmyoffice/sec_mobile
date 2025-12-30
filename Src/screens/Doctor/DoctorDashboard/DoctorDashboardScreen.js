/**
 * ============================================================================
 * SCREEN: Doctor Dashboard
 * ============================================================================
 * 
 * PURPOSE:
 * Main dashboard screen for doctors showing appointment requests, counts, and
 * notifications
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection)
 * - Input sanitization handled by axios interceptors
 * - Error handling with user-friendly messages
 * 
 * FEATURES:
 * - Appointment request management
 * - Dashboard statistics (counts)
 * - Notification display
 * - Pull-to-refresh functionality
 * 
 * @module DoctorDashboardScreen
 */

import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import CustomCountDisplayCard from '../../../components/customCountDisplayCard/CustomCountDisplayCard';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomNotificationRoundedList from '../../../components/customNotificationRounded/CustomNotificationRoundedList';
import AppointmentCard from '../../../components/customCards/appiontmentCard/CustomAppointmentCard';
import Header from '../../../components/customComponents/Header/Header';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader';

// Utils & Services
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Uses axiosInstance with auto token injection
import {useCommon} from '../../../Store/CommonContext';
import {useAuth} from '../../../Store/Authentication';
import CustomToaster from '../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

export default function DoctorDashboardScreen() {
  // CONTEXT: Get user data from context providers
  const {userId} = useCommon();
  const {doctorDetails} = useAuth();
  
  Logger.debug('Doctor Dashboard initialized', { userId, hasDoctorDetails: !!doctorDetails });
  
  // STATE: Appointment count cards
  const [cards, setCards] = useState([
    {id: 1, count: '0', desc: 'Appointment Request'},
    {id: 2, count: '0', desc: 'Upcoming Appointments'},
    {id: 3, count: '0', desc: 'Completed'},
  ]);

  // STATE: Active tab selection
  const [notificatonRequestSt, setNotificatonRequestSt] = useState('Request');
  const [cardData, setCardData] = useState([]); // FIX: Changed from boolean to array

  // STATE: Loading and error management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * API: Fetch appointment requests for doctor
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with user feedback
   * 
   * @returns {Promise<void>}
   */
  const doctorRequestAppointment = async () => {
    setLoading(true);
    setError(null); // Reset error state before the request
    
    try {
      Logger.api('POST', 'Doctor/AppointmentsRequests', { doctor_id: userId });
      
      const response = await axiosInstance.post(`Doctor/AppointmentsRequests`, {
        doctor_id: userId,
        status_in_progress: 'in_progress',
      });

      Logger.info('Appointment requests fetched successfully', { 
        count: response?.data?.response?.length || 0 
      });

      // ERROR HANDLING: Validate and handle response data
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setCardData(response.data.response);
      } else {
        Logger.warn('No appointment requests found');
        setCardData([]); // Set empty array for graceful empty state
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
      
      setError(errorMessage);
      
      // REUSABLE TOAST: Show error message to user
      CustomToaster.show('error', 'Error', errorMessage);
      
      // Set empty array on error for graceful fallback
      setCardData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * API: Fetch dashboard statistics (appointment counts)
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * PERFORMANCE: Concurrent API calls using Promise.all
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/DocDashoardCount (3 concurrent calls)');

      // PERFORMANCE: Use Promise.all to fetch data concurrently
      const [responseForInProgress, responseForBooked, responseForCompleted] =
        await Promise.all([
          axiosInstance.post(`Doctor/DocDashoardCount`, {
            doctor_id: userId,
            status: 'in_progress',
          }),
          axiosInstance.post(`Doctor/DocDashoardCount`, {
            doctor_id: userId,
            status: 'booked',
          }),
          axiosInstance.post(`Doctor/DocDashoardCount`, {
            doctor_id: userId,
            status: 'completed',
          }),
        ]);

      // ERROR HANDLING: Validate responses and extract counts safely
      const inProgressCount =
        responseForInProgress?.data?.response?.[0]?.keyword_count || '0';
      const bookedCount =
        responseForBooked?.data?.response?.[0]?.keyword_count || '0';
      const completedCount =
        responseForCompleted?.data?.response?.[0]?.keyword_count || '0';

      Logger.info('Dashboard data fetched successfully', {
        inProgress: inProgressCount,
        booked: bookedCount,
        completed: completedCount,
      });

      // Update the cards state with the fetched data
      setCards([
        {id: 1, count: inProgressCount, desc: 'Appointment Request'},
        {id: 2, count: bookedCount, desc: 'Upcoming Appointments'},
        {id: 3, count: completedCount, desc: 'Completed'},
      ]);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = error?.response?.data?.message || 
                          'Failed to fetch dashboard data. Please try again later.';
      
      Logger.error('Error fetching doctor dashboard data', {
        status: error?.response?.status,
        message: errorMessage,
      });
      
      setError(errorMessage);
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  /**
   * API: Accept appointment request
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling with user feedback
   * SUCCESS MESSAGE: Shows success toast notification
   * 
   * @param {Object} ApiData - Appointment data
   * @param {number} ApiData.appointment_id - Appointment ID
   * @param {number} ApiData.patient_id - Patient ID
   * @param {number} ApiData.doctor_id - Doctor ID
   * @returns {Promise<void>}
   */
  const acceptAppointment = async ApiData => {
    setLoading(true);
    setError(null);

    try {
      Logger.api('POST', 'Doctor/AppointmentsRequestsAccept', {
        appointment_id: ApiData.appointment_id,
      });

      const response = await axiosInstance.post(
        `Doctor/AppointmentsRequestsAccept`,
        {
          appointment_id: ApiData.appointment_id,
          patient_id: ApiData.patient_id,
          doctor_id: ApiData.doctor_id,
          status: 'in_progress',
          option: 'accept',
        },
      );

      Logger.info('Appointment accepted successfully', {
        appointment_id: ApiData.appointment_id,
      });

      // REUSABLE TOAST: Show success message
      CustomToaster.show('success', 'Success', 'Appointment accepted successfully');

      // Refresh appointment requests list
      doctorRequestAppointment();
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        err?.response?.data?.message ||
        'Failed to accept appointment. Please try again later.';
      
      Logger.error('Error accepting appointment', {
        status: err?.response?.status,
        message: errorMessage,
      });
      
      setError(errorMessage);
      
      // REUSABLE TOAST: Show error message to user
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // STATE: Notification data
  const [notificationData, setNotificationData] = useState([]);

  /**
   * API: Fetch doctor notifications
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const notificationApi = async () => {
    try {
      Logger.api('GET', `Doctor/DoctorNotification/${userId}`);

      const response = await axiosInstance.get(
        `Doctor/DoctorNotification/${userId}`,
      );

      if (response?.data?.response && Array.isArray(response.data.response)) {
        Logger.info('Notifications fetched successfully', {
          count: response.data.response.length,
        });
        setNotificationData(response.data.response);
      } else {
        Logger.warn('No notifications found');
        setNotificationData([]);
      }
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          'Failed to fetch notifications. Please try again.';
      
      Logger.error('Error fetching notifications', {
        status: err?.response?.status,
        message: errorMessage,
      });
      
      // REUSABLE TOAST: Show error message (non-blocking)
      CustomToaster.show('error', 'Error', errorMessage);
      
      setNotificationData([]);
    }
  };

  useEffect(() => {
    // Call the function to fetch data on component mount
    fetchDashboardData();
    doctorRequestAppointment();
    notificationApi();
  }, [userId]); // Empty dependency array ensures the API is called only once when the component mounts
  const navigation = useNavigation();
  const onRefresh=()=>{
    fetchDashboardData();
    doctorRequestAppointment();
    notificationApi();
  }
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View>
        <Header
          navigationProps={'ProfileScreenDoctor'}
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          notificationUserIcon={true}
          id={3}
        />
      </View>
      <ScrollView
        style={{backgroundColor: '#fff'}}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }>
        <View style={{padding: 15}}>
          <View
            style={{
              backgroundColor: '#fff',
              marginVertical: 15,
              height: 110,
              borderWidth: 2,
              borderColor: COLORS.PRIMARY, // DESIGN: Use color constant
              padding: 10,
              borderRadius: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              flexDirection: 'row',
              flex: 1,
              gap: 5,
            }}>
            <View
              style={{
                flex: 3,
                backgroundColor: '#fff',
                justifyContent: 'center',
                height: '100%',
                padding: 5,
              }}>
              <Image
                source={{uri: doctorDetails?.profile_picture}}
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: '#000',
                }}
              />
            </View>
            <View
              style={{
                flex: 8,
                backgroundColor: '#fff',
                height: '100%',
                padding: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: '#331003',
                }}>
                Dr.
                {doctorDetails?.first_name +
                  ' ' +
                  doctorDetails?.middle_name +
                  ' ' +
                  doctorDetails?.last_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: 'grey',
                }}>
                {doctorDetails?.department_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: 'grey',
                }}>
                {doctorDetails?.hospital_org}
              </Text>
            </View>
            <View
              style={{
                flex: 2,
                backgroundColor: '#fff',
                height: '100%',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProfileScreenDoctor')}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={30}
                  color={COLORS.PRIMARY} // DESIGN: Use color constant
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <CustomCountDisplayCard cards={cards} /> //   // Show a loading state while fetching data
            ) : error ? (
              <CustomCountDisplayCard cards={cards} /> // Show an error message if something goes wrong
            ) : (
              <CustomCountDisplayCard cards={cards} />
            )}

            <View style={{marginTop: 5}} />
            <TopTabs
              activeTab={notificatonRequestSt}
              borderRadius={12}
              data={[{title: 'Request'}, {title: 'Notification'}]}
              setActiveTab={setNotificatonRequestSt}
              fontSize={14}
            />

            {/* Conditionally render components based on notificationRequestSt */}
            {notificatonRequestSt === 'Notification' ? (
              <View style={styles.notificationContainer}>
                <CustomNotificationRoundedList data={notificationData} />
              </View>
            ) : cardData?.length > 0 ? (
              cardData?.map((item, index) => {
                const modalList = [
                  {
                    func: () =>
                      navigation.navigate('PatientDetailsViewDoc', {
                        appointmentId: item.appointment_id,
                      }),
                    menuItem: 'View Details',
                  },
                  {
                    func: () =>
                      navigation.navigate('RejectAppointmentReq', {
                        navData: item,
                      }),
                    // func: ()=> console.log("itemdata",item),
                    menuItem: 'Reject',
                  },
                ];

                return (
                  <View style={{marginVertical: 15}}>
                    <AppointmentCard
                      key={index} // Add a unique key for each card
                      firstname={item.first_name}
                      middlename={item.middle_name}
                      lastname={item.last_name}
                      date={item.appointment_date}
                      time={item.appointment_time}
                      reportname={item.report_name}
                      showBtn="Appointmnetcards" // Set the value for showBtn
                      btnStatus="request" // Set the status for the button
                      // The state of the card (upcoming)
                      btnTitle="Accept" // The button title
                      bgcolor={COLORS.PRIMARY} // DESIGN: Use color constant
                      textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
                      isShowStatus={false} // Whether to show the status (set false for hiding)
                      menuList={modalList} // The menu items to show when the kebab menu is clicked
                      onPress={() => acceptAppointment(item)} // Pass the correct onPress handler
                      switches={'request'}
                      profile_picture={item.profile_picture}
                    />
                  </View>
                );
              })
            ) : (
              // EMPTY STATE: Show when no appointment requests available
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  padding: 20,
                }}>
                <Image 
                  source={require('../../../assets/images/CardDoctor1.png')}
                  style={{width: 150, height: 150, resizeMode: 'contain'}}
                />
                <Text style={[styles.emptyStateTitle, {marginTop: 20}]}>
                  You don't have any appointment requests
                </Text>
                <Text style={[styles.emptyStateDesc, {marginTop: 10}]}>
                  Add Listings to manage your schedule.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  notificationContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    padding: 15,
    marginBottom: 140,
    marginTop: 10,
  },
  appointmentContainer: {
    borderWidth: 1.2,
    borderRadius: 16,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    padding: 15,
    marginTop: 10,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    textAlign: 'center',
  },
});
