import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation, Platform, UIManager 
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DateRangePicker from '../../../../components/callendarPicker/RangeDatePicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {baseUrl} from '../../../../utils/baseUrl';
import {useCommon} from '../../../../Store/CommonContext';
import CustomTable from '../../../../components/customTable/CustomTable';
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function Overview() {
  const [overview, setOverview] = useState([
    {
      id: 1,
      title: 'Doctor Earning',
      price: 200,
      item: 10,
    },
    {
      id: 2,
      title: 'Affiliate Earning',
      price: 120,
      item: 10,
    },
    {
      id: 3,
      title: 'Total Earning',
      price: 120,
      item: 10,
    },
  ]);

  const [apiResponseData, setApiResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {userId} = useCommon();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching dashboard data...');

      const [responseForInProgress, responseForBooked, responseForCompleted] =
        await Promise.all([
          axios.post(`${baseUrl}doctor/DocEarningCount`, {doctor_id: userId}),
          axios.post(`${baseUrl}doctor/DocAffiliateEarningCount`, {
            doctor_id: userId,
          }),
          axios.post(`${baseUrl}doctor/DocTotalEarningCount`, {
            doctor_id: userId,
          }),
        ]);

      const doctorEarning =
        responseForInProgress?.data?.response?.doctor_earning || '0 ';
      const affiliateEarning =
        responseForBooked?.data?.response?.hcf_doctor_earning || '0 ';
      const totalEarning = responseForCompleted?.data?.totalEarnings || '0 ';
      console.log('give me more', totalEarning);
      setOverview([
        {
          id: 1,
          title: 'Doctor Earning',
          price: doctorEarning,
          item: 10,
        },
        {
          id: 2,
          title: 'Affiliate Earning',
          price: affiliateEarning,
          item: 10,
        },
        {
          id: 3,
          title: 'Total Earning',
          price: totalEarning,
          item: 10,
        },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateListing = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${baseUrl}doctor/DocAllEarningList`, {
        doctor_id: userId,
      });
      console.log('Booking overview: ', response.data);
      setApiResponseData(response.data); // Set the data here
    } catch (error) {
      console.error('Error :', error);
      setError('Failed, Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDeactivateListing();
    fetchDashboardData();
  }, []); // Empty dependency array for initial data fetch
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };
  const header = [
    'Date',
    'Time',
    'Affiliate Earning',
    'Direct Earning',
    'Total',
  ];
  return (
    <SafeAreaView>
        {/* <ScrollView nestedScrollEnabled={true}> */}
        {/* <View
          style={{
            borderWidth: 1.5,
            borderColor: '#E6E1E5',
            borderRadius: 16,
            padding: 15,
            margin: 10,
          }}>
          {overview.map((item, i) => (
            <View key={i} style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: '#E72B4A',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 40,
                }}>
                ${item.price}
              </Text>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  top: -10,
                }}>
                {item.title}
              </Text>
              <View
                style={{
                  backgroundColor: '#EFEFEF',
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 20,
                  top: -10,
                }}>
                <Text
                  style={{
                    color: '#AEAAAE',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                  }}>
                  {item.item} item
                </Text>
              </View>
            </View>
          ))}
        </View> */}
 <View
      style={{
        borderWidth: 1.5,
        borderColor: '#E6E1E5',
        borderRadius: 16,
        padding: 10,
        margin: 10,
      }}
    >
      <TouchableOpacity onPress={toggleAccordion}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            color: '#333',
            textAlign: 'center',
          }}
        >
          {expanded ? 'Hide Overview ▲' : 'Show Overview ▼'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: 10 }}>
          {overview.map((item, i) => (
            <View key={i} style={{ alignItems: 'center', marginVertical: 10 }}>
              <Text
                style={{
                  color: '#E72B4A',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 40,
                }}
              >
                ${item.price}
              </Text>
              <Text
                style={{
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: -10,
                }}
              >
                {item.title}
              </Text>
              <View
                style={{
                  backgroundColor: '#EFEFEF',
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 20,
                  marginTop: -10,
                }}
              >
                <Text
                  style={{
                    color: '#AEAAAE',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 16,
                  }}
                >
                  {item.item} item
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
        <CustomTable
          header={header}
          // backgroundkey={'status'}
          isUserDetails={false}
          data={apiResponseData}
          flexvalue={1}
          rowDataCenter={true}
          textCenter={'center'}
          loading={loading}
        />
    {/* </ScrollView> */}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'white',
  },
  container2: {},
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  datePickerText: {
    fontSize: 16,
    color: 'black',
    margin: 15,
    justifyContent: 'space-evenly',
  },
  selectedDateText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  transactionContainer: {
    borderColor: '#939094',
    borderWidth: 1,
    width: '88%',
    height: '70%',
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
  transactionContent: {
    padding: '2%',
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginTop: 30,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataImage: {
    width: 220,
    height: 150,
    marginTop: 45,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 30,
  },
  bookAppointmentText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },

  container: {
    flex: 1,
    padding: 10,
    height: hp(55),
    backgroundColor: '#fff',
    paddingBottom: 100,
  },

  tableContainer: {
    borderColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 12,
    width: 800,
  },

  header: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#AEAAAE',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#313033',
    fontFamily: 'Poppins-Medium',
  },

  verticalScroll: {
    maxHeight: 400,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#AEAAAE',
    height: hp(9),
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  columnName: {
    minWidth: 200,
  },
  columnStatus: {
    width: wp(20),
    justifyContent: 'center',

    textAlign: 'center',
  },
  columnDate: {
    left: 20,
    width: 150,
    justifyContent: 'center',
  },
  columnPackage: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  columnAmount: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#313033',
  },
  GreyText: {
    fontFamily: 'Poppins-Medium',
    color: '#939094',
    fontSize: hp(1.7),
  },

  editIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    color: '#E72B4A',
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.8),
  },
});
