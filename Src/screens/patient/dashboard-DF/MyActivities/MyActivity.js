/**
 * ============================================================================
 * MY ACTIVITY COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display patient appointments and reports (received/shared) in a tabbed interface.
 * 
 * FEATURES:
 * - Display appointments list with status
 * - Tabbed interface for Received and Shared reports
 * - Expandable sections with "View All" functionality
 * - Loading states for appointments
 * 
 * SECURITY:
 * - No direct API calls (data received via props from parent)
 * - Uses userId from CommonContext (no AsyncStorage needed)
 * - Parent component handles authentication and API calls
 * 
 * ERROR HANDLING:
 * - Safe array operations with optional chaining
 * - Empty state handling in child components
 * 
 * REUSABLE COMPONENTS:
 * - AppointmentCard: Display appointment details
 * - RecievedSharedReportsCard: Display reports
 * - InAppHeader: Section headers with expand/collapse
 * - TopTabs: Tab navigation
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance in parent component
 * - Reusable throughout application via axiosInstance
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module MyActivity
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import AppointmentCard from '../../../../components/customCards/appiontmentCard/CustomAppointmentCard';
import RecievedSharedReportsCard from '../../../../components/customCards/recieved&SharedReportCard/RecievedSharedReportsCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {useCommon} from '../../../../Store/CommonContext';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function MyActivity({
  isLoading,
  allAppointments,
  showFull,
  setShowFull,
}) {
  const {sharedReports, recievedReports, userId} = useCommon();
  const [activeTab, setActiveTab] = useState('Recieved');
  const [showFullReports, setShowFullReports] = useState(false);

  /**
   * Calculate displayed reports based on showFullReports toggle
   * SECURITY: Safe array slicing with null checks
   */
  const allReceived = React.useMemo(() => {
    if (!recievedReports || !Array.isArray(recievedReports)) {
      return [];
    }
    return showFullReports ? recievedReports : recievedReports.slice(0, 2);
  }, [recievedReports, showFullReports]);

  const allShared = React.useMemo(() => {
    if (!sharedReports || !Array.isArray(sharedReports)) {
      return [];
    }
    return showFullReports ? sharedReports : sharedReports.slice(0, 2);
  }, [sharedReports, showFullReports]);

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'Recieved':
        Logger.debug('Rendering Received reports', { count: allReceived.length });
        return <RecievedSharedReportsCard data={allReceived} />;

      case 'Shared':
        Logger.debug('Rendering Shared reports', { count: allShared.length });
        return <RecievedSharedReportsCard data={allShared} />;

      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  useEffect(() => {
    Logger.debug('MyActivity initialized', {
      userId: userId || 'not available',
      appointmentsCount: allAppointments?.length || 0,
      receivedCount: recievedReports?.length || 0,
      sharedCount: sharedReports?.length || 0,
    });
  }, [userId, allAppointments, recievedReports, sharedReports]);

  // Log data structure for debugging (only in development)
  useEffect(() => {
    if (__DEV__) {
      Logger.debug('MyActivity Data Debug', {
        receivedReports: recievedReports?.length || 0,
        sharedReports: sharedReports?.length || 0,
        activeTab,
        allReceived: allReceived?.length || 0,
        allShared: allShared?.length || 0,
      });

      if (sharedReports && sharedReports.length > 0) {
        Logger.debug('Shared Reports Sample', {
          keys: Object.keys(sharedReports[0]),
          sample: sharedReports[0],
        });
      }
    }
  }, [recievedReports, sharedReports, activeTab, allReceived, allShared]);

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        {/* Appointments Section */}
        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <InAppHeader
              LftHdr={'Appointments'}
              textbtn={true}
              textBtnText={'View All'}
              showReviewHideReview={showFull}
              showLess={'Show Less'}
              onClick={() => setShowFull(!showFull)}
            />
          </View>
          
          <View style={styles.appointmentsContainer}>
            {allAppointments && Array.isArray(allAppointments) && allAppointments.length > 0 ? (
              allAppointments.map((item, i) => {
                // SECURITY: Validate item data before rendering
                if (!item || !item.id) {
                  Logger.warn('Invalid appointment item', { index: i });
                  return null;
                }

                // SECURITY: Safe string operations
                const status = item.status
                  ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                  : 'Unknown';
                
                const appointmentDate = item.appointment_date
                  ? item.appointment_date.split('T')[0]
                  : 'N/A';

                return (
                  <AppointmentCard
                    btnStatus={status}
                    key={item.id || i}
                    firstname={item.first_name || ''}
                    middlename={item.middle_name || ''}
                    lastname={item.last_name || ''}
                    date={appointmentDate}
                    planname={item.plan_name || 'N/A'}
                    reportname={item.attachments || null}
                    loading={isLoading}
                    profile_picture={item?.profile_picture}
                  />
                );
              })
            ) : (
              // Empty state for appointments - handled by AppointmentCard component
              null
            )}
          </View>
        </View>

        {/* Reports Section */}
        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <InAppHeader
              LftHdr={'Reports'}
              textbtn={true}
              textBtnText={'View All'}
              showReviewHideReview={showFullReports}
              showLess={'Show Less'}
              onClick={() => {
                Logger.debug('Toggle showFullReports', { 
                  current: showFullReports,
                  new: !showFullReports 
                });
                setShowFullReports(!showFullReports);
              }}
            />
          </View>
          
          <TopTabs
            borderwidth={1}
            data={[{title: 'Recieved'}, {title: 'Shared'}]}
            bordercolor={COLORS.BG_WHITE}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              Logger.debug('Tab changed', { from: activeTab, to: tab });
              setActiveTab(tab);
            }}
          />

          <View style={styles.reportsContainer}>
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
  },
  section: {
    marginTop: '5%',
  },
  headerContainer: {
    paddingHorizontal: 15,
  },
  appointmentsContainer: {
    gap: 10,
    paddingHorizontal: 10,
  },
  reportsContainer: {
    // Reports container styling
  },
});
