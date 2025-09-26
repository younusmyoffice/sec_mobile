import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import AppointmentCard from '../../../../components/customCards/appiontmentCard/CustomAppointmentCard';
import RecievedSharedReportsCard from '../../../../components/customCards/recieved&SharedReportCard/RecievedSharedReportsCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import axiosInstance from '../../../../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCommon} from '../../../../Store/CommonContext';

export default function MyActivity({isLoading, allAppointments, showFull,setShowFull  }) {
  const {sharedReports, recievedReports} = useCommon();
  const [userId, setUserId] = useState();
  const [activeTab, setActiveTab] = useState('Recieved');
  const [showFullReports, setShowFullReports] = useState(false);

  const [bookingLength, setbookingLength] = useState();
  const fetchSuid = async () => {
    try {
      const suid = await AsyncStorage.getItem('suid');
      console.log('SUID:', suid);
      setUserId(suid);
    } catch (error) {
      console.error('Error fetching suid:', error);
    }
  };

  const allReceived = showFullReports
    ? recievedReports
    : recievedReports.slice(0, 2);
  const allShared = showFullReports ? sharedReports : sharedReports.slice(0, 2);

  const renderComponent = () => {
    switch (activeTab) {
      case 'Recieved':
        return <RecievedSharedReportsCard data={allReceived} />;

      case 'Shared':
        <RecievedSharedReportsCard data={allShared} />;

      default:
        return null;
    }
  };
  useEffect(() => {
    fetchSuid();
    // fetchappointment();
  }, [userId]);
  console.log(recievedReports, 'rp');
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        {/* <View style={{padding:15}}> */}
        <View style={{marginTop: '5%'}}>
          <View style={{paddingHorizontal: 15}}>
            <InAppHeader
              LftHdr={'Appointments'}
              textbtn={true}
              textBtnText={'View All'}
              showReviewHideReview={showFull}
              showLess={'Show Less'}
              onClick={() => setShowFull(!showFull)}
            />
          </View>
          <View style={{gap: 10, paddingHorizontal: 10}}>
            {allAppointments?.map((item, i) => (
              <>
                <AppointmentCard
                  btnStatus={
                    item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  }
                  key={item.id}
                  firstname={item.first_name}
                  middlename={item.middle_name}
                  lastname={item.last_name}
                  date={item.appointment_date.split('T')[0]}
                  planname={item.plan_name}
                  reportname={item.attachments}
                  loading={isLoading}
                  profile_picture={item?.profile_picture}
                />
              </>
            ))}
          </View>
        </View>
        <View style={{marginTop: '5%'}}>
          <View style={{paddingHorizontal: 15}}>
            <InAppHeader
              LftHdr={'Reports'}
              textbtn={true}
              textBtnText={'View All'}
              showReviewHideReview={showFullReports}
              showLess={'Show Less'}
              onClick={() => setShowFullReports(!showFullReports)}
            />
          </View>
          <TopTabs
            borderwidth={1}
            data={[{title: 'Recieved'}, {title: 'Shared'}]}
            bordercolor={'#fff'}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <View>{renderComponent()}</View>
        </View>
        {/* </View> */}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
