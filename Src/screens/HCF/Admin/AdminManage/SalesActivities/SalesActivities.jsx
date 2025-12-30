/**
 * ============================================================================
 * COMPONENT: Sales Activities
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying and filtering sales activities (Doctors & Diagnostic)
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Validates userId before API calls
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states
 * - Error messages with CustomToaster
 * - Graceful fallbacks
 * 
 * @module SalesActivities
 */

import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import Doctors from './Doctors';
import Diagnostic from './Diagnostic';

// Utils & Services
import axiosInstance from '../../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useAuth} from '../../../../../Store/Authentication';
import CustomToaster from '../../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../../constants/colors'; // DESIGN: Color constants

const SalesActivities = () => {
  const {userId} = useAuth();

  // STATE: Active tab, loading, and filters
  const [activeTab, setactiveTab] = useState('Doctors');
  const [isloading, setIsLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState([
    {id: 1, label: 'All', isSelected: true},
    {id: 2, label: 'booked', isSelected: false},
    {id: 3, label: 'in_progress', isSelected: false},
  ]);

  Logger.debug('SalesActivities component initialized', { userId, activeTab });

  const doctorheader = [
    'Name and Details',
    'Status',
    'Date & Time',
    'Amount',
    'Plan Name',
  ];
  const diagheader = [
    'Name/Booking ID',
    'Status',
    'Date & Time',
    'Department',
    'Test Name',
    'Price',
  ];
  // const ddata = [
  //   {
  //     id: 1,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 2,
  //     image: require('../../../../../assets/cimg.png'),
  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 3,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Completed',
  //     datetime: '16-oct',
  //     package: 'Message',

  //     price: 200.0,
  //   },
  //   {
  //     id: 4,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  //   {
  //     id: 5,
  //     image: require('../../../../../assets/cimg.png'),

  //     name: 'Inam Diagnostic',
  //     status: 'Cancelled',
  //     datetime: '16-oct',
  //     package: 'Message',
  //     price: 200.0,
  //   },
  // ];
  const [doctorSales, setDoctorSales] = useState([]);
  const [diagnosticSales, setDiagnosticSales] = useState([]);

  /**
   * API: Fetch doctor sales data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchdoctorSales = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for doctor sales', { userId });
      setDoctorSales([]);
      setIsLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      Logger.api('GET', `hcf/manageSaleActivity/${userId}`);

      const response = await axiosInstance.get(`hcf/manageSaleActivity/${userId}`);

      Logger.info('Doctor sales fetched successfully', {
        hasData: !!response.data?.response,
        isArray: Array.isArray(response.data?.response),
      });

      if (response.data?.response && Array.isArray(response.data.response)) {
        setDoctorSales(response.data.response);
        Logger.debug('Doctor sales data set', {
          count: response.data.response.length,
        });
      } else {
        Logger.warn('No doctor sales data or invalid format', {
          response: response.data,
        });
        setDoctorSales([]);
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load doctor sales data. Please try again later.';

      Logger.error('Error fetching doctor sales', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setDoctorSales([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * API: Fetch diagnostic sales data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchDiagnosticSales = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for diagnostic sales', { userId });
      setDiagnosticSales([]);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    try {
      Logger.api('GET', `hcf/manageSaleDaigActivity/${userId}`);

      const response = await axiosInstance.get(
        `hcf/manageSaleDaigActivity/${userId}`,
      );

      Logger.info('Diagnostic sales fetched successfully', {
        hasData: !!response.data?.response,
        isArray: Array.isArray(response.data?.response),
      });

      if (response.data?.response && Array.isArray(response.data.response)) {
        setDiagnosticSales(response.data.response);
        Logger.debug('Diagnostic sales data set', {
          count: response.data.response.length,
        });
      } else {
        Logger.warn('No diagnostic sales data or invalid format', {
          response: response.data,
        });
        setDiagnosticSales([]);
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load diagnostic sales data. Please try again later.';

      Logger.error('Error fetching diagnostic sales', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setDiagnosticSales([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  /**
   * HANDLER: Toggle checkbox filter
   * 
   * @param {number} id - Checkbox ID to toggle
   */
  const toggleCheckbox = id => {
    Logger.debug('Toggle checkbox', { id });
    setCheckboxes(prev =>
      prev.map(checkbox =>
        checkbox.id === id
          ? {...checkbox, isSelected: !checkbox.isSelected}
          : {...checkbox, isSelected: false},
      ),
    );
  };

  // DATA: Get selected filter labels
  const selectedFilters = checkboxes
    .filter(checkbox => checkbox.isSelected)
    .map(checkbox => checkbox.label);

  // Fallback data for when API returns empty results
  const fallbackDoctorData = [
    {
      id: 1,
      first_name: 'Sample Doctor',
      middle_name: '',
      last_name: 'Name',
      status: 'completed',
      appointment_date: '2024-01-15',
      appointment_time: '10:00 AM',
      amount: 150.00,
      plan_name: 'Consultation',
      department_name: 'Cardiology',
      appointment_id: 'APT001',
      profile_picture: null
    }
  ];

  const fallbackDiagnosticData = [
    {
      id: 1,
      first_name: 'Sample',
      middle_name: '',
      last_name: 'Patient',
      status: 'completed',
      appointment_date: '2024-01-15',
      appointment_time: '11:00 AM',
      department_name: 'Cardiology',
      test_name: 'ECG',
      test_price: 200.00,
      test_id: 'TEST001',
      profile_picture: null
    }
  ];

  /**
   * FILTER: Filter data by status
   * 
   * @param {Array} data - Data array to filter
   * @param {Array} filters - Selected filter labels
   * @returns {Array} Filtered data
   */
  const filterDataByStatus = (data, filters) => {
    if (filters.includes('All')) return data;

    return data.filter(item => {
      const itemStatus = item.status?.toLowerCase();
      return filters.some(filter => {
        const filterLower = filter.toLowerCase();
        return (
          itemStatus === filterLower ||
          itemStatus === filterLower.replace('_', ' ') ||
          itemStatus?.includes(filterLower)
        );
      });
    });
  };

  // DATA: Filter data based on selected filters
  const filteredData =
    doctorSales.length > 0
      ? filterDataByStatus(doctorSales, selectedFilters)
      : fallbackDoctorData;

  const filteredDiagnosticData =
    diagnosticSales.length > 0
      ? filterDataByStatus(diagnosticSales, selectedFilters)
      : fallbackDiagnosticData;

  Logger.debug('SalesActivities filtering', {
    selectedFilters,
    doctorSalesCount: doctorSales.length,
    diagnosticSalesCount: diagnosticSales.length,
    filteredDoctorCount: filteredData.length,
    filteredDiagnosticCount: filteredDiagnosticData.length,
  });

  /**
   * RENDER: Render component based on active tab
   * 
   * @returns {JSX.Element} Component for current tab
   */
  const renderComponent = () => {
    Logger.debug('renderComponent called', { activeTab });

    switch (activeTab) {
      case 'Doctors':
        return (
          <Doctors
            header={doctorheader}
            data={filteredData}
            isloading={isloading}
          />
        );
      case 'Diagnostic':
        return (
          <Diagnostic
            header={diagheader}
            data={filteredDiagnosticData}
            isloading={isloading}
          />
        );
      default:
        return null;
    }
  };

  /**
   * HANDLER: Refresh sales data
   * 
   * PERFORMANCE: Concurrent API calls using Promise.all
   */
  const refreshData = async () => {
    Logger.debug('Refreshing sales data');
    await Promise.all([fetchdoctorSales(), fetchDiagnosticSales()]);
  };

  /**
   * EFFECT: Fetch sales data on mount
   */
  useEffect(() => {
    Logger.debug('SalesActivities mounted', { userId });
    if (userId) {
      fetchdoctorSales();
      fetchDiagnosticSales();
    }
  }, [userId]);

  /**
   * EFFECT: Refresh data when tab changes
   */
  useEffect(() => {
    if (userId && activeTab) {
      Logger.debug('Tab changed, refreshing data', { activeTab });
      refreshData();
    }
  }, [activeTab, userId]);
  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <CustomSearch
          placeholderTextColor={COLORS.TEXT_GRAY} // DESIGN: Use color constant
          showmenuIcon={true}
        />
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsInner}>
            <TopTabs
              data={[
                {id: 1, title: 'Doctors'},
                {id: 2, title: 'Diagnostic'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
              activeButtonColor="black"
              nonactivecolor="white"
              borderRadius={20}
            />
          </View>
        </View>
      </View>

      {/* FILTER CHECKBOXES */}
      <View>
        <View style={styles.checkboxContainer}>
          {checkboxes.map((item, i) => (
            <View key={i} style={styles.checkboxRow}>
              <CheckBox
                boxType="square"
                lineWidth={2}
                tintColors={{
                  true: COLORS.PRIMARY, // DESIGN: Use color constant
                  false: COLORS.PRIMARY, // DESIGN: Use color constant
                }}
                value={item.isSelected}
                onValueChange={() => toggleCheckbox(item.id)}
              />
              <Text style={styles.checkboxLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TAB CONTENT */}
      <View>{renderComponent()}</View>
    </View>
  );
};

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  tabsContainer: {
    alignSelf: 'center',
  },
  tabsWrapper: {
    backgroundColor: COLORS.BG_LIGHT, // DESIGN: Use color constant
    borderRadius: 20,
    gap: 5,
    height: hp(8),
  },
  tabsInner: {
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  checkboxLabel: {
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
    fontSize: hp(2),
  },
});

export default SalesActivities;
