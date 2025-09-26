import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../../components/customComponents/Header/Header';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import BookingHistoryComponent from './BookingHistoryComponent';
import TransactionDetailsComponent from './TransactionDetailsComponent';
import ReportComponent from './ReportComponent';
import SubscriptionComponent from './SubscriptionComponent';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axiosInstance from '../../../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();

export default function PatientManageScreen() {
  const [activeTab, setActiveTab] = useState('Booking History');
  const [userId, setUserId] = useState();
  const [bookingHistory, setBookingHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [recievedReports, setRecieveReports] = useState([]);
  const [sharedReports, setSharedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingLength, setbookingLength] = useState();

  const handleScrollEnd = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !isLoading) {
      fetchBookinHistory();
    }
  };

  const fetchSuid = async () => {
    try {
      const suid = await AsyncStorage.getItem('suid');
      console.log('SUID:', suid);
      setUserId(suid);
    } catch (error) {
      console.error('Error fetching suid:', error);
    }
  };
  console.log(userId);
  const fetchBookinHistory = async () => {
    console.log('useridunderbooking', userId);
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `patient/appointmentHistory/${userId}`,{
          params:{
            page :1,limit:10
          }
        }
        
      );
      setBookingHistory(response?.data?.response);
      console.log('booking history', response?.data?.response);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchTransHistory = async () => {
    try {
      const response = await axiosInstance.get(`patient/transaction/${userId}`,{
        params:{
          page :1,limit:10
        }
      });
      setTransactionHistory(response.data.response);
      // console.log(response.data.response);
    } catch (e) {
      console.log(e);
    }
  };
  // console.log(transactionHistory)
  // const fetchAllReports=async()=>{

  //   const response=await axiosInstance.get(`patient/reportsRequested/${userId}/requested`)
  //   setAllReports(response.data.response)
  //   console.log(response.data.response)
  // }

  useEffect(() => {
    if (userId) {
      fetchBookinHistory();
      fetchTransHistory();
      setbookingLength(bookingHistory?.length);
    } else {
      fetchSuid();
    }
  }, [userId]);
  console.log('length', bookingLength);
  const renderComponent = () => {
    switch (activeTab) {
      case 'Booking History':
        return (
          <BookingHistoryComponent
            data={bookingHistory}
            handleScrollEnd={handleScrollEnd}
            isLoading={isLoading}
            length={bookingLength}
          />
        );
      case 'Transaction Details':
        return <TransactionDetailsComponent data={transactionHistory} />;
      case 'Report':
        return <ReportComponent length={bookingLength} />;
      // case 'Subscription':
      //   return <SubscriptionComponent />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View>
          <Header
            logo={require('../../../../assets/images/ShareecareHeaderLogo.png')}
            locationIcon={false}
        showLocationMark={false}
        notificationUserIcon={true}
          />
        </View>

        <View style={{margin: 10}}>
          <TopTabs
            bordercolor={'#fff'}
            data={[
              {title: 'Booking History'},
              {title: 'Transaction Details'},
              {title: 'Report'},
              // {title: 'Subscription'},
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
            funcstatus={false}
          />
        </View>
        <View style={styles.contentContainer}>
          {renderComponent()}
          {/* Dynamically render component based on activeTab */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
