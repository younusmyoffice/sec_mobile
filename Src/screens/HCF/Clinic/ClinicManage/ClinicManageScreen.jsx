/**
 * ============================================================================
 * CLINIC MANAGE SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for Clinic users to manage sales activities and audit logs.
 * 
 * FEATURES:
 * - Tab-based navigation (Sale Activities, Audit)
 * - Sub-components for sales and audit management
 * 
 * SECURITY:
 * - No direct API calls (delegated to child components)
 * - Navigation structure only
 * 
 * REUSABLE COMPONENTS:
 * - TopTabs: Tab navigation
 * - ClinicSalesActivities: Sales activities component
 * - ClinicAuditLogs: Audit logs component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ClinicManageScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import ClinicSalesActivities from './ClinicSalesActivities/ClinicSalesActivities';
import ClinicAuditLogs from './ClinicAuditLogs/ClinicAuditLogs';
import Header from '../../../../components/customComponents/Header/Header';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function ClinicManageScreen() {
  const [activeTab, setActiveTab] = useState('Sale Activities');

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Sale Activities':
        Logger.debug('Rendering ClinicSalesActivities');
        return <ClinicSalesActivities />;
      case 'Audit':
        Logger.debug('Rendering ClinicAuditLogs');
        return <ClinicAuditLogs />;
      default:
        Logger.warn('Invalid pub', { activeTab });
        return null;
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      nestedScrollEnabled={true}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            logo={require('../../../../assets/Clinic1.jpeg')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
            onlybell={true}
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            <TopTabs
              data={[
                {id: 1, title: 'Sale Activities'},
                {id: 2, title: 'Audit'},
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </View>
          
          <View style={styles.componentContainer}>
            {renderComponent()}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  headerContainer: {
    // Header container styling
  },
  content: {
    padding: 15,
    gap: 10,
  },
  tabsContainer: {
    // Tabs container styling
  },
  componentContainer: {
    // Component container styling
  },
});
