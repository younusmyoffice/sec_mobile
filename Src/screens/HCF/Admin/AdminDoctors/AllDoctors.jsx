/**
 * ============================================================================
 * COMPONENT: All Doctors List (Legacy/Unused)
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying all doctors in a table format
 * 
 * NOTE:
 * This component appears to be unused/legacy code with hardcoded data.
 * Consider removing or updating to use actual API data if needed.
 * 
 * SECURITY:
 * - No direct API calls
 * - Uses hardcoded sample data
 * 
 * @module AllDoctors
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

const AllDoctors = () => {
  Logger.debug('AllDoctors component rendered (legacy component)');

  // TODO: Replace with actual API data
  // DATA: Hardcoded sample data (should be replaced with API data)
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
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.tableContainer}>
            {/* TABLE HEADER */}
            <View style={styles.header}>
              <Text style={[styles.headerText, styles.columnName]}>
                Name & Details
              </Text>
              <Text style={[styles.headerText, styles.columnStatus]}>Status</Text>
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

            {/* TABLE ROWS */}
            <ScrollView>
              {cardData.map((data, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.nameSection}>
                    <View>
                      <Image
                        source={getProfileImageSource()} // UTILITY: Standardized image handling
                        style={styles.profileImage}
                      />
                    </View>
                    <View>
                      <Text style={styles.nameText}>
                        {data.first_name} {data.last_name}
                      </Text>
                      <Text style={styles.detailsText}>
                        {data.department_name} | Booking Id: {data.booking_id}
                      </Text>
                    </View>
                  </View>

                  {/* STATUS */}
                  <View style={styles.columnStatus}>
                    <TouchableWithoutFeedback>
                      <Text
                        style={[
                          styles.statusText,
                          data.is_active
                            ? styles.statusActive
                            : styles.statusInactive,
                        ]}>
                        {data.is_active ? 'Active' : 'In-Active'}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>

                  {/* DATE & TIME */}
                  <View style={[styles.columnDate, styles.columnLeft50]}>
                    <Text style={styles.GreyText}>date and time</Text>
                  </View>

                  {/* PACKAGE */}
                  <View style={[styles.columnPackage, styles.columnLeft50]}>
                    <Text style={styles.GreyText}>-hlhjk</Text>
                  </View>

                  {/* AMOUNT */}
                  <View style={[styles.columnAmount, styles.columnLeft50]}>
                    <Text style={styles.amount}>$12</Text>
                  </View>

                  {/* EDIT ICON */}
                  <TouchableOpacity
                    style={[styles.editIcon, styles.columnLeft50]}></TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
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
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(60),
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
    fontSize: 16,
  },
  detailsText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.4),
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
  columnLeft50: {
    left: 50,
  },
  statusText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    borderWidth: 1,
    borderRadius: 15,
    padding: 7,
    fontSize: hp(1.5),
  },
  statusActive: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    borderColor: COLORS.PRIMARY, // DESIGN: Use color constant
  },
  statusInactive: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderWidth: 0.5,
  },
  GreyText: {
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontSize: hp(1.7),
  },
  editIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(1.8),
  },
});

export default AllDoctors;
