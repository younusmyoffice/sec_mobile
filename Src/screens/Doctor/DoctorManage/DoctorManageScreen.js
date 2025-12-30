/**
 * ============================================================================
 * SCREEN: Doctor Manage
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for doctors to manage audit logs and staff
 * 
 * SECURITY:
 * - No direct API calls, delegates to child components
 * - Navigation management
 * 
 * FEATURES:
 * - Audit logs management
 * - Staff management (future)
 * 
 * @module DoctorManageScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import Header from '../../../components/customComponents/Header/Header';
import AuditLogs from './ManageComponents/AuditLogs';
import StaffManage from './ManageComponents/StaffManage';

// Utils & Constants
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();

export default function DoctorManageScreen() {
  const navigation = useNavigation();

  // STATE: Active tab selection
  const [activeTab, setActiveTab] = useState('Audit Logs');

  Logger.debug('Doctor Manage Screen initialized');

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate manage component for the selected tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Audit Logs':
        return <AuditLogs />;
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
        {/* BUTTON: Create Staff (only shown on Staff tab) */}
        {activeTab === 'Staff' ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Create Staff"
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.PRIMARY} // DESIGN: Use color constant
              borderWidth={1}
              borderRadius={30}
              width={wp(35)}
              fontfamily="Poppins-SemiBold"
              onPress={() => {
                Logger.debug('Navigate to CreateStaffDoctor');
                navigation.navigate('CreateStaffDoctor');
              }}
            />
          </View>
        ) : null}

        {/* TABS: Manage sections */}
        <View style={styles.tabsContainer}>
          <TopTabs
            borderRadius={8}
            bordercolor={COLORS.BG_WHITE} // DESIGN: Use color constant
            data={[
              {title: 'Audit Logs'},
              // TODO: Add 'Staff' tab when StaffManage is implemented
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
  buttonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
