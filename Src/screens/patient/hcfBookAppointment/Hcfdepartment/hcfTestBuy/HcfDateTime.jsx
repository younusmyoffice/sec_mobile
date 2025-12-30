/**
 * ============================================================================
 * HCF DATE TIME SELECTOR
 * ============================================================================
 * 
 * PURPOSE:
 * Component for selecting date and time for lab test booking.
 * 
 * FEATURES:
 * - Date picker with available dates
 * - Time slot selection
 * 
 * SECURITY:
 * - No direct API calls (uses props)
 * - Safe data handling
 * 
 * REUSABLE COMPONENTS:
 * - DatePicker: Calendar date picker component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module HcfDateTime
 */

import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DatePicker from '../../../../../components/callendarPicker/DatePickerCallendar';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const HcfDateTime = ({ availableDates, availableSlots, setBookTest, bookTest }) => {
  const [timedetails, setTimedetails] = useState({
    slot: '',
  });

  Logger.debug('HcfDateTime rendered', {
    availableDatesCount: availableDates?.length || 0,
    availableSlotsCount: availableSlots?.length || 0,
    hasBookDate: !!bookTest?.book_date,
  });

  return (
    <View style={styles.container}>
      <View>
        <DatePicker
          styleprop={false}
          availableDates={availableDates || []}
          SetPatientDetails={setBookTest}
          patientdetails={bookTest}
          mode={false}
        />
      </View>
    </View>
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

export default HcfDateTime;
