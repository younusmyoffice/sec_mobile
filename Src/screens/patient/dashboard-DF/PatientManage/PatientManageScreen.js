/**
 * ============================================================================
 * PATIENT MANAGE SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for patients to manage bookings, transactions, and reports.
 * 
 * FEATURES:
 * - Tabbed interface (Booking History, Transaction Details, Report)
 * - Infinite scroll for booking history
 * - Data fetching and caching
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Uses userId from CommonContext (preferred over AsyncStorage)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - TopTabs: Tab navigation
 * - Header: App header
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module PatientManageScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../../components/customComponents/Header/Header';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import BookingHistoryComponent from './BookingHistoryComponent';
import TransactionDetailsComponent from './TransactionDetailsComponent';
import ReportComponent from './ReportComponent';
import SubscriptionComponent from './SubscriptionComponent';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function PatientManageScreen() {
  const {userId} = useCommon();
  const [activeTab, setActiveTab] = useState('Booking History');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingLength, setbookingLength] = useState(0);

  /**
   * Handle scroll end for infinite scroll
   * @param {object} nativeEvent - Scroll event
   */
  const handleScrollEnd = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !isLoading) {
      Logger.debug('Scroll reached bottom, loading more booking history');
      fetchBookinHistory();
    }
  };

  /**
   * Fetch booking history
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchBookinHistory = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for booking history', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    try {
      setIsLoading(true);
      Logger.api('GET', `patient/appointmentHistory/${userId}`, {
        page: 1,
        limit: 10,
      });
      
      const response = await axiosInstance.get(
        `patient/appointmentHistory/${userId}`,
        {
          params: {
            page: 1,
            limit: 10,
          },
        },
      );
      
      Logger.debug('Booking history response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const bookingData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];
      
      setBookingHistory(bookingData);
      setbookingLength(bookingData.length);
      
      Logger.info('Booking history fetched successfully', {
        count: bookingData.length,
      });
    } catch (error) {
      Logger.error('Error fetching booking history', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch booking history. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setBookingHistory([]);
      setbookingLength(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch transaction history
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchTransHistory = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for transaction history', { userId });
      return;
    }

    try {
      Logger.api('GET', `patient/transaction/${userId}`, {
        page: 1,
        limit: 10,
      });
      
      const response = await axiosInstance.get(`patient/transaction/${userId}`, {
        params: {
          page: 1,
          limit: 10,
        },
      });
      
      Logger.debug('Transaction history response', {
        count: response?.data?.response?.length || 0,
      });

      // SECURITY: Validate response data type
      const transactionData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];
      
      setTransactionHistory(transactionData);
      
      Logger.info('Transaction history fetched successfully', {
        count: transactionData.length,
      });
    } catch (error) {
      Logger.error('Error fetching transaction history', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch transaction history. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setTransactionHistory([]);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('PatientManageScreen initialized', { userId });
      fetchBookinHistory();
      fetchTransHistory();
    } else {
      Logger.warn('PatientManageScreen: userId not available');
    }
  }, [userId]);

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Booking History':
        Logger.debug('Rendering BookingHistoryComponent');
        return (
          <BookingHistoryComponent
            data={bookingHistory}
            handleScrollEnd={handleScrollEnd}
            isLoading={isLoading}
            length={bookingLength}
          />
        );
      case 'Transaction Details':
        Logger.debug('Rendering TransactionDetailsComponent');
        return <TransactionDetailsComponent data={transactionHistory} />;
      case 'Report':
        Logger.debug('Rendering ReportComponent');
        return <ReportComponent length={bookingLength} />;
      // case 'Subscription':
      //   return <SubscriptionComponent />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View>
          <Header
            logo={require('../../../../assets/images/ShareecareHeaderLogo.png')}
            locationIcon={false}
            showLocationMark={false}
            notificationUserIcon={true}
          />
        </View>

        <View style={styles.tabsContainer}>
          <TopTabs
            bordercolor={COLORS.BG_WHITE}
            data={[
              {title: 'Booking History'},
              {title: 'Transaction Details'},
              {title: 'Report'},
              // {title: 'Subscription'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              Logger.debug('Tab changed', { from: activeTab, to: tab });
              setActiveTab(tab);
            }}
            funcstatus={false}
          />
        </View>
        
        <View style={styles.contentContainer}>
          {renderComponent()}
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
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
