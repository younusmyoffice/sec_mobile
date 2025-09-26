import {View, Text, ScrollView, SafeAreaVie, SafeAreaView, RefreshControl, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import UpComming from '../../../components/customCards/appiontmentCard/UpComming';
import Completed from '../../../components/customCards/appiontmentCard/Completed';
import Cancelled from '../../../components/customCards/appiontmentCard/Cancelled';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axiosInstance from '../../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const AppointmentPage = () => {
  const [userId, setUserId] = useState();
  const [loading, setloading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcomming');
  const [upCommingData, setupCommingData] = useState([]);
  const [completedData, setcompletedData] = useState([]);
  const [cancelledData, setcancelledData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const fetchSuid = async () => {
    try {
      const suid = await AsyncStorage.getItem('suid');
      console.log('SUID:', suid);
      setUserId(suid);
    } catch (error) {
      console.error('Error fetching suid:', error);
    }
  };

  const fetchUpcomming = async () => {
    try {
      setloading(true);
      const response = await axiosInstance.post(
        'patient/UpcomingAppointments',
        {
          patient_id: userId,
          status_in_progress: 'in_progress',
          status_booked: 'booked',
        },
      );
      // console.log(response.data.response);
      setupCommingData(response.data.response);
      setloading(false);
    } catch (e) {
      setloading(false);
      console.log(e);
    }
  };
  const fetchCompleted = async () => {
    try {
      setloading(true);

      const response = await axiosInstance.post(
        'patient/CompletedAppointments',
        {
          patient_id: userId,
          status_complete: 'completed',
        },
      );
      // console.log("completed",response.data.response);
      setcompletedData(response.data.response);
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };
  const fetchCancelled = async () => {
    try {
      setloading(true);

      const response = await axiosInstance.post(
        'patient/CancelledAppointments',
        {
          patient_id: userId,
          status_cancel: 'canceled',
        },
      );
      console.log('canceled', response.data.response);
      setcancelledData(response.data.response);
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchSuid();
    fetchUpcomming();
    fetchCompleted();
    fetchCancelled();
  }, [userId, 'in_progress', 'completed']);

  const renderComponent = () => {
    switch (activeTab) {
      case 'Upcomming':
        return (
          <UpComming
            showmenu={true}
            data={upCommingData}
            loader={loading}
            rescheduleEndpiont={`patient/resheduleAppointment`}
            Refresh={fetchUpcomming}
          />
        );
      case 'Completed':
        return <Completed data={completedData} loader={loading} />;
      case 'Cancelled':
        return <Cancelled data={cancelledData} loader={loading} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={false}
          notificationUserIcon={true}
          id={5}
        />
      </View>
      <ScrollView
        style={{backgroundColor: 'white'}}
        refreshControl={
          activeTab === 'Upcomming' ? (
            <RefreshControl refreshing={refreshing} onRefresh={fetchUpcomming} />
          ) :  activeTab === 'Completed' ? (
            <RefreshControl refreshing={refreshing} onRefresh={fetchCompleted} />
          ) : activeTab === 'Cancelled' ? (
            <RefreshControl refreshing={refreshing} onRefresh={fetchCancelled} />
          ):null
        }
       >
        <View style={{padding: 15}}>
          <TopTabs
            bordercolor={'#fff'}
            data={[
              {title: 'Upcomming'},
              {title: 'Completed'},
              {title: 'Cancelled'},
              {title: 'Chat'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            // tabfunc={{}}
            funcstatus={false}
          />
          <View style={{marginTop: '5%'}}>{renderComponent()}</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmentPage;
