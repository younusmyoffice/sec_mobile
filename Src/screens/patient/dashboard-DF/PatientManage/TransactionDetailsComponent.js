/**
 * ============================================================================
 * TRANSACTION DETAILS COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display patient transaction history in a specialized transaction table.
 * 
 * FEATURES:
 * - Display transactions with transaction ID, date/time, and amount
 * - Specialized CustomTransactionTable component
 * 
 * SECURITY:
 * - No direct API calls (data received via props from parent)
 * - Safe data handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomTransactionTable: Specialized transaction table component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module TransactionDetailsComponent
 */

import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React from 'react';
import CustomTransactionTable from '../../../../components/customTable/CustomTransactionTable';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const TransactionDetailsComponent = ({data}) => {
  /**
   * Table headers for transaction details
   */
  const header = ['Transaction & ID', 'Date & Time', 'Amount'];

  Logger.debug('TransactionDetailsComponent rendered', {
    dataCount: data?.length || 0,
  });

  return (
    <SafeAreaView style={styles.container}>
      <CustomTransactionTable
        header={header}
        textCenter={'center'}
        data={data || []}
      />
    </SafeAreaView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
  },
});

export default TransactionDetailsComponent;
