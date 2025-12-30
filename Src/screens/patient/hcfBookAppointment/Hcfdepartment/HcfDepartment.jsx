/**
 * ============================================================================
 * HCF DEPARTMENT COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display HCF departments with doctors in each department. Allows navigation
 * to doctor booking pages.
 * 
 * FEATURES:
 * - Department tabs
 * - Doctor cards in horizontal scroll
 * - Navigation to doctor booking
 * 
 * SECURITY:
 * - No direct API calls (uses CommonContext)
 * - Validates HCF ID before navigation
 * 
 * ERROR HANDLING:
 * - Empty state handling
 * - Loading states with SkeletonLoader
 * 
 * REUSABLE COMPONENTS:
 * - SkeletonLoader: Loading skeleton
 * - TopTabs: Tab navigation
 * - DoctorCard: Doctor card component
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module HcfDepartment
 */

import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {useCommon} from '../../../../Store/CommonContext';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const HcfDepartment = ({hcfid}) => {
  const navigation = useNavigation();

  const {
    dept,
    activeTab,
    setActiveTab,
    fetchHcfDoctorDepartments,
    HcfcategoriesDoctor,
    hcfLoading,
  } = useCommon();

  /**
   * Handle navigation to doctor booking page
   * SECURITY: Validates doctor ID and HCF ID before navigation
   * @param {string|number} item - Doctor ID (suid)
   * @param {string} mode - Booking mode
   * @param {string|number} hcfid - HCF ID
   */
  const handleNavigateDoctor = (item, mode, hcfid) => {
    Logger.debug('Navigate to doctor booking', {
      doctorId: item,
      mode,
      hcfid,
    });

    // SECURITY: Validate doctor ID and HCF ID before navigation
    if (!item || !hcfid) {
      Logger.error('Invalid navigation parameters', { item, hcfid });
      return;
    }

    navigation.navigate('DoctorBookAppointment', {
      data: item.toString(),
      mode: mode,
      hcfid: hcfid,
    });
  };

  Logger.debug('HcfDepartment rendered', {
    hcfid,
    departmentsCount: dept?.length || 0,
    doctorsCount: HcfcategoriesDoctor?.length || 0,
    isLoading: hcfLoading,
  });

  return (
    <View style={styles.container}>
      <TopTabs
        borderwidth={1}
        bordercolor={COLORS.BG_WHITE}
        data={dept?.map((item, i) => ({
          id: i,
          title: item.department_name,
        })) || []}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          Logger.debug('Department tab changed', { from: activeTab, to: tab });
          setActiveTab(tab);
        }}
        tabfunc={fetchHcfDoctorDepartments}
        funcstatus={true}
      />
      
      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}>
          {hcfLoading ? (
            // Show Skeleton Loader while fetching
            <View style={styles.skeletonContainer}>
              <View style={styles.skeletonRow}>
                <SkeletonLoader width={85} height={90} borderRadius={10} />
                <View style={styles.skeletonTextContainer}>
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                  />
                  <SkeletonLoader
                    width={wp(60)}
                    height={hp(3)}
                    borderRadius={10}
                  />
                </View>
              </View>
            </View>
          ) : HcfcategoriesDoctor?.length > 0 ? (
            // Show Doctor Cards if data exists
            HcfcategoriesDoctor.map((item, i) => (
              <DoctorCard
                key={`doctor-${item?.suid || i}`}
                profile_picture={item?.profile_picture}
                firstname={item?.first_name}
                middlename={item?.middle_name}
                lastname={item?.last_name}
                onClick={() => handleNavigateDoctor(item?.suid, 'hcf', hcfid)}
                reviews={item?.review_name}
                speciality={item?.department_name}
                hospital={item?.qualification}
                reviewstar={
                  item?.average_review
                    ? Math.min(5, Math.max(1, item?.average_review))
                    : ''
                }
              />
            ))
          ) : (
            // Show "No Doctors Available" if no data exists after loading
            <View style={styles.emptyState}>
              <Image
                source={require('../../../../assets/NoAppointment.png')}
                style={styles.emptyStateImage}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  scrollContent: {
    gap: 10,
  },
  skeletonContainer: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: COLORS.BG_LIGHT,
    padding: 10,
    borderRadius: 10,
    height: hp(18),
    width: wp(95),
    marginTop: 10,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonTextContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  emptyState: {
    alignSelf: 'center',
  },
  emptyStateImage: {
    height: hp(10),
    width: wp(40),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default HcfDepartment;
