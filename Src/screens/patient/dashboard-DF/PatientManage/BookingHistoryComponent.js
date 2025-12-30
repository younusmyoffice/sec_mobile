/**
 * ============================================================================
 * BOOKING HISTORY COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display patient booking history in a table format with infinite scroll.
 * 
 * FEATURES:
 * - Display booking history in CustomTable
 * - Infinite scroll support
 * - Loading states
 * 
 * REUSABLE COMPONENTS:
 * - CustomTable: Table display component with infinite scroll
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module BookingHistoryComponent
 */

import {
  View,
  StyleSheet,
} from 'react-native';
import React from 'react';
import CustomTable from '../../../../components/customTable/CustomTable';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function BookingHistoryComponent({
  data,
  handleScrollEnd,
  isLoading,
  length,
}) {
  /**
   * Table headers for booking history
   */
  const header = [
    'Name & Details',
    'Date',
    'Time',
    'Amount',
    'Package',
    'Duration',
    'Department',
    'Status',
  ];

  Logger.debug('BookingHistoryComponent rendered', {
    dataCount: data?.length || 0,
    isLoading,
    length,
  });

  return (
    <View style={styles.container}>
      <View>
        <CustomTable
          header={header}
          isUserDetails={true}
          data={data || []}
          flexvalue={2}
          rowDataCenter={true}
          textCenter={'center'}
          roundedBtn={'status'}
          amount={'amount'}
          loadmore={handleScrollEnd}
          loading={isLoading}
          length={length}
        />
      </View>
    </View>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
  },
});
