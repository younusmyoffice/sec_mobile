import {View, Text, ScrollView, SafeAreaView, RefreshControl} from 'react-native';
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
const AdminDashboardScreen = () => {
  const [activeTab, setactiveTab] = useState('Requests');
  const [cardData, setCardData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const{userId}=useCommon();
  const [cards, setCards] = useState([
    { id: 1, count: '0', desc: 'Appointment Request' },
    { id: 2, count: '0', desc: 'Upcoming Appointments' },
    { id: 3, count: '0', desc: 'Completed' },
  ]);

  // Fetch the doctor appointment requests
  const doctorRequestAppointment = async () => {
    setLoading(true);
    setError(null); // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const res = "in_progress";
      const response = await axiosInstance.get(
        `hcf/${userId}/${res}/clinicAppointmentRequests`
      );

      console.log('setNotificationData1', response.data.response);

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
  const notificationApi = async () => {
    setLoading(true);
    setError(null); // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const response = await axiosInstance.get(
        `hcf/${userId}/clinicNotification`
      );

      console.log('Appointment requests response:', response.data.response);

      if (response.data && response.data.response) {
        setNotificationData(response.data.response); // Set the fetched appointment requests data
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
  useEffect(() => {
    doctorRequestAppointment();
    fetchDashboardData();
    notificationApi();
  }, []);
  
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching dashboard data...");
      
      // Use Promise.all to fetch data concurrently
      const [responseForInProgress, responseForBooked, responseForCompleted] = await Promise.all([
        axiosInstance.get(`${baseUrl}hcf/${userId}/in_progress/clinicDashboardAppointmentRequestCount`),
        axiosInstance.get(`${baseUrl}hcf/${userId}/complete/clinicDashboardAppointmentCompleteCount`),
        axiosInstance.get(`${baseUrl}hcf/${userId}/booked/clinicDashboardAppointmentUpcomngCount`),
      ]);

      // Check if the responses are valid
      const inProgressCount = responseForInProgress?.data?.response?.[0]?.keyword_count || '0';
      const bookedCount = responseForBooked?.data?.response?.[0]?.keyword_count || '0';
      const completedCount = responseForCompleted?.data?.response?.[0]?.keyword_count || '0';

      // Update the cards state with the fetched data
      setCards([
        { id: 1, count: inProgressCount, desc: 'Appointment Request' },
        { id: 2, count: bookedCount, desc: 'Upcoming Appointments' },
        { id: 3, count: completedCount, desc: 'Completed' },
      ]);
      console.log("count data countt", cards,inProgressCount);
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const renderComponent = () => {
    switch (activeTab) {
      case 'Requests':
        return <Request data={cardData} option={'clinic'} />;
      case 'Notifications':
        return <CustomNotificationRoundedList data={notificationData} />;
    }
  };
  const onRefresh = () => {
    doctorRequestAppointment();
    fetchDashboardData();
    notificationApi();
  }
  return (
    
      <SafeAreaView style={{backgroundColor: 'white'}}>
        
      <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      />
      <ScrollView style={{backgroundColor: 'white',height:'100%'}}  refreshControl={
                <RefreshControl refreshing={false} onRefresh={onRefresh} />
              } >
        <View style={{padding: 15, gap: 10}}>
          <View>
            <CustomCountDisplayCard cards={cards} />
            {/* <CustomCountDisplayCard
              count={3} 
              description={'Active Lab Technician'}
            />
            <CustomCountDisplayCard
              count={3} 
              description={'Active Lab Technician'}
            /> */}
          </View>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Requests'},
                {id: 2, title: 'Notifications'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>

          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#E6E1E5',
              padding: 15,
            }}>
            {renderComponent()}
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    
  );
};

export default AdminDashboardScreen;
