/**
 * ============================================================================
 * DIAGNOSTIC CHAT COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display chat functionality for Diagnostic users.
 * 
 * FEATURES:
 * - Display chat interface
 * - Real-time messaging (handled by ChatsScreen component)
 * 
 * REUSABLE COMPONENTS:
 * - ChatsScreen: Chat interface component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * NOTE:
 * This is a wrapper component that delegates chat functionality to ChatsScreen.
 * All chat logic, API calls, and state management are handled by ChatsScreen.
 * 
 * @module DiagnosticChat
 */

import { View, StyleSheet } from 'react-native';
import React from 'react';
import ChatsScreen from '../../../../../components/AppointmentComponents/ChatsScreen';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const DiagnosticChat = () => {
  Logger.debug('DiagnosticChat component rendered');

  return (
    <View style={styles.container}>
      <ChatsScreen />
    </View>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_WHITE,
  },
});

export default DiagnosticChat;
