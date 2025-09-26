import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomCountDisplayCard from '../../../../components/customCountDisplayCard/CustomCountDisplayCard';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomNotificationRoundedList from '../../../../components/customNotificationRounded/CustomNotificationRoundedList';
import Header from '../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../utils/axiosInstance';
import {useAuth} from '../../../../Store/Authentication';

const AdminDashboardScreen = () => {
  const [cards, setCards] = useState([]);
  const {userId} = useAuth();
  console.log('userid', userId);
  // const cards = [
  //   {
  //     id: 1,
  //     count: '02',
  //     desc: 'Appointment Request',
  //   },
  //   {
  //     id: 2,
  //     count: '06',
  //     desc: 'Upcoming Appointments',
  //   },
  //   {
  //     id: 3,
  //     count: '04',
  //     desc: 'Completed',
  //   },
  // ];
  const fetchDashboardData = async () => {
    // setLoading(true);
    // setError(null);

    try {
      console.log('Fetching dashboard data...');

      // Use Promise.all to fetch data concurrently
      const [dashboardClinicDoctorCount, dashboardDiagnosticCount] =
        await Promise.all([
          axiosInstance.get(`hcf/dashboardClinicDoctorCount/${userId}`),
          axiosInstance.get(`hcf/dashboardDiagnosticCount/${userId}`),
        ]);
      const doctorCount =
        dashboardClinicDoctorCount?.data[0]?.doctor_count || '0';
      console.log('doctor', doctorCount);
      // console.log(dashboardClinicDoctorCount.data)

      const diagCount =
        dashboardDiagnosticCount?.data[0]?.diagnostic_staff_count || '0';
      console.log('data', diagCount);
      setCards([
        {id: 1, count: doctorCount, desc: 'Doctors'},
        {id: 2, count: diagCount, desc: 'Diagnostic'},
      ]);
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
      // setError('Failed to fetch data. Please try again later.');
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  useEffect(() => {}, [userId]);

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <CustomCountDisplayCard cards={cards} />
          </View>
          <View>
            <CustomButton
              title="Notifications"
              bgColor={'#E72B4A'}
              borderRadius={8}
              textColor={'white'}
              height={hp(5.5)}
              width={wp(35)}
              fontSize={hp(1.8)}
              fontfamily={'Poppins-Medium'}
            />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#E6E1E5',
              padding: 15,
            }}>
            <CustomNotificationRoundedList />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AdminDashboardScreen;
