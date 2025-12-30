/**
 * ============================================================================
 * SCREEN: Admin Diagnostic Management
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for HCF Admin to manage diagnostic labs, staff, and blocked staff
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Validates userId before API calls
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Uses Promise.allSettled for independent API calls
 * - Graceful fallbacks for missing data
 * 
 * PERFORMANCE:
 * - Concurrent API calls with Promise.allSettled
 * - Independent error handling per API call
 * 
 * @module AdminDiagnosticScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';

// Components
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomButton from '../../../../components/customButton/CustomButton';
import Header from '../../../../components/customComponents/Header/Header';
import Lab from './Lab';
import Staff from './Staff';
import Blocked from './Blocked';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useAuth} from '../../../../Store/Authentication';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function AdminDiagnosticScreen() {
  const route = useRoute();
  const {userId} = useAuth();
  const navigation = useNavigation();

  // STATE: Active tab and data
  const [activeTab, setActiveTab] = useState('Lab');
  const [lab, setLab] = useState([]);
  const [staff, setStaff] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  Logger.debug('AdminDiagnosticScreen initialized', {
    userId,
    activeTab,
    routeState: route.state,
  });

  /**
   * EFFECT: Monitor state changes for debugging
   */
  useEffect(() => {
    Logger.debug('State changed', {
      labCount: lab?.length || 0,
      staffCount: staff?.length || 0,
      blockedCount: blocked?.length || 0,
    });
  }, [lab, staff, blocked]);

  /**
   * API: Fetch HCF diagnostic data (Labs, Staff, Blocked Staff)
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * PERFORMANCE: Uses Promise.allSettled to prevent one failure from affecting others
   * ERROR HANDLING: Independent error handling per API call
   * 
   * @returns {Promise<void>}
   */
  const fetchhcf = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for diagnostic data', { userId });
      setError(errorMsg);
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      setLab([]);
      setStaff([]);
      setBlocked([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      Logger.api('GET', `hcf/getHcfLab/${userId}, getHcfStaff/${userId}, getHcfStaff/${userId}/blocked (3 concurrent calls)`);

      // PERFORMANCE: Fetch each API independently to prevent one failure from affecting others
      const [labResult, staffResult, blockedResult] = await Promise.allSettled([
        axiosInstance.get(`hcf/getHcfLab/${userId}`),
        axiosInstance.get(`hcf/getHcfStaff/${userId}`),
        axiosInstance.get(`hcf/getHcfStaff/${userId}/blocked`),
      ]);

      // ERROR HANDLING: Handle lab data independently
      if (labResult.status === 'fulfilled') {
        const labDataToSet = labResult.value.data?.response || [];
        Logger.info('Lab API success', { count: labDataToSet.length });
        setLab(labDataToSet);
      } else {
        Logger.error('Lab API failed', {
          error: labResult.reason?.message,
          status: labResult.reason?.response?.status,
        });
        setLab([]);
        // REUSABLE TOAST: Show error for lab
        CustomToaster.show(
          'error',
          'Error',
          'Failed to load lab data. Please try again.',
        );
      }

      // ERROR HANDLING: Handle staff data independently
      if (staffResult.status === 'fulfilled') {
        const staffDataToSet = staffResult.value.data?.response || [];
        Logger.info('Staff API success', { count: staffDataToSet.length });
        setStaff(staffDataToSet);
      } else {
        Logger.error('Staff API failed', {
          error: staffResult.reason?.message,
          status: staffResult.reason?.response?.status,
        });
        setStaff([]);
        // REUSABLE TOAST: Show error for staff
        CustomToaster.show(
          'error',
          'Error',
          'Failed to load staff data. Please try again.',
        );
      }

      // ERROR HANDLING: Handle blocked data independently
      if (blockedResult.status === 'fulfilled') {
        const blockedDataToSet = blockedResult.value.data?.response || [];
        Logger.info('Blocked API success', { count: blockedDataToSet.length });
        setBlocked(blockedDataToSet);
      } else {
        Logger.error('Blocked API failed', {
          error: blockedResult.reason?.message,
          status: blockedResult.reason?.response?.status,
        });
        setBlocked([]);
        // REUSABLE TOAST: Show error for blocked (optional, not critical)
        Logger.debug('Blocked staff list failed (non-critical)');
      }

      Logger.info('All API calls processed independently');
    } catch (error) {
      // ERROR HANDLING: Unexpected error handling
      const errorMessage =
        error?.message || 'An unexpected error occurred. Please try again.';

      Logger.error('Unexpected error in fetchhcf', {
        error: errorMessage,
        error: error,
      });

      setError(errorMessage);
      setLab([]);
      setStaff([]);
      setBlocked([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * RENDER: Render component based on active tab
   * 
   * Returns the appropriate component for the selected tab with its data
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    Logger.debug('renderComponent called', {
      activeTab,
      labCount: lab?.length || 0,
      staffCount: staff?.length || 0,
      blockedCount: blocked?.length || 0,
    });

    switch (activeTab) {
      case 'Lab':
        return <Lab data={lab} />;
      case 'Staff':
        return <Staff data={staff} />;
      case 'Blocked':
        return <Blocked data={blocked} />;
      default:
        return null;
    }
  };

  /**
   * HANDLER: Navigate to create lab screen
   */
  const handleCreateLab = () => {
    Logger.debug('Navigate to create-lab');
    navigation.navigate('create-lab');
  };

  /**
   * HANDLER: Navigate to create staff screen
   */
  const handleCreateStaff = () => {
    Logger.debug('Navigate to create-staff');
    navigation.navigate('create-staff');
  };

  /**
   * EFFECT: Refresh data when screen comes into focus
   * 
   * SECURITY: Includes userId dependency to refresh when user changes
   */
  useFocusEffect(
    useCallback(() => {
      Logger.debug('Screen focused - refreshing data');
      fetchhcf();
    }, [userId]), // Include userId as dependency to refresh when user changes
  );

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
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
          {/* LOADING STATE */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <CustomLoader />
            </View>
          ) : (
            <>
              {/* ACTION BUTTON */}
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={activeTab === 'Lab' ? 'Create Lab' : 'Add Staff'}
                  fontfamily={'Poppins-SemiBold'}
                  textColor={COLORS.PRIMARY} // DESIGN: Use color constant
                  borderWidth={1}
                  borderRadius={20}
                  borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
                  height={hp(5.5)}
                  width={wp(35)}
                  fontSize={hp(1.8)}
                  onPress={
                    activeTab === 'Lab' ? handleCreateLab : handleCreateStaff
                  }
                />
              </View>

              {/* TABS */}
              <View>
                <TopTabs
                  data={[
                    {id: 1, title: 'Lab'},
                    {id: 2, title: 'Staff'},
                    {id: 3, title: 'Blocked'},
                  ]}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  borderRadius={8}
                />
              </View>

              {/* TAB CONTENT */}
              <View style={styles.tabContent}>{renderComponent()}</View>
            </>
          )}

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
  content: {
    padding: 15,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  tabContent: {
    marginTop: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: hp(40),
  },
  errorContainer: {
    padding: 15,
  },
});
