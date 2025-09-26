import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import UpComming from '../../../components/customCards/appiontmentCard/UpComming';
import Completed from '../../../components/customCards/appiontmentCard/Completed';
import Cancelled from '../../../components/customCards/appiontmentCard/Cancelled';
import ChatsScreen from '../../../components/AppointmentComponents/ChatsScreen';
import Request from '../../../components/customCards/appiontmentCard/Request';
import Header from '../../../components/customComponents/Header/Header';
import {baseUrl} from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance';
import {useCommon} from '../../../Store/CommonContext';
import {useNavigation} from '@react-navigation/native';
import RescheduleModal from '../../../components/modalReschedule/RescheduleModal';
import {set} from 'date-fns';

const Stack = createNativeStackNavigator();

export default function DoctorAppointmentsScreen() {
  const [activeTab, setActiveTab] = useState('Request');
  const [upcommingAppointment, setUpcommingAppointment] = useState();
  const [completedAppointment, setCompletedAppointment] = useState();
  const [cancelledAppointment, setCancelledAppointment] = useState();
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null); // Error state
  const {userId} = useCommon();

  const doctorUpcommingAppointment = async () => {
    // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const response = await axiosInstance.post(
        `${baseUrl}Doctor/UpcomingAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_booked: 'booked',
        },
      );

      console.log('Appointment Up', response.data.response);

      if (response.data && response.data.response) {
        setUpcommingAppointment(response.data.response); // Set the fetched appointment requests data
      } else {
      }
    } catch (err) {
      console.error('Error fetching upcomming appointment requests:', err);
    } finally {
    }
  };

  const doctorRequestAppointment = async () => {
    setLoading(true);
    setError(null); // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const response = await axiosInstance.post(`Doctor/AppointmentsRequests`, {
        doctor_id: userId,

        status_in_progress: 'in_progress',
      });

      console.log('Appointment requests response:', response.data.response);

      if (response.data && response.data.response) {
        setCardData(response.data.response); // Set the fetched appointment requests data
      } else {
        setError('No appointment requests available');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
      setError('Failed to fetch appointment requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const doctorCompletedAppointment = async () => {
    // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const response = await axiosInstance.post(
        `${baseUrl}Doctor/CompletedAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_complete: 'completed',
        },
      );

      console.log('Appointment requests response:e', response.data.response);

      if (response.data && response.data.response) {
        setCompletedAppointment(response.data.response); // Set the fetched appointment requests data
      } else {
      }
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
    } finally {
    }
  };

  const doctorCancelledAppointment = async () => {
    // Reset error state before the request
    try {
      console.log('Fetching appointment requests...');
      const response = await axiosInstance.post(
        `${baseUrl}Doctor/CancelledAppointmentsDoctor`,
        {
          doctor_id: userId,
          status_cancel: 'canceled',
        },
      );

      console.log('Appointment requests response:C', response.data.response);

      if (response.data && response.data.response) {
        setCancelledAppointment(response.data.response); // Set the fetched appointment requests data
      } else {
      }
    } catch (err) {
      console.error('Error fetching appointment requests:', err);
    } finally {
    }
  };
  const reRenderApi = () => {
    console.log('called');
    doctorRequestAppointment();
    doctorUpcommingAppointment();
    // Trigger the re-fetch of the appointments
  };

  useFocusEffect(
    useCallback(() => {
      doctorRequestAppointment();
      doctorUpcommingAppointment();
      doctorCompletedAppointment();
      doctorCancelledAppointment();
    }, []),
  );
  // useEffect(() => {
  // doctorRequestAppointment();
  // doctorUpcommingAppointment();
  // doctorCompletedAppointment();
  // doctorCancelledAppointment();

  // }, []);
  const navigation = useNavigation();

  const renderComponent = () => {
    const AppointmentNavigation = planName => {
      if (planName === 'null') {
        navigation.navigate('ChatHomeMain');
        console.log('not the else part', upcommingAppointment.plan_name);
      } else {
        console.log('else part', upcommingAppointment);
      }
    };
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
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
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
              refreshing={false}
              onRefresh={doctorRequestAppointment}
            />
          ) : activeTab === 'Upcomming' ? (
            <RefreshControl
              refreshing={false}
              onRefresh={doctorUpcommingAppointment}
            />
          ) : activeTab === 'Completed' ? (
            <RefreshControl
              refreshing={false}
              onRefresh={doctorCompletedAppointment}
            />
          ) : activeTab === 'Cancelled' ? (
            <RefreshControl
              refreshing={false}
              onRefresh={doctorCancelledAppointment}
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
              borderColor="#E72B4A"
              textColor="#E72B4A"
              borderWidth={1}
              borderRadius={30}
              width={wp(35)}
              fontfamily="Poppins-SemiBold"
              // onPress={() => setisAllow(!isAllow)}
              // showhide={isAllow}
            />
          </View>
        ) : null}
        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'Request'},
              {title: 'Upcomming'},
              {title: 'Completed'},
              {title: 'Cancled'},
              {title: 'ChatsScreen'},
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
          />
        </View>
        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
