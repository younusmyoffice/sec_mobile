/**
 * ============================================================================
 * COMPONENT: Staff List
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying staff list in a table format
 * 
 * SECURITY:
 * - No direct API calls, receives data as prop
 * - Read-only display component
 * 
 * @module Staff
 */

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import {getProfileImageSource} from '../../../../utils/imageUtils'; // UTILITY: Image handling

const Staff = ({data}) => {
  Logger.debug('Staff component rendered', {
    dataLength: data?.length || 0,
    isArray: Array.isArray(data),
  });

  // LOADING STATE: Show loading message if data is undefined
  if (data === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading staff...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // EMPTY STATE: Show empty message if no data
  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No staff found</Text>
          <Text style={styles.emptySubtitle}>
            Add your first staff member to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  // SUCCESS STATE: Render staff table
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style={styles.tableContainer}>
          {/* TABLE HEADER */}
          <View style={styles.row}>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={styles.headerText}>Name & Details</Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, styles.centerText]}>
                Department
              </Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, styles.centerText]}>Status</Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, styles.centerText]}>Action</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* TABLE ROWS */}
          <TouchableWithoutFeedback>
            <View>
              {data?.map((item, i) => (
                <React.Fragment key={i}>
                  <View style={styles.row}>
                    {/* NAME & DETAILS */}
                    <View style={[styles.cell, {flex: 1}]}>
                      <View style={styles.cellContent}>
                        <View style={styles.imageContainer}>
                          <Image
                            source={getProfileImageSource(item?.profile_picture)} // UTILITY: Standardized image handling
                            style={styles.image}
                          />
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={styles.nameText}>
                            {item?.first_name || 'N/A'}
                          </Text>
                          <Text style={styles.detailsText}>
                            Lab Id: {item?.lab_department_id || 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* DEPARTMENT */}
                    <View style={[styles.cell, {flex: 1}]}>
                      <Text style={[styles.cellText, styles.centerText]}>
                        {item?.lab_department_name || 'N/A'}
                      </Text>
                    </View>

                    {/* STATUS */}
                    <View style={[styles.cell, {flex: 1}]}>
                      <Text
                        style={[
                          styles.statusText,
                          item?.diag_status === 1
                            ? styles.statusActive
                            : styles.statusInactive,
                        ]}>
                        {item?.diag_status === 1 ? 'Active' : 'In-Active'}
                      </Text>
                    </View>

                    {/* ACTION */}
                    <View style={[styles.cell, {flex: 1}]}>
                      <TouchableWithoutFeedback>
                        <MaterialCommunityIcons
                          style={styles.centerText}
                          name="pencil"
                          size={30}
                          color={COLORS.PRIMARY} // DESIGN: Use color constant
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  <View style={styles.divider} />
                </React.Fragment>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    marginBottom: 20,
  },
  tableContainer: {
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderWidth: 1,
    borderRadius: 12,
    width: 800,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerCell: {
    padding: 5,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
  },
  centerText: {
    textAlign: 'center',
  },
  cell: {
    justifyContent: 'center',
    padding: 5,
  },
  cellContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
  },
  detailsText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  cellText: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
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
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
  },
});

export default Staff;