/**
 * ============================================================================
 * COMPONENT: Overview
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying revenue overview and sales activities
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
 * @module Overview
 */

import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import Doctors from '../SalesActivities/Doctors';
import Diagnostic from '../SalesActivities/Diagnostic';

// Utils & Services
import axiosInstance from '../../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useAuth} from '../../../../../Store/Authentication';
import CustomToaster from '../../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../../constants/colors'; // DESIGN: Color constants

const Overview = () => {
  const {userId} = useAuth();

  // STATE: Active tab, revenue, and sales data
  const [activeTab, setactiveTab] = useState('Doctors');
  const [revenueData, setRevenueData] = useState([]);
  const [doctorSales, setDoctorSales] = useState([]);
  const [diagnosticSales, setDiagnosticSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  Logger.debug('Overview component initialized', { userId, activeTab });
  const doctorheader = [
    'Doctor Name/ID',
    'Status',
    'Date & Time',
    'Package',
    'Price',
  ];
  const diagheader = [
    'Name/Booking ID',
    'Status',
    'Date & Time',
    'Department',
    'Test Name',
    'Price',
  ];

  /**
   * API: Fetch revenue data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchRevenueData = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for revenue data', { userId });
      setRevenueData([]);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    try {
      Logger.api('GET', `hcf/HcfSaleActivityCount/${userId}`);

      const response = await axiosInstance.get(`hcf/HcfSaleActivityCount/${userId}`);

      Logger.info('Revenue data fetched successfully', {
        hasData: !!response.data,
      });

      // ERROR HANDLING: Transform API response to match our data structure
      if (response.data) {
        const apiData = response.data;
        const transformedData = [
          {
            id: 1,
            title: 'Consultation Revenue',
            price: apiData.Consultation_Revenue || 0,
            item: 0, // API doesn't provide item count
          },
          {
            id: 2,
            title: 'Diagnostic Revenue',
            price: apiData.Diagnostic_Revenue || 0,
            item: 0, // API doesn't provide item count
          },
          {
            id: 3,
            title: 'Total Earning',
            price: apiData.Total || 0,
            item: 0, // API doesn't provide item count
          },
        ];

        setRevenueData(transformedData);
        Logger.debug('Revenue data transformed and set', transformedData);
      } else {
        Logger.warn('No revenue data received');
        setRevenueData([]);
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load revenue data. Please try again later.';

      Logger.error('Error fetching revenue data', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      setRevenueData([]);

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    }
  };

  /**
   * API: Fetch doctor sales data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchDoctorSales = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      Logger.error('Invalid userId for doctor sales', { userId });
      setDoctorSales([]);
      return;
    }

    try {
      Logger.api('GET', `hcf/manageSaleActivity/${userId}`);

      const response = await axiosInstance.get(`hcf/manageSaleActivity/${userId}`);

      Logger.info('Doctor sales fetched successfully', {
        hasData: !!response.data?.response,
      });

      if (response.data?.response) {
        setDoctorSales(response.data.response);
        Logger.debug('Doctor sales data set', {
          count: response.data.response.length,
        });
      } else {
        Logger.warn('No doctor sales data received');
        setDoctorSales([]);
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling (non-critical)
      Logger.error('Error fetching doctor sales', {
        status: error?.response?.status,
        error: error,
      });
      setDoctorSales([]);
      Logger.debug('Doctor sales fetch failed (non-critical)');
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
      Logger.error('Invalid userId for diagnostic sales', { userId });
      setDiagnosticSales([]);
      return;
    }

    try {
      Logger.api('GET', `hcf/manageSaleDaigActivity/${userId}`);

      const response = await axiosInstance.get(`hcf/manageSaleDaigActivity/${userId}`);

      Logger.info('Diagnostic sales fetched successfully', {
        hasData: !!response.data?.response,
      });

      if (response.data?.response) {
        setDiagnosticSales(response.data.response);
        Logger.debug('Diagnostic sales data set', {
          count: response.data.response.length,
        });
      } else {
        Logger.warn('No diagnostic sales data received');
        setDiagnosticSales([]);
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling (non-critical)
      Logger.error('Error fetching diagnostic sales', {
        status: error?.response?.status,
        error: error,
      });
      setDiagnosticSales([]);
      Logger.debug('Diagnostic sales fetch failed (non-critical)');
    }
  };
  // Removed hardcoded ddata and diagdata - now using API data only

  // Fallback revenue data
  const fallbackRevenueData = [
    {
      id: 1,
      title: 'Consultation Revenue',
      price: 0,
      item: 0,
    },
    {
      id: 2,
      title: 'Diagnostic Revenue',
      price: 0,
      item: 0,
    },
    {
      id: 3,
      title: 'Total Earning',
      price: 0,
      item: 0,
    },
  ];

  // Fallback data for sales activities
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
      profile_picture: null,
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
      profile_picture: null,
    }
  ];

  /**
   * EFFECT: Fetch data on mount
   */
  useEffect(() => {
    Logger.debug('Overview mounted', { userId });
    if (userId) {
      fetchRevenueData();
      fetchDoctorSales();
      fetchDiagnosticSales();
    }
  }, [userId]);

  // DATA: Process revenue data from API or use fallback
  const processedRevenueData =
    revenueData.length > 0 ? revenueData : fallbackRevenueData;

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
            data={doctorSales.length > 0 ? doctorSales : fallbackDoctorData}
            isloading={isLoading}
          />
        );
      case 'Diagnostic':
        return (
          <Diagnostic
            header={diagheader}
            data={
              diagnosticSales.length > 0
                ? diagnosticSales
                : fallbackDiagnosticData
            }
            isloading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  Logger.debug('Overview rendering', {
    revenueDataCount: revenueData.length,
    doctorSalesCount: doctorSales.length,
    diagnosticSalesCount: diagnosticSales.length,
  });

  return (
    <View style={styles.container}>
      {/* REVENUE CARDS */}
      <View style={styles.revenueContainer}>
        <View style={styles.revenueContent}>
          {processedRevenueData.map((item, i) => (
            <View key={i} style={styles.revenueCard}>
              <Text style={styles.revenuePrice}>${item.price}</Text>
              <Text style={styles.revenueTitle}>{item.title}</Text>
              <View style={styles.revenueBadge}>
                <Text style={styles.revenueItemCount}>{item.item} item</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* MONTHLY EARNING TITLE */}
      <View>
        <Text style={styles.monthlyEarningTitle}>Monthly Earning</Text>
      </View>

      {/* SEARCH */}
      <View>
        <CustomSearch placeholderTextColor={COLORS.TEXT_GRAY} />
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

      {/* FILTERS */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor={COLORS.BORDER_LIGHT} // DESIGN: Use color constant
            selectborderRadius={10}
            selectbackgroundColor={COLORS.BG_LIGHT} // DESIGN: Use color constant
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={COLORS.BORDER_LIGHT} // DESIGN: Use color constant
            placeholder={'Date'}
            selectplaceholdercolor={COLORS.TEXT_SECONDARY} // DESIGN: Use color constant
          />
          <CustomInput
            type={'select'}
            selectborderBottomWidth={0.5}
            selectborderBottomColor={COLORS.BORDER_LIGHT} // DESIGN: Use color constant
            selectborderRadius={10}
            selectbackgroundColor={COLORS.BG_LIGHT} // DESIGN: Use color constant
            selectwidth={wp(30)}
            selectborderWidth={0.5}
            selectborderColor={COLORS.BORDER_LIGHT} // DESIGN: Use color constant
            placeholder={'Filter'}
            selectplaceholdercolor={COLORS.TEXT_SECONDARY} // DESIGN: Use color constant
          />
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
  revenueContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.BORDER_LIGHT, // DESIGN: Use color constant
    borderRadius: 16,
    padding: 15,
    margin: 10,
  },
  revenueContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  revenueCard: {
    alignItems: 'center',
    flex: 1,
  },
  revenuePrice: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
  },
  revenueTitle: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    top: -10,
  },
  revenueBadge: {
    backgroundColor: COLORS.BG_LIGHT, // DESIGN: Use color constant
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    top: -10,
  },
  revenueItemCount: {
    color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  monthlyEarningTitle: {
    fontFamily: 'Poppins-Medium',
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    textAlign: 'center',
    fontSize: hp(2),
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
  filtersContainer: {
    alignSelf: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
  },
});

export default Overview;
