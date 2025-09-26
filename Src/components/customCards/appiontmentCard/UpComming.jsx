import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import AppointmentFailed from '../../customAppointmnetRequestComponent/AppointmentFailed';
import AppointmentCard from './CustomAppointmentCard';
import RescheduleModal from '../../../components/modalReschedule/RescheduleModal';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance';
import RejectModal from '../../customModal/RejectModal';
import CustomToaster from '../../customToaster/CustomToaster';

const UpComming = ({ data, loader, rescheduleEndpiont, rejectEndpiont = "patient/RejectAppointment", isDoctor = false, Refresh, SelfRefresh }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for API call
  const [items, setItems] = useState([])
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const navigation = useNavigation();

  console.log("upcomming", data)
  // Handle form submission
  const handleSubmit = async (payload) => {
    console.log('API Response:payload', payload);
    setIsSubmitting(true); // Start loading
    try {
      const response = await axiosInstance.post(`${baseUrl}${rescheduleEndpiont}`,

        payload,
      );
      console.log("firstfdsafdsafda", response)
      setModalVisible(false);
    CustomToaster.show('success', response?.data?.response?.body)
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle network errors (e.g., show a toast or alert)
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleRejectSubmit = async (payload) => {
    console.log('API Response:payload for', payload);
    setIsSubmitting(true); // Start loading
    try {
      const response = await axiosInstance.post(`${baseUrl}${rejectEndpiont}`,

        payload,
      );

      // const result = await response.json();
      console.log('API Response:reject', response.data);

      // Check the statusCode in the response

      setRejectModalVisible(false); // Close modal on success
      CustomToaster.show('success', response?.data?.body)
    } catch (error) {
      console.error('Error during API call:', error);
      // Handle network errors (e.g., show a toast or alert)
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  // Handle navigation based on appointment type
  const handleAppointmentNavigation = async (item) => {
    console.log("upcomming ka dataaa", item)
    if (!item) {
      console.error("Item is undefined!");
      return;
    }

    if (item.plan_name === "message") {
      console.log("Navigating to ChatHomeMain with payload:", item);
      navigation.navigate('ChatHomeMain', {
        roomID: item?.roomid,
        userID: item.first_name,
        appiontmentId:item.appointment_id
      });
    } else if (item.plan_name === "video") {
      console.log("Navigating to Join_Screen with payload:", item);
      navigation.navigate('Join_Screen',{
        appid:item.appointment_id
      });
    }

    await Promise.all([
      Refresh(),
      SelfRefresh(),
    ]);
  };
  // const onRefresh = () => {
  //   setRefreshing(true);
  //   Refresh(); // call your API again
  // };
  return (

    // <ScrollView  >
    <SafeAreaView>

      {loader ? (
        <View style={{ gap: 10 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <AppointmentCard key={index} loading={true} />
          ))}
        </View>
      ) : data?.length > 0 ? (
        <View style={{ gap: 10 }}>
          {data?.map((item, i) => (
            <AppointmentCard
              key={i}
              btnStatusForJoin={item.join_status !== 0 ? false : true}
              showBtn={'Appointmnetcards'}
              btnStatus={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              switches={'upcomming'}
              planname={item.plan_name}
              btnTitle={'Join'}
              bgcolor={'#E72B4A'}
              textColor={'#fff'}
              menuList={
                isDoctor
                  ? [
                    {
                      id: 1,
                      menuItem: 'Reject',
                      func: () => {
                        setRejectModalVisible(true);
                        setItems(item);
                      },
                    },
                  ]
                  : [
                    {
                      id: 1,
                      menuItem: 'Reject',
                      func: () => {
                        setRejectModalVisible(true);
                        setItems(item);
                      },
                    },
                    {
                      id: 2,
                      menuItem: 'Re-Schedule',
                      func: () => {
                        setModalVisible(true);
                        setItems(item);
                      },
                    },
                  ]
              }

              firstname={item.patientBookedName || item.first_name + " " + item.last_name}
              middlename={" "}
              lastname={" "}
              date={item.appointment_date}
              reportname={item.report_name}
              onPress={() => handleAppointmentNavigation(item)}
              profile_picture={item.profile_picture}
            />
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <AppointmentFailed
            image={<Image source={require('../../../assets/NoAppointment.png')} />}
            title={'You don’t have any appointment'}
            desc={'Book an appointment'}
            btntitle={'Find Doctor'}
          />
        </View>
      )}
      <RejectModal
        isVisible={rejectModalVisible}
        apptData={items}
        onClose={() => setRejectModalVisible(false)}
        onSubmit={handleRejectSubmit}
        isSubmitting={isSubmitting} // Pass loading state to modal
      />
      <RescheduleModal
        isVisible={isModalVisible}
        apptData={items}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting} // Pass loading state to modal
      />
    </SafeAreaView>
    // </ScrollView>
  );
};

export default UpComming;