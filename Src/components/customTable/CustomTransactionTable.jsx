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
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomTransactionTable = ({header, textCenter, data}) => {
  console.log(data);
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
          <ScrollView>
            {data.map((data, index) => (
              <View key={index} style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp(60),
                  }}>
                  <View>
                    {data.status == 'canceled' ? 
                      <Image
                        source={require('../../assets/Send.png')}
                        style={{
                          height: hp(7),
                          width: wp(17),
                          borderRadius: 15,
                          resizeMode: 'contain',
                        }}
                      /> : 
                      <Image
                        source={data.image || require('../../assets/Recieve.png')}
                        style={{
                          height: hp(7),
                          width: wp(17),
                          borderRadius: 15,
                          resizeMode: 'contain',
                        }}
                      />
                    }
                  </View>
                  <View style={{marginHorizontal: 7}}>
                    <Text
                      style={{color: 'black', fontFamily: 'Poppins-Medium'}}>
                      {data.name || 'Transaction'}
                    </Text>
                    <Text
                      style={{
                        color: '#939094',
                        fontFamily: 'Poppins-Medium',
                        fontSize: hp(1.4),
                      }}>
                      {data.transaction_id ? `TRX Id: ${data.transaction_id}` : 
                       data.trans_id ? `Transaction Id: ${data.trans_id}` : 
                       'Transaction'}
                    </Text>
                    <Text
                      style={{
                        color: '#939094',
                        fontFamily: 'Poppins-Medium',
                        fontSize: hp(1.4),
                      }}>
                      {data.appointment_id ? `Appointment Id: ${data.appointment_id}` : 
                       data.test_id ? `Test Id: ${data.test_id}` : 
                       ''}
                    </Text>
                  </View>
                </View>

                <View style={[styles.columnDate, {left: 30}]}>
                  <Text style={styles.GreyText}>
                    {data.appointment_date ? 
                      `${data.appointment_date.substring(0, 10)} | ${data.appointment_time || ''}` : 
                      data.datetime || 'N/A'
                    }
                  </Text>
                </View>

                <View style={[styles.columnAmount, {left: 20}]}>
                  <Text style={styles.amount}>${data.amount || data.price || 0}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};
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
    // height: hp(100),

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
    color:'black',
    fontFamily:'Poppins-Medium'
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
export default CustomTransactionTable;
