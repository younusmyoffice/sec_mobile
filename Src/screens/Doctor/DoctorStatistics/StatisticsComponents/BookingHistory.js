import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import DateRangePicker from '../../../../components/callendarPicker/RangeDatePicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { baseUrl } from '../../../../utils/baseUrl';
import { useCommon } from '../../../../Store/CommonContext';

export default function BookingHistory() {
  const [apiResponseData, setApiResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const{userId}=useCommon();

  const handleDeactivateListing = async () => {
    setLoading(true);
    setError(null);  // Reset error state before deactivation
    try {
      const response = await axios.post(
        `${baseUrl}doctor/DocAppointmentHistoryId`,
        {
          doctor_id: userId, // Example doctor ID
        }
      );
      console.log('Booking history: ', response.data.response);
      setApiResponseData(Array.isArray(response.data.response) ? response.data.response : []);
    } catch (error) {
      console.error('Error: ', error);
      setError('Failed, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDeactivateListing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
  {/* <DateRangePicker Type={'normal'} /> */}

  {loading ? (
    <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
  ) : apiResponseData.length === 0 ? (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No Doctor booking history</Text>
    </View>
  ) : (
    <ScrollView
      horizontal={true}
      style={{ marginBottom: 20 }}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.tableContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerText, styles.columnName]}>
              Name & Details
            </Text>
            <Text style={[styles.headerText, styles.columnStatus]}>
              Status
            </Text>
            <Text style={[styles.headerText, styles.columnDate]}>
              Date & Time
            </Text>
            <Text style={[styles.headerText, styles.columnPackage]}>
              Package
            </Text>
            <Text style={[styles.headerText, styles.columnAmount]}>
              Amount
            </Text>
          </View>

          <ScrollView>
          {apiResponseData.map((data, index) => (
  <View key={index} style={styles.card}>
    
    {/* Patient Name */}
    <Text style={{ color: 'black', fontFamily: 'Poppins-SemiBold', fontSize: hp(1.8) }}>
      {data.first_name} {data.middle_name} {data.last_name}
    </Text>

    {/* Appointment ID */}
    <Text style={{ color: '#666', fontFamily: 'Poppins-Medium', fontSize: hp(1.6) }}>
      Appointment ID: {data.appointment_id}
    </Text>

    {/* Appointment Date and Time */}
    <Text style={{ color: '#666', fontFamily: 'Poppins-Medium', fontSize: hp(1.6) }}>
      {data.appointment_date?.substring(0, 10)} | {data.appointment_time}
    </Text>

    {/* Plan Name and Duration */}
    <Text style={{ color: '#666', fontFamily: 'Poppins-Medium', fontSize: hp(1.6) }}>
      Plan: {data.plan_name} ({data.plan_duration})
    </Text>

    {/* Amount */}
    <Text style={{ color: '#E72B4A', fontFamily: 'Poppins-Bold', fontSize: hp(1.8) }}>
      ${data.amount}
    </Text>

  </View>
))}

          </ScrollView>
        </View>
      </View>
    </ScrollView>
  )}
</SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: 'white',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(60),
  },
  
  noDataText: {
    fontSize: hp(2),
    color: 'black',
    fontFamily: 'Poppins-Medium',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
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
    backgroundColor: '#fff',
    height:hp(60),
    paddingBottom:100
  },

  tableContainer: {
    borderColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 12,
    width: 1000,
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
    left:15,
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
    height: hp(10),
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  columnName: {
    minWidth: 200,
  },
  columnStatus: {
    width: wp(25),
    justifyContent: 'center',
alignItems:'center',
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
  },
  columnAmount: {
    width: 100,
    justifyContent: 'center',
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
