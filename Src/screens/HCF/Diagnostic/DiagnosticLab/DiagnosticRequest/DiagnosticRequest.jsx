/**
 * ============================================================================
 * DIAGNOSTIC REQUEST COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Container component for Diagnostic Request section with tabs for
 * Received and Rejected test requests.
 * 
 * FEATURES:
 * - Tab-based navigation (Received, Rejected)
 * - Sub-components for received and rejected requests
 * 
 * REUSABLE COMPONENTS:
 * - TopTabs: Tab navigation
 * - Recieved: Received requests component
 * - Rejected: Rejected requests component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module DiagnosticRequest
 */

import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Recieved from './Recieved';
import Rejected from './Rejected';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const DiagnosticRequest = () => {
  const [activeTab, setActiveTab] = useState('Recevied'); // NOTE: Typo in original - "Recevied" should be "Received"

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Recevied': // NOTE: Keeping original typo for consistency
        Logger.debug('Rendering Recieved component');
        return <Recieved />;
      case 'Rejected':
        Logger.debug('Rendering Rejected component');
        return <Rejected />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          <TopTabs
            data={[
              {id: 1, title: 'Recevied'}, // NOTE: Typo kept for consistency
              {id: 2, title: 'Rejected'},
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

export default DiagnosticRequest;
