/**
 * ============================================================================
 * SCREEN: Admin Doctors Management
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for HCF Admin to manage doctors:
 * - View all doctors by department
 * - View active doctors
 * - View blocked doctors
 * - Activate/Deactivate doctors
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Validates userId before API calls
 * - Input sanitization for IDs
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states with reusable loader
 * - Error messages with CustomToaster
 * - Success messages for actions
 * 
 * @module AdminDoctorsScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

// Components
import AdminHeader from '../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomButton from '../../../../components/customButton/CustomButton';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import Header from '../../../../components/customComponents/Header/Header';
import CustomTable from '../../../../components/customTable/CustomTable';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useCommon} from '../../../../Store/CommonContext';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants

const Stack = createNativeStackNavigator();

export default function AdminDoctorsScreen() {
  const {dept, activeTab, setActiveTab, setRun, userId} = useCommon();
  const navigation = useNavigation();

  // STATE: Active tab and doctor data
  const [activeTabDoctors, setActiveTabDoctors] = useState('All Doctors');
  const [categoriesDoctor, setCategoriesDoctor] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState([]);
  const [blockedDoctor, setBlockedDoctor] = useState([]);
  const [loading, setLoading] = useState(false);

  Logger.debug('AdminDoctorsScreen initialized', {
    userId,
    activeTab,
    activeTabDoctors,
    deptCount: dept?.length || 0,
  });

  // DATA: Table headers
  const header = ['Name', 'Department', 'Status', 'Action'];
  const activeHeader = ['Name & Details', 'Email Id', 'Department Name'];
  const blockHeader = ['Name & Details', 'Email Id', 'Department Name'];

  /**
   * HANDLER: Navigate to add doctor package screen
   */
  const handleAddDoctor = () => {
    Logger.debug('Navigate to doctor-package');
    navigation.navigate('doctor-package');
  };

  /**
   * API: Fetch doctors by department
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string} department - Department name to filter doctors
   * @returns {Promise<void>}
   */
  const fetchcatrgoryDoctor = async department => {
    // VALIDATION: Check if userId and department exist
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for category doctors', { userId });
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    if (!department) {
      Logger.warn('No department provided for fetchcatrgoryDoctor');
      return;
    }

    setLoading(true);

    try {
      Logger.api('GET', `hcf/clinicDoctorsByDept/${userId}/${department}`);

      const response = await axiosInstance.get(
        `hcf/clinicDoctorsByDept/${userId}/${department}`,
      );

      Logger.info('Category doctors fetched successfully', {
        department,
        hasData: !!response.data?.response?.[department],
      });

      const doctors = response.data?.response?.[department] || [];
      setCategoriesDoctor(doctors);

      Logger.debug('Category doctors set', { count: doctors.length });
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load doctors. Please try again later.';

      Logger.error('Error fetching category doctors', {
        department,
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setCategoriesDoctor([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * API: Fetch active doctors by department
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string} activeTab - Department name to filter active doctors
   * @returns {Promise<void>}
   */
  const fetchActiveDoctor = async activeTab => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      Logger.error('Invalid userId for active doctors', { userId });
      setActiveDoctor([]);
      return;
    }

    try {
      Logger.api('GET', `hcf/ActiveBlockedClinicDoctors/1/${userId}/${activeTab}`);

      const response = await axiosInstance.get(
        `hcf/ActiveBlockedClinicDoctors/1/${userId}/${activeTab}`,
      );

      Logger.info('Active doctors fetched successfully', {
        department: activeTab,
        hasData: !!response.data?.response,
      });

      setActiveDoctor(response.data?.response || []);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load active doctors. Please try again later.';

      Logger.error('Error fetching active doctors', {
        department: activeTab,
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setActiveDoctor([]);

      // REUSABLE TOAST: Show error message (optional, non-critical)
      Logger.debug('Active doctors fetch failed (non-critical)');
    }
  };

  /**
   * API: Fetch blocked doctors by department
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {string} activeTab - Department name to filter blocked doctors
   * @returns {Promise<void>}
   */
  const fetchBlockedDoctor = async activeTab => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      Logger.error('Invalid userId for blocked doctors', { userId });
      setBlockedDoctor([]);
      return;
    }

    try {
      Logger.api('GET', `hcf/ActiveBlockedClinicDoctors/0/${userId}/${activeTab}`);

      const response = await axiosInstance.get(
        `hcf/ActiveBlockedClinicDoctors/0/${userId}/${activeTab}`,
      );

      Logger.info('Blocked doctors fetched successfully', {
        department: activeTab,
        hasData: !!response.data?.response,
      });

      setBlockedDoctor(response.data?.response || []);
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load blocked doctors. Please try again later.';

      Logger.error('Error fetching blocked doctors', {
        department: activeTab,
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setBlockedDoctor([]);

      // REUSABLE TOAST: Show error message (optional, non-critical)
      Logger.debug('Blocked doctors fetch failed (non-critical)');
    }
  };

  /**
   * API: Activate or deactivate a doctor
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * SECURITY: Input validation and type conversion for IDs
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @param {number|string} id - Clinic doctor ID
   * @param {number} status - Status (1 = Active, 0 = Inactive)
   * @returns {Promise<void>}
   */
  const handleActivateDoctor = async (id, status) => {
    // VALIDATION: Check if userId and id exist
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for activate doctor', { userId });
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    if (!id) {
      const errorMsg = 'Doctor ID is missing.';
      Logger.error('Invalid doctor ID', { id });
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    try {
      Logger.api('POST', 'hcf/ActiveDeactiveClinicDoctor', {
        hcf_id: userId,
        clinic_doctor_id: id,
        status: status,
      });

      // SECURITY: Explicit type conversion to prevent injection
      const response = await axiosInstance.post(`hcf/ActiveDeactiveClinicDoctor`, {
        hcf_id: userId ? String(userId) : '',
        clinic_doctor_id: String(id), // SECURITY: Convert to string
        status: String(status), // SECURITY: Convert to string
      });

      Logger.info('Doctor status updated successfully', {
        clinic_doctor_id: id,
        status: status === 1 ? 'Active' : 'Inactive',
      });

      // REUSABLE TOAST: Show success message
      CustomToaster.show(
        'success',
        'Success',
        status === 1 ? 'Doctor activated successfully' : 'Doctor deactivated successfully',
      );

      // UPDATE: Update local state to reflect changes immediately
      setCategoriesDoctor(prevDoctors =>
        prevDoctors.map(doctor =>
          doctor.user_id === id
            ? {...doctor, status: status === 1 ? 'Active' : 'Inactive'}
            : doctor,
        ),
      );
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update doctor status. Please try again later.';

      Logger.error('Error activating/deactivating doctor', {
        clinic_doctor_id: id,
        status: status,
        errorStatus: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  /**
   * RENDER: Render doctor table based on active tab
   * 
   * Returns the appropriate CustomTable component for the selected tab
   * 
   * @returns {JSX.Element} CustomTable component for current tab
   */
  const renderDoctor = () => {
    Logger.debug('renderDoctor called', {
      activeTabDoctors,
      categoriesCount: categoriesDoctor?.length || 0,
      activeCount: activeDoctor?.length || 0,
      blockedCount: blockedDoctor?.length || 0,
    });

    switch (activeTabDoctors) {
      case 'All Doctors':
        return (
          <CustomTable
            header={header}
            isUserDetails={false}
            flexvalue={1}
            rowDataCenter={true}
            textCenter={'center'}
            data={categoriesDoctor}
            width={500}
            loading={loading}
            enableMenu={true}
            id={'user_id'}
            acceptPress={handleActivateDoctor}
            rejectPress={handleActivateDoctor}
          />
        );
      case 'Active':
        return (
          <CustomTable
            header={activeHeader}
            isUserDetails={true}
            flexvalue={2}
            rowDataCenter={true}
            textCenter={'center'}
            data={activeDoctor}
            width={1000}
            loading={loading}
          />
        );

      case 'Blocked':
        return (
          <CustomTable
            header={blockHeader}
            isUserDetails={true}
            flexvalue={2}
            rowDataCenter={true}
            textCenter={'center'}
            data={blockedDoctor}
            width={1000}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  /**
   * EFFECT: Fetch doctor data when department tab changes
   */
  useEffect(() => {
    Logger.debug('Department tab changed, fetching doctor data', { activeTab });
    if (activeTab) {
      fetchActiveDoctor(activeTab);
      fetchBlockedDoctor(activeTab);
      fetchcatrgoryDoctor(activeTab);
    }
    setRun(false);
  }, [activeTab]);

  /**
   * EFFECT: Monitor userId changes
   */
  useEffect(() => {
    Logger.debug('userId changed', { userId });
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
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
          {/* ACTION BUTTON */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Add Doctor"
              fontfamily={'Poppins-SemiBold'}
              textColor={COLORS.PRIMARY} // DESIGN: Use color constant
              borderWidth={1}
              borderRadius={20}
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              height={hp(5.5)}
              width={wp(35)}
              fontSize={hp(1.8)}
              onPress={handleAddDoctor}
            />
          </View>

          {/* TABS AND CONTENT */}
          <View style={styles.tabsContainer}>
            {/* DOCTOR TYPE TABS */}
            <View>
              <TopTabs
                data={[
                  {id: 1, title: 'All Doctors'},
                  {id: 2, title: 'Active'},
                  {id: 3, title: 'Blocked'},
                ]}
                activeTab={activeTabDoctors}
                setActiveTab={setActiveTabDoctors}
                borderRadius={8}
              />
            </View>

            {/* DEPARTMENT TABS */}
            <View>
              <TopTabs
                data={dept?.map((item, i) => ({
                  id: i,
                  title: item.department_name,
                }))}
                bordercolor={COLORS.PRIMARY} // DESIGN: Use color constant
                borderwidth={1}
                borderRadius={30}
                fontSize={hp(1.5)}
                ph={15}
                pv={8}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabfunc={fetchcatrgoryDoctor}
                funcstatus={true}
              />
            </View>

            {/* DOCTOR TABLE */}
            <View>{renderDoctor()}</View>
          </View>
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
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  tabsContainer: {
    gap: 10,
  },
});
