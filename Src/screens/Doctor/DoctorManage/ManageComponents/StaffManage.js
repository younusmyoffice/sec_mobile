/**
 * ============================================================================
 * COMPONENT: Staff Manage
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying staff management table
 * 
 * SECURITY:
 * - Currently using static data
 * - Should integrate with API for real staff data
 * 
 * TODO:
 * - Integrate with API to fetch actual staff data
 * - Add staff creation/editing functionality
 * - Add proper error handling and loading states
 * 
 * @module StaffManage
 */

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

// Components
import CustomTable from '../../../../components/customTable/CustomTable';

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

export default function StaffManage() {
  // DATA: Table headers
  const header = ['Name & ID', 'Access Level', 'Action'];

  // DATA: Static sample data (TODO: Replace with API data)
  const data = [
    {
      id: 1,
      image: require('../../../../assets/cimg.png'),
      name: 'Ayesha',
      acc_no: '220020020202',
      status: 'in-progress',
      bookingid: '1453123412|543252',
    },
  ];

  Logger.debug('StaffManage component rendered');

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <CustomTable
          textCenter={'center'}
          header={header}
          data={data}
          flexvalue={2}
          isUserDetails={true}
          rowTextCenter={true}
          rowDataCenter={true}
          backgroundkey={'acc_no'}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No staff members found</Text>
        </View>
      )}
    </View>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
