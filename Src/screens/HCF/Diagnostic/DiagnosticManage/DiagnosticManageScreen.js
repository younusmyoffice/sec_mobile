/**
 * ============================================================================
 * DIAGNOSTIC MANAGE SCREEN
 * ============================================================================
 *
 * PURPOSE:
 * Tabbed view for Diagnostic Sales Activities and Audit Logs.
 *
 * NOTES:
 * - No direct API calls here; child screens handle data fetching.
 * - Uses COLORS for consistent styling and Logger in child screens.
 */
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import DiagnosticSalesActivities from './DiagnosticSalesActivities/DiagnosticSalesActivities';
import DiagnosticAuditLogs from './DiagnosticAuditLogs/DiagnosticAuditLogs';
import Header from '../../../../components/customComponents/Header/Header';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const Stack = createNativeStackNavigator();
export default function DiagnosticManageScreen() {
  const [activeTab, setactiveTab] = useState('Sale Activities');
  const renderComponent = () => {
    switch (activeTab) {
      case 'Sale Activities':
        Logger.debug('DiagnosticManage: Rendering Sales Activities');
        return <DiagnosticSalesActivities/>;
      case 'Audit':
        Logger.debug('DiagnosticManage: Rendering Audit Logs');
        return <DiagnosticAuditLogs/>;
    
    }
  };
  return (
    <ScrollView style={styles.scrollView}>
           <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
        id={4}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View>
            <TopTabs
              data={[
                {id: 1, title: 'Sale Activities'},
                {id: 2, title: 'Audit'},
                
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
            />
          </View>
          <View style={styles.componentContainer}>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  container: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    padding: 15,
    gap: 10,
  },
  componentContainer: {
    marginTop: '5%',
  },
});
