/**
 * ============================================================================
 * COMPONENT: Blocked Staff List
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying blocked staff list in a table format
 * 
 * SECURITY:
 * - No direct API calls, receives data as prop
 * - Read-only display component
 * 
 * @module Blocked
 */

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

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import {getProfileImageSource} from '../../../../utils/imageUtils'; // UTILITY: Image handling

const Blocked = ({data}) => {
  Logger.debug('Blocked component rendered', {
    dataLength: data?.length || 0,
    isArray: Array.isArray(data),
  });

  // LOADING STATE: Show loading message if data is undefined
  if (data === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading blocked staff...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // EMPTY STATE: Show empty message if no data
  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No blocked staff found</Text>
          <Text style={styles.emptySubtitle}>
            All staff members are currently active
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  // Use API data instead of hardcoded data
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
                Title
              </Text>
              <Text style={[styles.headerText, styles.columnDate]}>
               Department
              </Text>
              <Text style={[styles.headerText, styles.columnPackage]}>
                Status
              </Text>
              {/* <Text style={[styles.headerText, styles.columnAmount]}>
                Amount
              </Text> */}
            </View>
            <ScrollView>
              {data.map((item, index) => (
                <View key={index} style={styles.card}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: wp(60),
                    }}>
                    <View>
                      <Image
                        source={getProfileImageSource(item?.profile_picture)} // UTILITY: Standardized image handling
                        style={styles.profileImage}
                      />
                    </View>
                    <View>
                      <Text style={styles.nameText}>
                        {item?.first_name || ''} {item?.last_name || ''}
                      </Text>
                      <Text style={styles.detailsText}>
                        {item?.lab_department_name || 'N/A'} | Staff ID:{' '}
                        {item?.staff_id || 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.columnStatus}>
                    <TouchableWithoutFeedback>
                      <Text
                        style={[
                          styles.statusText,
                          item.diag_status === 0
                            ? styles.statusBlocked
                            : styles.statusActive,
                        ]}>
                        {item?.diag_status === 0 ? 'Blocked' : 'Active'}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>

                  <View style={[styles.columnDate, {left: 50}]}>
                    <Text style={styles.GreyText}>
                      {item?.hcf_diag_name || 'N/A'}
                    </Text>
                  </View>

                  <View style={[styles.columnPackage, {left: 50}]}>
                    <Text style={styles.GreyText}>
                      {item?.email || 'N/A'}
                    </Text>
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
  )
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
      backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    },
    centered: {
      padding: 20,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
      fontFamily: 'Poppins-Medium',
    },
    emptyTitle: {
      fontSize: 16,
      color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
      fontFamily: 'Poppins-Medium',
    },
    emptySubtitle: {
      fontSize: 14,
      color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
      marginTop: 5,
      fontFamily: 'Poppins-Regular',
    },
    profileImage: {
      height: hp(7),
      width: wp(17),
      borderRadius: 15,
      resizeMode: 'contain',
    },
    nameText: {
      color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
      fontFamily: 'Poppins-Medium',
    },
    detailsText: {
      color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
      fontFamily: 'Poppins-Medium',
      fontSize: hp(1.4),
    },
    statusText: {
      textAlign: 'center',
      fontFamily: 'Poppins-Medium',
      borderWidth: 1,
      borderRadius: 15,
      padding: 7,
      fontSize: hp(1.5),
    },
    statusBlocked: {
      color: COLORS.PRIMARY, // DESIGN: Use color constant
      borderColor: COLORS.PRIMARY, // DESIGN: Use color constant
    },
    statusActive: {
      color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
      borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
      borderWidth: 0.5,
    },
  
    tableContainer: {
      borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
      borderWidth: 1,
      borderRadius: 12,
      width: 1000,
    },
    header: {
      flexDirection: 'row',
      height: 90,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    headerText: {
      fontWeight: '600',
      fontSize: 16,
      color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
      fontFamily: 'Poppins-Medium',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
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
    GreyText: {
      fontFamily: 'Poppins-Medium',
      color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
      fontSize: hp(1.7),
    },
  });

export default Blocked;