import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DATA} from '../../utils/data';
import CustomButton from '../customButton/CustomButton';
import styles from './CustomNotificationStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../utils/axiosInstance';
import {useCommon} from '../../Store/CommonContext';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useAuth} from '../../Store/Authentication';

const CustomNotificationList = ({Data, modalVisible, setModalVisible, id}) => {
  console.log('notification', id);
  // const {notification,handleRead}=useCommon()
  const {userId} = useAuth();
  const [notification, setNotification] = useState([]);
  console.log('userid:', userId, 'roleId:', id);
  const fetchNotification = async () => {
    console.log('called notificatiion');
    const api_route =
      id == 5
        ? `patient/patientNotification/${userId}`
        : id == 3
        ? `Doctor/DoctorNotification/${userId}`
        : id == 4
        ? `hcf/${userId}/StaffNotification/`
        : null;

    try {
      const response = await axiosInstance.get(api_route);
      console.log('not', response.data.response);
      setNotification(response?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRead = async id => {
    try {
      const response = await axiosInstance.put(`notification/status/${id}/1`);
      fetchNotification();
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchNotification();
    }
  }, [userId]);
  return (
    <SafeAreaView>
      <View
        style={{
          // height: 100,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <View></View>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Ionicons name={'close'} size={28} color={'#313003'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{backgroundColor: '#fff', height: heightPercentageToDP(100)}}>
        <View style={{paddingBottom: 60}}>
          {notification?.length > 0 ? (
            notification?.map((item, index) => (
              <View key={index}>
                <View style={styles.ListView}>
                  <View style={{gap: 10}}>
                    <Text style={styles.BookingText}>{item?.type}</Text>
                    <View style={styles.BookingDesc}>
                      <Text
                        style={{
                          fontWeight: 'light',
                          fontSize: 12,
                          lineHeight: 20,
                          color: '#313033',
                        }}>
                        {item?.parameters?.notification_detail
                          ?.split('Date')[0]
                          .trim()}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <View style={{gap: 15}}>
                      <CustomButton
                        onPress={() => handleRead(item?.notification_id)}
                        bgColor={'#E72B4A'}
                        title={'Mark as Read'}
                        textColor={'#fff'}
                        borderRadius={50}
                        fontWeight={'light'}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={{textAlign: 'center', marginTop: 20, color: '#313033'}}>
              No Notifications
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomNotificationList;
