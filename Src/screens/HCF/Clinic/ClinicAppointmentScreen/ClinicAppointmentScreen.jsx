import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import PaginationComponent from '../../../../components/customPagination/PaginationComponent';
import UpComming from '../../../../components/customCards/appiontmentCard/UpComming';
import Completed from '../../../../components/customCards/appiontmentCard/Completed';
import Cancelled from '../../../../components/customCards/appiontmentCard/Cancelled';
import ChatsScreen from '../../../../components/AppointmentComponents/ChatsScreen';
import Request from '../../../../components/customCards/appiontmentCard/Request';
import Header from '../../../../components/customComponents/Header/Header';
import { useCommon } from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { watchPosition } from 'react-native-geolocation-service';

const Stack = createNativeStackNavigator();

export default function ClinicAppointmentScreen() {
  const navigation = useNavigation();
  const { userId } = useCommon();

  const [activeTab, setActiveTab] = useState('Request');
  const [upcommingAppointment, setUpcommingAppointment] = useState([]);
  const [completedAppointment, setCompletedAppointment] = useState([]);
  const [cancelledAppointment, setCancelledAppointment] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async (status, setData, endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`hcf/${userId}/${status}/${endpoint}`);
      if (response.data && Array.isArray(response.data.response)) {
        setData(response.data.response);
      } else {
        setError(`No ${status} appointments available`);
      }
    } catch (err) {
      console.error(`Error fetching ${status} appointment requests:`, err);
      setError(`Failed to fetch ${status} appointments. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const reRenderApi = () => {
    fetchAppointments('in_progress', setCardData, 'clinicAppointmentRequests');
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments('in_progress', setCardData, 'clinicAppointmentRequests');
      fetchAppointments('booked', setUpcommingAppointment, 'clinicAppointmentUpcoming');
      fetchAppointments('completed', setCompletedAppointment, 'clinicAppointmentComplete');
      fetchAppointments('cancelled', setCancelledAppointment, 'clinicAppointmentCancelled');
    }, [userId])
  );

  const renderComponent = () => {
    switch (activeTab) {
      case 'Request':
        return <Request data={cardData} reRenderApi={reRenderApi} option={'clinic'} />;
      case 'Upcomming':
        return <UpComming isDoctor={true} data={upcommingAppointment} />;
      case 'Completed':
        return <Completed data={completedAppointment} />;
      case 'Cancled':
        return <Cancelled data={cancelledAppointment} />;
      case 'ChatsScreen':
        return <ChatsScreen />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
        <Header
          logo={require('../../../../assets/Clinic1.jpeg')}
          notificationUserIcon={true}
          width={wp(41)}
          height={hp(4)}
          resize={'contain'}
          onlybell={true}
        />
        <View style={{ padding: 15 }}>
         
          <View style={{ margin: 10 }}>
            <TopTabs
              borderRadius={8}
              bordercolor={'#fff'}
              data={[
                { title: 'Request' },
                { title: 'Upcomming' },
                { title: 'Completed' },
                { title: 'Cancled' },
                { title: 'ChatsScreen' },
              ]}
              borderwidth={1}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </View>
          <View style={{ marginTop: '5%' }}>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
