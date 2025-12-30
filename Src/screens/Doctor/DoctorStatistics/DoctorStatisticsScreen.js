/**
 * ============================================================================
 * SCREEN: Doctor Statistics
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for doctors to view statistics (Booking History, Transactions, Overview, Payout)
 * 
 * SECURITY:
 * - No direct API calls, delegates to child components
 * - Tab navigation management
 * 
 * FEATURES:
 * - Booking history statistics
 * - Transaction details
 * - Earnings overview
 * - Payout management
 * 
 * @module DoctorStatisticsScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Components
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import Header from '../../../components/customComponents/Header/Header';
import BookingHistory from './StatisticsComponents/BookingHistory';
import Transaction from './StatisticsComponents/Transaction';
import Overview from './StatisticsComponents/Overview';
import Payout from './StatisticsComponents/Payout';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';

// Utils & Constants
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();

export default function DoctorStatisticsScreen() {
  // STATE: Active tab selection
  const [activeTab, setActiveTab] = useState('Booking History');

  Logger.debug('Doctor Statistics Screen initialized', { activeTab });

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate statistics component for the selected tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Booking History':
        return <BookingHistory />;
      case 'Transaction Details':
        return <Transaction />;
      case 'Overview':
        return <Overview />;
      case 'Payout':
        return <Payout />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          notificationUserIcon={true}
          id={3}
        />
      </View>

      <ScrollView>
        {/* TABS: Statistics sections */}
        <View style={styles.tabsContainer}>
          <TopTabs
            borderRadius={8}
            bordercolor={COLORS.BG_WHITE} // DESIGN: Use color constant
            data={[
              {title: 'Booking History'},
              {title: 'Transaction Details'},
              {title: 'Overview'},
              {title: 'Payout'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </View>

        {/* CONTENT: Render active tab component */}
        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    flex: 1,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
