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
import PaginationComponent from '../../../../components/customPagination/PaginationComponent';
import CustomTable from '../../../../components/customTable/CustomTable';
const AllDoctors = () => {
  const cardData = [
    {
      first_name: 'John',
      last_name: 'Doe',
      role_id: '001',
      department_name: 'Cardiology',
      is_active: true,
      booking_id: 102,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      role_id: '002',
      department_name: 'Neurology',
      is_active: false,
      booking_id: 102,
    },
    {
      first_name: 'Alice',
      last_name: 'Brown',
      role_id: '003',
      department_name: 'Pediatrics',
      is_active: true,
      booking_id: 102,
    },
    {
      first_name: 'Michael',
      last_name: 'Johnson',
      role_id: '004',
      department_name: 'Orthopedics',
      is_active: false,
      booking_id: 102,
    },
    {
      first_name: 'John',
      last_name: 'Doe',
      role_id: '001',
      department_name: 'Cardiology',
      is_active: true,
      booking_id: 102,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      role_id: '002',
      department_name: 'Neurology',
      is_active: false,
      booking_id: 102,
    },
    {
      first_name: 'Alice',
      last_name: 'Brown',
      role_id: '003',
      department_name: 'Pediatrics',
      is_active: true,
      booking_id: 102,
    },
    {
      first_name: 'Michael',
      last_name: 'Johnson',
      role_id: '004',
      department_name: 'Orthopedics',
      is_active: false,
      booking_id: 102,
    },
  ];
  return (

    <SafeAreaView>
    <ScrollView horizontal={true} style={{marginBottom: 20}}>
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
            {cardData.map((data, index) => (
              <View key={index} style={styles.card}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp(60),
                  }}>
                  <View>
                    <Image
                      source={require('../../../../assets/cimg.png')}
                      style={{
                        height: hp(7),
                        width: wp(17),
                        borderRadius: 15,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{color: 'black', fontFamily: 'Poppins-Medium'}}>
                      {data.first_name} {data.last_name}
                    </Text>
                    <Text
                      style={{
                        color: '#939094',
                        fontFamily: 'Poppins-Medium',
                        fontSize: hp(1.4),
                      }}>
                      {data.department_name} | Booking Id:{data.booking_id}
                    </Text>
                  </View>
                </View>

                <View style={styles.columnStatus}>
                  <TouchableWithoutFeedback>
                    <Text
                      style={{
                        color: data.is_active ? '#E72B4A' : 'black',
                        textAlign: 'center',
                        fontFamily: 'Poppins-Medium',
                        borderWidth: data.is_active ? 1 : 0.5,
                        borderRadius: 15,
                        padding: 7,
                        borderColor: data.is_active ? '#E72B4A' : '#939094',
                        fontSize: hp(1.5),
                      }}>
                      {data.is_active ? 'Active' : 'In-Active'}
                    </Text>
                  </TouchableWithoutFeedback>
                </View>

                <View style={[styles.columnDate, {left: 50}]}>
                  <Text style={styles.GreyText}>date and time</Text>
                </View>

                <View style={[styles.columnPackage, {left: 50}]}>
                  <Text style={styles.GreyText}>-hlhjk</Text>
                </View>

                <View style={[styles.columnAmount, {left: 50}]}>
                  <Text style={styles.amount}>$12</Text>
                </View>

                <TouchableOpacity
                  style={[styles.editIcon, {left: 50}]}></TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
    <View>
    {/* <DateRangePicker /> */}
    {/* <PaginationComponent currentPage={2} totalPages={10}/> */}
    </View>
  </SafeAreaView>
  );
};

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
    backgroundColor: '#fff',
  },

  tableContainer: {
    borderColor: '#AEAAAE',
    borderWidth: 1,
    borderRadius: 12,
    width: 1000,
  },

  header: {
    flexDirection: 'row',
    height: 90,
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
    height: hp(11),
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
export default AllDoctors;
