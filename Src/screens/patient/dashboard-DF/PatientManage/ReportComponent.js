/**
 * ============================================================================
 * REPORT COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Component to display and manage patient reports with tabs for All Files,
 * Examine, Received, and Shared reports.
 * 
 * FEATURES:
 * - Tabbed interface (All Files, Examine, Received, Shared)
 * - Infinite scroll with pagination
 * - File download functionality
 * - Different table headers per report type
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Uses userId from CommonContext (preferred over AsyncStorage)
 * - File download permission checks (Android)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * - Loading states with CustomLoader
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - CustomTable: Table display component
 * - TopTabs: Tab navigation
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * PERFORMANCE:
 * - Pagination for large datasets
 * - Infinite scroll with loading states
 * 
 * @module ReportComponent
 */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import CustomTable from '../../../../components/customTable/CustomTable';
import axiosInstance from '../../../../utils/axiosInstance';
import RNFS from 'react-native-fs';
import {useCommon} from '../../../../Store/CommonContext';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function ReportComponent({length}) {
  const {
    sharedReports,
    recievedReports,
    setPageReceivedReports,
    setPageSharedReports,
    pageReceivedReports,
    pageSharedReports,
  } = useCommon();
  
  const [reportsState, setReportState] = useState('All Files');
  const {userId} = useCommon();
  const [pageAllReports, setPageAllReports] = useState(1);
  const [pageExamineReports, setPageExamineReports] = useState(1);
  const [limit] = useState(5);
  const [allReports, setAllReports] = useState([]);
  const [examineReports, setExamineReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle scroll end for infinite scroll pagination
   * PERFORMANCE: Increments page and fetches more data
   * @param {object} nativeEvent - Scroll event
   */
  const handleScrollEnd = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !isLoading) {
      Logger.debug('Scroll reached bottom, loading more reports', {
        reportsState,
      });

      switch (reportsState) {
        case 'All Files':
          setPageAllReports(prev => prev + 1);
          fetchAllReports();
          break;
        case 'Examine':
          setPageExamineReports(prev => prev + 1);
          fetchExamineReports();
          break;
        case 'Shared':
          setPageSharedReports(prev => prev + 1);
          // Shared reports fetched from context
          Logger.debug('Shared reports pagination', {
            page: pageSharedReports + 1,
          });
          break;
        case 'Received':
          setPageReceivedReports(prev => prev + 1);
          // Received reports fetched from context
          Logger.debug('Received reports pagination', {
            page: pageReceivedReports + 1,
          });
          break;
        default:
          Logger.warn('Unknown report type for pagination', { reportsState });
      }
    }
  };

  /**
   * Fetch all requested reports
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchAllReports = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for all reports', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    try {
      Logger.api('GET', `patient/reportsRequested/${userId}/requested`, {
        page: pageAllReports,
        limit: 8,
      });

      setIsLoading(true);

      const response = await axiosInstance.get(
        `patient/reportsRequested/${userId}/requested`,
        {
          params: {page: pageAllReports, limit: 8},
        },
      );

      Logger.debug('All reports response', {
        count: response?.data?.response?.length || 0,
        page: pageAllReports,
      });

      // SECURITY: Validate response data type
      const reportsData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];

      // Append new data for infinite scroll
      setAllReports(prevReports => [...prevReports, ...reportsData]);
      
      Logger.info('All reports fetched successfully', {
        totalCount: allReports.length + reportsData.length,
        newCount: reportsData.length,
      });
    } catch (error) {
      Logger.error('Error fetching all reports', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch reports. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch examined reports
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchExamineReports = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for examine reports', { userId });
      return;
    }

    try {
      Logger.api('GET', `patient/reportsExamine/${userId}/examine`, {
        page: pageExamineReports,
        limit: limit,
      });

      const response = await axiosInstance.get(
        `patient/reportsExamine/${userId}/examine`,
        {
          params: {
            page: pageExamineReports,
            limit: limit,
          },
        },
      );

      Logger.debug('Examine reports response', {
        count: response?.data?.response?.length || 0,
        page: pageExamineReports,
      });

      // SECURITY: Validate response data type
      const examineData = Array.isArray(response?.data?.response)
        ? response?.data?.response
        : [];

      setExamineReports(examineData);
      
      Logger.info('Examine reports fetched successfully', {
        count: examineData.length,
      });
    } catch (error) {
      Logger.error('Error fetching examine reports', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch examine reports. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
      setExamineReports([]);
    }
  };

  /**
   * Download report file
   * SECURITY: Permission checks for file access
   * ERROR HANDLING: Comprehensive error handling
   * @param {string} reportName - Name of the report file
   * @param {string} reportPath - URL path to download the file
   */
  const downloadFile = async (reportName, reportPath) => {
    Logger.debug('Download file requested', { reportName, hasPath: !!reportPath });

    // SECURITY: Validate file name and path
    if (!reportName || !reportPath) {
      Logger.warn('Invalid file download parameters', { reportName, reportPath });
      CustomToaster.show('error', 'Error', 'Invalid file information. Cannot download.');
      return;
    }

    try {
      // SECURITY: Android permission check
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Logger.warn('Storage permission denied');
          CustomToaster.show('error', 'Permission Denied', 'Storage permission is required to download the file.');
          return;
        }
      }

      const downloadDir =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.DownloadDirectoryPath;
      const filePath = `${downloadDir}/${reportName}`;

      Logger.debug('Starting file download', { filePath, reportPath });

      const downloadResult = await RNFS.downloadFile({
        fromUrl: reportPath,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        Logger.info('File downloaded successfully', { filePath });
        CustomToaster.show('success', 'Download Complete', `File saved to: ${filePath}`);
      } else {
        throw new Error(`Download failed with status code: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      Logger.error('Download error', error);
      
      const errorMessage = error?.message || 'Could not download the file. Please try again.';
      CustomToaster.show('error', 'Download Error', errorMessage);
    }
  };

  useEffect(() => {
    if (userId) {
      Logger.debug('ReportComponent initialized', { userId });
      fetchAllReports();
      fetchExamineReports();
    } else {
      Logger.warn('ReportComponent: userId not available');
    }
  }, [userId]);

  /**
   * Table headers configuration per report type
   */
  const Reqheader = [
    'Lab Name',
    'Diagnostic Name',
    'Scheduled',
    'Booked Date',
    'Booked Time',
    'Status',
    'Test Price',
    'Test Name',
    'Profile Picture',
  ];

  const Eheader = [
    'Lab Name/Booking Id',
    'Date & Time',
    'Schedule',
    'Test Name',
    'Price',
    'Profile Picture',
  ];

  const Rheader = [
    'File Name/Booking Id',
    'Lab/Booking Id',
    'Date & Time',
    'Category',
    'Profile Picture',
  ];

  const Sheader = [
    'Doctor Name',
    'Date & Time',
    'File Name',
    'Category',
    'Profile Picture',
  ];

  /**
   * Filter received reports data
   * SECURITY: Safe data mapping with validation
   */
  const filteredResponse = React.useMemo(() => {
    if (!recievedReports || !Array.isArray(recievedReports)) {
      return [];
    }
    return recievedReports.map(
      ({report_name, hcf_diag_name, book_date, book_time, report_path}) => ({
        report_name,
        hcf_diag_name,
        book_date,
        book_time,
        report_path,
      }),
    );
  }, [recievedReports]);

  /**
   * Reports data configuration per report type
   */
  const reports = {
    'All Files': allReports,
    Examine: examineReports,
    Recieved: recievedReports || [],
    Shared: sharedReports || [],
  };

  /**
   * Table headers configuration per report type
   */
  const header = {
    'All Files': Reqheader,
    Examine: Eheader,
    Recieved: Rheader,
    Shared: Sheader,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {isLoading && <CustomLoader />}
      
      <View>
        <TopTabs
          activeTab={reportsState}
          bordercolor={COLORS.BG_WHITE}
          borderwidth={1}
          data={[
            {title: 'All Files'},
            {title: 'Examine'},
            {title: 'Recieved'},
            {title: 'Shared'},
          ]}
          setActiveTab={(tab) => {
            Logger.debug('Report tab changed', { from: reportsState, to: tab });
            setReportState(tab);
          }}
          funcstatus={false}
        />
      </View>
      
      <View style={styles.tableContainer}>
        <CustomTable
          header={header[reportsState] || null}
          isUserDetails={false}
          textCenter={'center'}
          data={reports[reportsState] || null}
          flexvalue={1}
          rowDataCenter={true}
          functionKey={'report_name'}
          onpress={downloadFile}
          loadmore={handleScrollEnd}
          loading={isLoading}
          length={length}
        />
      </View>
    </SafeAreaView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_WHITE,
  },
  tableContainer: {
    marginTop: 10,
  },
});
