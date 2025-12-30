/**
 * ============================================================================
 * COMPONENT: Lab List
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying lab list in a table format
 * 
 * SECURITY:
 * - No direct API calls, receives data as prop
 * - Read-only display component
 * 
 * @module Lab
 */

import {
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
import {useNavigation} from '@react-navigation/native';

// Components
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

const Lab = ({data}) => {
  const navigation = useNavigation();

  Logger.debug('Lab component rendered', {
    dataLength: data?.length || 0,
    isArray: Array.isArray(data),
  });

  // LOADING STATE: Show loading message if data is undefined
  if (data === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading labs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // EMPTY STATE: Show empty message if no data
  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No labs found</Text>
          <Text style={styles.emptySubtitle}>
            Create your first lab to get started
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * HANDLER: Navigate to edit lab screen
   * 
   * @param {object} item - Lab item to edit
   */
  const handleEditLab = item => {
    Logger.debug('Navigate to edit lab', { itemId: item?.exam_id });
    navigation.navigate('create-lab', {item: item, status: 'edit'});
  };

  /**
   * HANDLER: Navigate to view lab screen
   * 
   * @param {number|string} id - Lab exam ID
   */
  const handleViewLab = (id) => {
    Logger.debug('Navigate to view lab', { examId: id });
    navigation.navigate('view-lab', {exam_id: id});
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View style={styles.tableContainer}>
          <View style={styles.row}>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={styles.headerText}>Name & Details</Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Department
              </Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Status
              </Text>
            </View>
            <View style={[styles.headerCell, {flex: 1}]}>
              <Text style={[styles.headerText, {textAlign: 'center'}]}>
                Action
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View>
            {data?.map((item, i) => (
              <TouchableOpacity key={i} onPress={()=>handleViewLab(item.exam_id)}>
                <>
                  <View style={styles.row}>
                    <View style={[styles.cell, {flex: 1}]}>
                      <View style={styles.cellContent}>
                        <View>
                          <Text style={styles.nameText}>{item?.exam_name}</Text>
                          <Text style={styles.detailsText}>
                            Lab Id:{item?.lab_department_id}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                          <Text style={[styles.cellText, styles.centerText]}>
                        {item?.lab_department_name || 'N/A'}
                      </Text>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                      <Text
                        style={[
                          styles.statusText,
                          item?.lab_status === 1
                            ? styles.statusActive
                            : styles.statusInactive,
                        ]}>
                        {item?.lab_status === 1 ? 'Active' : 'In-Active'}
                      </Text>
                    </View>
                    <View style={[styles.cell, {flex: 1}]}>
                      <TouchableWithoutFeedback
                        onPress={() => handleEditLab(item)}>
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
                </>
              </TouchableOpacity>
            ))}
          </View>
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

export default Lab;
