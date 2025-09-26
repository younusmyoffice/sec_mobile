import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
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
export default function Transaction() {
  
  const{userId}=useCommon();


  
  const [apiResponseData,setApiResponseData] = useState([]);
  const [loading,setLoading] = useState([]);
  const [error,setError] = useState([]);

  const handleDeactivateListing = async (doctorListId) => {
    setLoading(true);
    setError(null);  // Reset error state before deactivation
    try {
      const response = await axios.post(
        `${baseUrl}doctor/DocTransaction/`,
        {
          doctor_id: userId,
        
        }
      );
      console.log('Listing deactivated: ', response.data.response);
      console.log('Listing deactivated: ', doctorListId);

      // If deactivation is successful, update the state locally by removing the deactivated listing
      // if (response.data && response.data.DocListingPlanActive) {
      //   // Filter out the deactivated listing
      //   const updatedListings = listingCards.filter(
      //     item => item.doctor_list_id !== doctorListId
      //   );
      setApiResponseData(response.data.response);
        // setListingCards(response.data.DocListingPlanActive); // Update state with filtered listings
      // }

      // setModalIndex(null); // Close the modal after deactivation
    } catch (error) {
      console.error('Error :', error);
      setError('Failed , Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleDeactivateListing();
  
    
  }, []);
  

  return (
    <SafeAreaView>
      {/* <DateRangePicker Type={'normal'} /> */}
      {/* <CustomTable /> */}
      <ScrollView horizontal={true} style={{marginBottom: 90}} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.tableContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerText, styles.columnName]}>
                Transaction & ID
              </Text>

              <Text style={[styles.headerText, styles.columnDate]}>
                Date & Time
              </Text>

              <Text style={[styles.headerText, styles.columnAmount]}>
                Amount
              </Text>
            </View>
            {loading ? (
                  <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
                ) : apiResponseData.length === 0 ? (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>No Doctor booking history</Text>
                  </View>
                ) : (
            <ScrollView>
             
              {apiResponseData.map((data, index) => (
                <View key={index} style={styles.card}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: wp(60),
                    }}>
                    <View>

                      {data.status == 'canceled'? <Image
                        source={require('../../../../assets/images/Send.png')}
                        style={{
                          height: hp(7),
                          width: wp(17),
                          borderRadius: 15,
                          resizeMode: 'contain',
                        }}
                      /> : <Image
                      source={require('../../../../assets/images/Recieve.png')}
                      style={{
                        height: hp(7),
                        width: wp(17),
                        borderRadius: 15,
                        resizeMode: 'contain',
                      }}
                    />}
                      
                    </View>
                    <View style={{marginHorizontal: 7}}>
                      <Text
                        style={{color: 'black', fontFamily: 'Poppins-Medium'}}>
                        Appointment Payment
                      </Text>
                      <Text
                        style={{
                          color: '#939094',
                          fontFamily: 'Poppins-Medium',
                          fontSize: hp(1.4),
                        }}>
                        TRX Id: {data.transaction_id} 
                      </Text>
                      <Text
                        style={{
                          color: '#939094',
                          fontFamily: 'Poppins-Medium',
                          fontSize: hp(1.4),
                        }}>
                        Appointment Id:  {data.appointment_id} 
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.columnDate, {left: 30}]}>
                    <Text style={styles.GreyText}>
                    {data.appointment_date.substring(0, 10)} | {data.appointment_time}
                    </Text>
                  </View>

                  <View style={[styles.columnAmount, {left: 20}]}>
                    <Text style={styles.amount}>${data.amount}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>)
            
}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    height:hp(50),
    backgroundColor: '#fff',
    marginBottom:70
  },
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
    fontSize: 16,
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
    width: 200,
  },
  columnStatus: {
    width: 100,
    justifyContent: 'center',
    textAlign: 'center',
  },
  columnDate: {
    width: 150,
    justifyContent: 'center',
    left: 50,
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
