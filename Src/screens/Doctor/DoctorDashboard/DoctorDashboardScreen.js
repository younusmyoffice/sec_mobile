import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomCountDisplayCard from '../../../components/customCountDisplayCard/CustomCountDisplayCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomNotificationRoundedList from '../../../components/customNotificationRounded/CustomNotificationRoundedList';
import AppointmentCard from '../../../components/customCards/appiontmentCard/CustomAppointmentCard';
import axios from 'axios'; // Make sure axios is imported
import {baseUrl} from '../../../utils/baseUrl'; // Ensure baseUrl is correctly set
import Header from '../../../components/customComponents/Header/Header';
import axiosInstance from '../../../utils/axiosInstance';
import {useCommon} from '../../../Store/CommonContext';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import {useAuth} from '../../../Store/Authentication';

export default function DoctorDashboardScreen() {
  const {userId} = useCommon();
  const {doctorDetails} = useAuth();
  console.log('did', userId);
  // State to hold the appointment counts
  const [cards, setCards] = useState([
    {id: 1, count: '0', desc: 'Appointment Request'},
    {id: 2, count: '0', desc: 'Upcoming Appointments'},
    {id: 3, count: '0', desc: 'Completed'},
  ]);

  // State for the active tab
  const [notificatonRequestSt, setNotificatonRequestSt] = useState('Request');
  const [cardData, setCardData] = useState(true);

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the dashboard data
  const doctorRequestAppointment = async () => {
    setLoading(true);
    setError(null); // Reset error state before the request
    try {
      console.log('Fetching appointment requests...123', userId);
      const response = await axiosInstance.post(`Doctor/AppointmentsRequests`, {
        doctor_id: userId,
        status_in_progress: 'in_progress',
      });

      console.log('Request DoctorDashboard screen', response.data.response);

      if (response.data && response.data.response) {
        setCardData(response.data.response); // Set the fetched appointment requests data
      } else {
        setError('No appointment requests available');
      }
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
      setError('Failed to fetch appointment requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching dashboard data...');

      // Use Promise.all to fetch data concurrently
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

      // Check if the responses are valid
      const inProgressCount =
        responseForInProgress?.data?.response?.[0]?.keyword_count || '0';
      const bookedCount =
        responseForBooked?.data?.response?.[0]?.keyword_count || '0';
      const completedCount =
        responseForCompleted?.data?.response?.[0]?.keyword_count || '0';

      // Update the cards state with the fetched data
      setCards([
        {id: 1, count: inProgressCount, desc: 'Appointment Request'},
        {id: 2, count: bookedCount, desc: 'Upcoming Appointments'},
        {id: 3, count: completedCount, desc: 'Completed'},
      ]);
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const acceptAppointment = async ApiData => {
    setLoading(true);
    setError(null); // Reset the error state before making a new request

    try {
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

      console.log('Appointment accepted successfully:', response.data.response);

      // Trigger re-render of the parent component to re-fetch appointment requests
      doctorRequestAppointment();
    } catch (err) {
      console.error('Error accepting appointment:', err);
      const errorMessage =
        err?.response?.data?.message ||
        'Failed to accept appointment. Please try again later.';
      setError(errorMessage); // Set a more descriptive error message
    } finally {
      setLoading(false); // Always stop loading when the request completes
    }
  };

  const [notificationData, setNotificationData] = useState(); // State for the description input

  // Function to handle API submission
  const notificationApi = async () => {
    const payload = {
      doctor_id: userId,
    };

    try {
      const response = await axiosInstance.get(
        `Doctor/DoctorNotification/${userId}`,
      );

      if (response.data.response) {
        console.log('notification dataaa', response.data.response);
        setNotificationData(response.data.response);
      } else {
      }
    } catch (err) {
      console.error('Error submitting terms:', err);
      Alert.alert(
        'Error',
        'An error occurred while submitting terms. Please try again.',
      );
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
              borderColor: '#E72B4A',
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
                  color="#E72B4A"
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
                      bgcolor="#E72B4A" // Background color of the button
                      textColor="#fff" // Button text color
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
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image source={require('../../../assets/NoAppointment.png')} />
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  You don’t have any appointment requests
                </Text>
                <Text style={{textAlign: 'center', marginVertical: 10}}>
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

const styles = StyleSheet.create({
  notificationContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E6E1E5',
    padding: 15,
    marginBottom: 140,
    marginTop: 10,
  },
  appointmentContainer: {
    borderWidth: 1.2,
    borderRadius: 16,
    borderColor: '#E6E1E5',
    padding: 15,
    marginTop: 10,
  },
});
