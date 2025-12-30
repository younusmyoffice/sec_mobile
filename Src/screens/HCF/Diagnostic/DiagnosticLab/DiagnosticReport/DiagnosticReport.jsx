/**
 * ============================================================================
 * DIAGNOSTIC REPORT COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Container component for Diagnostic Report section with tabs for
 * Share List and Shared reports.
 * 
 * FEATURES:
 * - Tab-based navigation (Share List, Shared)
 * - Sub-components for share list and shared reports
 * 
 * REUSABLE COMPONENTS:
 * - TopTabs: Tab navigation
 * - ShareList: Share list component
 * - Shared: Shared reports component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module DiagnosticReport
 */

import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShareList from './ShareList';
import Shared from './Shared';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const DiagnosticReport = () => {
  const [activeTab, setActiveTab] = useState('Share List');

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Share List':
        Logger.debug('Rendering ShareList component');
        return <ShareList />;
      case 'Shared':
        Logger.debug('Rendering Shared component');
        return <Shared />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return <ShareList />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <TopTabs
            data={[
              {id: 1, title: 'Share List'},
              {id: 2, title: 'Shared'},
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeButtonColor="black"
            nonactivecolor={COLORS.TEXT_WHITE}
            borderRadius={20}
          />
        </View>
      </View>
      
      <View style={styles.componentContainer}>
        {renderComponent()}
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
    gap: 10,
  },
  tabsWrapper: {
    alignSelf: 'center',
  },
  tabsContainer: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 20,
    gap: 5,
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentContainer: {
    // Component container styling
  },
});

export default DiagnosticReport;
