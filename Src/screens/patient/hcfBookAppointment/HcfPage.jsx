/**
 * ============================================================================
 * HCF PAGE
 * ============================================================================
 * 
 * PURPOSE:
 * Display detailed HCF (Health Care Facility) information with tabs for About,
 * Department, and Labs sections.
 * 
 * FEATURES:
 * - HCF profile display
 * - Tabbed interface (About, Department, Labs)
 * - Department and lab listing
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates HCF ID before API calls
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * - Loading states with SkeletonLoader
 * 
 * REUSABLE COMPONENTS:
 * - SkeletonLoader: Loading skeleton
 * - CustomToaster: Toast notifications
 * - Header: App header
 * - BookAppointmentCard: HCF card display
 * - TopTabs: Tab navigation
 * - CustomReviewCard: Review cards
 * - HcfDepartment: Department listing component
 * - LabDepartments: Lab listing component
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module HcfPage
 */

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import BookAppointmentCard from '../../../components/customCards/bookAppointment/BookAppointmentCard';
import InAppHeader from '../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomReviewCard from '../../../components/customReviewCard/CustomReviewCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import SkeletonLoader from '../../../components/customSkeleton/SkeletonLoader';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import HcfDepartment from './Hcfdepartment/HcfDepartment';
import LabDepartments from './Hcfdepartment/LabDepartments';
import CustomToaster from '../../../components/customToaster/CustomToaster';
import Logger from '../../../constants/logger';
import { COLORS } from '../../../constants/colors';

const HfcPage = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hcfData, setHcfData] = useState({
    response: {},
  });
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const routes = useRoute();
  const {data} = routes.params;

  /**
   * Fetch HCF details by ID
   * SECURITY: Validates HCF ID before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchHcfById = async () => {
    // SECURITY: Validate HCF ID before API call
    if (!data || data === 'null' || data === 'undefined') {
      Logger.error('Invalid HCF ID', { data });
      CustomToaster.show('error', 'Error', 'Invalid HCF information.');
      setLoading(false);
      return;
    }

    const suid = data.toString();
    
    try {
      setLoading(true);
      Logger.api('GET', `patient/dashboardHcfdetailsbyId/${suid}`);

      const response = await axiosInstance.get(
        `patient/dashboardHcfdetailsbyId/${suid}`,
      );

      Logger.debug('HCF details response', {
        hasResponse: !!response?.data?.response?.[0],
      });

      // SECURITY: Validate response data type
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setHcfData({
          response: response.data.response[0],
        });
        
        Logger.info('HCF details fetched successfully');
      } else {
        Logger.warn('No HCF data found');
        CustomToaster.show('warning', 'No Data', 'HCF information not found.');
      }
    } catch (error) {
      Logger.error('Error fetching HCF details', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch HCF details. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle text expansion for description
   */
  const toggleText = () => {
    setIsExpanded(!isExpanded);
    Logger.debug('Description text toggled', { isExpanded: !isExpanded });
  };

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    Logger.debug('Rendering HCF component', { activeTab });

    switch (activeTab) {
      case 'About':
        return (
          <>
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About Me</Text>
              <View style={styles.aboutTextContainer}>
                <Text style={styles.aboutText}>
                  {isExpanded ? fullText : truncateText}
                  {fullText?.length > 200 && (
                    <Text onPress={toggleText} style={styles.showMoreText}>
                      {isExpanded ? ' Show less' : ' Show more'}
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            <View>
              <CustomReviewCard reviwes={hcfData?.doctorReviewData || []} />
            </View>
          </>
        );
      case 'Department':
        Logger.debug('Rendering Department component', { hcfid: data });
        return <HcfDepartment hcfid={data} />;
      case 'Labs':
        Logger.debug('Rendering Labs component');
        return <LabDepartments />;
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  useEffect(() => {
    Logger.debug('HcfPage initialized', { data });
    fetchHcfById();
  }, [data.toString()]);

  const fullText = hcfData?.response?.about || '';
  const truncateText = fullText?.slice(0, 200);

  return (
    <ScrollView style={styles.scrollView}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={true}
          notificationUserIcon={true}
          id={5}
        />
      </View>
      
      {loading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonLoader
            width={wp(95)}
            height={hp(30)}
            borderRadius={10}
          />
          <SkeletonLoader
            width={wp(95)}
            height={hp(20)}
            borderRadius={10}
          />
          <SkeletonLoader
            width={wp(95)}
            height={hp(20)}
            borderRadius={10}
          />
          <SkeletonLoader
            width={wp(95)}
            height={hp(20)}
            borderRadius={10}
          />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <View>
            <BookAppointmentCard
              profile_picture={hcfData?.response?.profile_picture}
              firstname={hcfData?.response?.first_name}
              middlename={hcfData?.response?.middle_name}
              lastname={hcfData?.response?.last_name}
              dspecaility={hcfData?.response?.department_name}
              hospital={hcfData?.response?.hospital_org}
              day={hcfData?.response?.service_day_from}
              time={hcfData?.response?.service_day_to}
              showbtn={false}
            />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.contentContainer}>
            <View style={styles.tabsContainer}>
              <TopTabs
                bordercolor={COLORS.BG_WHITE}
                data={[
                  {id: 1, title: 'About'},
                  {id: 2, title: 'Department'},
                  {id: 3, title: 'Labs'},
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

            <View>{renderComponent()}</View>
          </View>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};

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
  skeletonContainer: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: COLORS.BG_LIGHT,
    padding: 10,
    borderRadius: 10,
    height: hp(100),
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  contentContainer: {
    gap: 10,
  },
  tabsContainer: {
    padding: 10,
    gap: hp(0),
  },
  aboutSection: {
    padding: 19,
    gap: hp(0),
  },
  aboutTitle: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
  },
  aboutTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aboutText: {
    fontSize: hp(1.6),
    fontFamily: 'Poppins-Regular',
    textAlign: 'justify',
    color: COLORS.TEXT_GRAY,
  },
  showMoreText: {
    color: COLORS.PRIMARY,
  },
});

export default HfcPage;
