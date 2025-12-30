/**
 * ============================================================================
 * SCREEN: Admin Manage
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for HCF Admin to manage:
 * - Sales Activities (Doctors & Diagnostic)
 * - Overview (Revenue and earnings)
 * - Bookings (Transaction history)
 * - Payout (Cash out requests)
 * - Audit (Activity logs)
 * 
 * SECURITY:
 * - No direct API calls, delegates to child components
 * - Tab navigation management
 * 
 * @module AdminManageScreen
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import Header from '../../../../components/customComponents/Header/Header';
import SalesActivities from './SalesActivities/SalesActivities';
import Overview from './Overview/Overview';
import Bookings from './Bookings/Bookings';
import Payout from './Payout/Payout';
import Audit from './Audit/Audit';

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();

export default function AdminManageScreen() {
  // STATE: Active tab selection
  const [activeTab, setactiveTab] = useState('Sale Activities');

  Logger.debug('AdminManageScreen initialized', { activeTab });

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate management component for the selected tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    Logger.debug('renderComponent called', { activeTab });

    switch (activeTab) {
      case 'Sale Activities':
        return <SalesActivities />;
      case 'Overview':
        return <Overview />;
      case 'Bookings':
        return <Bookings />;
      case 'Payout':
        return <Payout />;
      case 'Audit':
        return <Audit />;
      default:
        return null;
    }
  };
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* TABS */}
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Sale Activities'},
                {id: 2, title: 'Overview'},
                {id: 3, title: 'Bookings'},
                {id: 4, title: 'Payout'},
                {id: 5, title: 'Audit'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>

          {/* TAB CONTENT */}
          <View>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  safeArea: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  content: {
    padding: 15,
    gap: 10,
  },
});
