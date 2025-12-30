/**
 * ============================================================================
 * DIAGNOSTIC LAB SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main navigation screen for Diagnostic Lab section with tabs for Request,
 * Examination, Report, and Chat functionality.
 * 
 * FEATURES:
 * - Tab-based navigation (Request, Examination, Report, Chat)
 * - Search functionality (hidden for Chat tab)
 * - Sub-components for each section
 * 
 * SECURITY:
 * - No direct API calls (delegated to child components)
 * - Navigation structure only
 * 
 * REUSABLE COMPONENTS:
 * - TopTabs: Tab navigation
 * - CustomSearch: Search input (conditionally rendered)
 * - DiagnosticRequest: Request management component
 * - DiagnosticExamination: Examination list component
 * - DiagnosticReport: Report management component
 * - DiagnosticChat: Chat component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module DiagnosticLabScreen
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomSearch from '../../../../components/customSearch/CustomSearch';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DiagnosticRequest from './DiagnosticRequest/DiagnosticRequest';
import DiagnosticExamination from './DiagnosticExamination/DiagnosticExamination';
import DiagnosticReport from './DiagnosticReport/DiagnosticReport';
import DiagnosticChat from './DiagnosticChat/DiagnosticChat';
import Header from '../../../../components/customComponents/Header/Header';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function DiagnosticLabScreen() {
  const [activeTab, setActiveTab] = useState('Request');

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Request':
        Logger.debug('Rendering DiagnosticRequest');
        return <DiagnosticRequest />;
      case 'Examination':
        Logger.debug('Rendering DiagnosticExamination');
        return <DiagnosticExamination />;
      case 'Report':
        Logger.debug('Rendering DiagnosticReport');
        return <DiagnosticReport />;
      case 'Chat':
        Logger.debug('Rendering DiagnosticChat');
        return <DiagnosticChat />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Header
            logo={require('../../../../assets/headerDiagonsis.jpeg')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
            onlybell={true}
            id={4}
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            <TopTabs
              data={[
                {id: 1, title: 'Request'},
                {id: 2, title: 'Examination'},
                {id: 3, title: 'Report'},
                {id: 4, title: 'Chat'},
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </View>
          
          {/* Search - Hidden for Chat tab */}
          <View style={styles.searchContainer}>
            {activeTab !== 'Chat' && (
              <CustomSearch
                placeholderTextColor={COLORS.TEXT_GRAY}
                showmenuIcon={true}
              />
            )}
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
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
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
  searchContainer: {
    // Search container styling
  },
  componentContainer: {
    // Component container styling
  },
});
