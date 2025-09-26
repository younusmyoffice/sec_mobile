import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import CustomCountDisplayCard from '../../../../components/customCountDisplayCard/CustomCountDisplayCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomNotificationRoundedList from '../../../../components/customNotificationRounded/CustomNotificationRoundedList';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';
export default function DiagnosticDashboardScreen() {
  const [activeTab, setactiveTab] = useState('Notifications');
  const [cards, setCards] = useState([
      { id: 1, count: '0', desc: 'Test Count' },
      { id: 2, count: '0', desc: 'Report Count' },
      { id: 3, count: '0', desc: 'Patient Count' },
    ]);
    const [notificationData, setNotificationData] = useState(); // State for the description input
  
      const {userId} = useCommon();

 console.log("useriddd",userId)
  //   {
  //     id: 1,
  //     count: '02',
  //     desc: 'Test Request',
  //   },
  //   {
  //     id: 2,
  //     count: '06',
  //     desc: 'Reports Shared',
  //   },
  //   {
  //     id: 3,
  //     count: '04',
  //     desc: 'Patient Added',
  //   },
  // ];
  const fetchDashboardData = async () => {
    // setLoading(true);
    // setError(null);

    try {
      console.log("Fetching dashboard data..asdsaa");
      
      // Use Promise.all to fetch data concurrently
      const [testCountData, reportCountData, patientCountData] = await Promise.all([
        axiosInstance.get(`hcf/${userId}/dashboardTestCount`),//${userId}
        axiosInstance.get(`hcf/${userId}/dashboardReportCount`),
        axiosInstance.get(`hcf/${userId}/dashboardPatientCount`),//fdsa
        // axios.post(`Doctor/DocDashoardCount`),
        // axios.post(`Doctor/DocDashoardCount`),
      ]);
      
      // Check if the responses are valid
      const testCount = testCountData?.data?.response?.[0]?.keyword_count || '0';
      const reportCount = reportCountData?.data?.response?.[0]?.keyword_count || '0';
      const patientCount = patientCountData?.data?.response?.[0]?.keyword_count || '0';
console.log("data",testCount)
      // Update the cards state wipatientCountth the fetched data
      setCards([
        { id: 1, count: testCount, desc: 'Test Request' },
        { id: 2, count: reportCount, desc: 'Reports Shared' },
        { id: 3, count: patientCount, desc: 'Patient Added' },
      ]);
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
      // setError('Failed to fetch data. Please try again later.');
    } finally {
      // setLoading(false);
    }
  };
  const notificationApi = async () => {
    const payload = {
      doctor_id: userId,
    };

    try {
      const response = await axiosInstance.get(
        `hcf/${userId}/StaffNotification/`,
       
      );

      if (response.data.response) {
        console.log('notification dataaae', response.data.response);
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
  fetchDashboardData();
  notificationApi();
 }, [])
 
  return (
    <SafeAreaView style={{flex:1,backgroundColor: 'white'}}>
      <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
        id={4}
      />
<ScrollView style={{flex:1}}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={{padding: 15}}>
          <View>
            <CustomCountDisplayCard cards={cards} />
          </View>
          <View style={{marginTop: '5%'}}>
            <View
              style={{
                backgroundColor: '#E72B4A',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                width: wp(33),
              }}>
              <Text style={{color: 'white'}}>Noticifactions</Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#E6E1E5',
              padding: 15,
              marginTop: '5%',
            }}>
            <CustomNotificationRoundedList  data={notificationData}/>
          </View>
        </View>
      </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}
