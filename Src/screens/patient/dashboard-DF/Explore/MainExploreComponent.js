/**
 * ============================================================================
 * MAIN EXPLORE COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display component for Explore section showing Popular, Featured, Categories,
 * Near You doctors, and Healthcare Facilities.
 * 
 * FEATURES:
 * - Popular doctors list (horizontal scroll)
 * - Featured doctors list (horizontal scroll)
 * - Categories with department filtering
 * - Near you doctors based on location
 * - Healthcare Facilities list
 * - Loading states with SkeletonLoader
 * - Empty states with images
 * 
 * SECURITY:
 * - No direct API calls (data received via props from parent)
 * - Parent component (PatientDashboardScreen) handles authentication and API calls
 * - Uses axiosInstance (via parent) - access token handled automatically
 * 
 * ERROR HANDLING:
 * - Empty states handled gracefully
 * - Loading states prevent flash of empty content
 * 
 * REUSABLE COMPONENTS:
 * - StaticDisplayCard: Static promotional cards
 * - DoctorCard: Doctor profile card
 * - SkeletonLoader: Loading skeleton
 * - InAppHeader: Section headers
 * - TopTabs: Category tabs
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance in parent component
 * - Reusable throughout application via axiosInstance
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module MainExploreComponent
 */

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import StaticDisplayCard from './StaticDisplayCard';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import DoctorCard from '../../../../components/customCards/doctorCard/DoctorCard';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import {useNavigation} from '@react-navigation/native';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useCommon} from '../../../../Store/CommonContext';
import { getEmptyStateImageSource } from '../../../../utils/imageUtils';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

export default function MainExploreComponent({
  popularCards,
  featuredcard,
  nearmeCards,
  loading,
  Featuredloading,
  handleNavigateDoctor,
  handleNavigateHCF,
  hcf,
}) {
  const navigation = useNavigation();
  const {
    dept,
    setDept,
    activeTab,
    setActiveTab,
    doctorDepartmentsCache,
    setDoctorDepartmentsCache,
    categoriesDoctor,
    setCategoriesDoctor,
    fetchDoctorDepartments,
  } = useCommon();

  Logger.debug('MainExploreComponent rendered', {
    popularCount: popularCards?.length || 0,
    featuredCount: featuredcard?.length || 0,
    nearMeCount: nearmeCards?.length || 0,
    hcfCount: hcf?.length || 0,
    categoriesCount: categoriesDoctor?.length || 0,
  });

  /**
   * Normalize review star rating (1-5)
   * @param {number|string} review - Review rating value
   * @returns {number|string} - Normalized rating (1-5) or empty string
   */
  const normalizeReviewStar = (review) => {
    if (!review) return '';
    const numReview = typeof review === 'string' ? parseFloat(review) : review;
    if (numReview >= 1 && numReview <= 5) {
      return Math.round(numReview);
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Static promotional cards */}
        <StaticDisplayCard />

        {/* Popular Doctors Section */}
        <View style={styles.section}>
          <InAppHeader LftHdr="Popular" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              // Loading skeleton for Popular doctors
              Array.from({length: 3}).map((_, index) => (
                <View key={index} style={styles.skeletonCard}>
                  <View style={styles.skeletonRow}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={styles.skeletonTextContainer}>
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                    </View>
                  </View>
                </View>
              ))
            ) : popularCards?.length > 0 ? (
              // Popular doctors list
              popularCards.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`popular-${item?.suid || i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid, "doctor")}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={normalizeReviewStar(item?.average_review)}
                />
              ))
            ) : (
              // Empty state for Popular doctors
              <View style={styles.emptyStateContainer}>
                <Image
                  source={getEmptyStateImageSource()}
                  style={styles.emptyStateImage}
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Featured Doctors Section */}
        <View style={styles.section}>
          <InAppHeader LftHdr="Featured" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}>
            {Featuredloading ? (
              // Loading skeleton for Featured doctors
              Array.from({length: 3}).map((_, index) => (
                <View key={index} style={styles.skeletonCard}>
                  <View style={styles.skeletonRow}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={styles.skeletonTextContainer}>
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                    </View>
                  </View>
                </View>
              ))
            ) : featuredcard?.length > 0 ? (
              // Featured doctors list
              featuredcard.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`featured-${item?.suid || i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={normalizeReviewStar(item?.average_review)}
                />
              ))
            ) : (
              // Empty state for Featured doctors
              <View style={styles.emptyStateContainer}>
                <Image
                  source={getEmptyStateImageSource()}
                  style={styles.emptyStateImage}
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <InAppHeader LftHdr="Categories" btnYN={false} />
          <TopTabs
            borderwidth={1}
            bordercolor={COLORS.BG_WHITE}
            data={dept?.map((item, i) => ({
              id: i,
              title: item.department_name,
            }))}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabfunc={fetchDoctorDepartments}
            funcstatus={true}
          />
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              // Loading skeleton for Categories
              <View style={styles.skeletonCard}>
                <View style={styles.skeletonRow}>
                  <SkeletonLoader width={85} height={90} borderRadius={10} />
                  <View style={styles.skeletonTextContainer}>
                    <SkeletonLoader width={wp(60)} height={hp(3)} borderRadius={10} />
                    <SkeletonLoader width={wp(60)} height={hp(3)} borderRadius={10} />
                  </View>
                </View>
              </View>
            ) : categoriesDoctor?.length > 0 ? (
              // Categories doctors list
              categoriesDoctor.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`category-${item?.suid || i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital}
                  reviewstar={
                    item?.average_review
                      ? Math.min(5, Math.max(1, item.average_review))
                      : ''
                  }
                />
              ))
            ) : (
              // Empty state for Categories
              <View style={styles.emptyStateContainer}>
                <Image
                  source={getEmptyStateImageSource()}
                  style={styles.emptyStateImage}
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Near You Section */}
        <View style={styles.section}>
          <InAppHeader LftHdr="Near you" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}>
            {loading ? (
              // Loading skeleton for Near You doctors
              Array.from({length: 3}).map((_, index) => (
                <View key={index} style={styles.skeletonCard}>
                  <View style={styles.skeletonRow}>
                    <SkeletonLoader width={85} height={90} borderRadius={10} />
                    <View style={styles.skeletonTextContainer}>
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                      <SkeletonLoader width={150} height={20} borderRadius={10} />
                    </View>
                  </View>
                </View>
              ))
            ) : nearmeCards?.length > 0 ? (
              // Near You doctors list
              nearmeCards.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`nearme-${item?.suid || i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateDoctor(item?.suid)}
                  reviews={item?.review_name}
                  speciality={item?.department_name}
                  hospital={item?.hospital_org}
                  reviewstar={normalizeReviewStar(item?.average_review)}
                />
              ))
            ) : (
              // Empty state for Near You doctors
              <View style={styles.emptyStateContainer}>
                <Image
                  source={getEmptyStateImageSource()}
                  style={styles.emptyStateImage}
                />
              </View>
            )}
          </ScrollView>
        </View>

        {/* Healthcare Facilities Section */}
        <View style={styles.section}>
          <InAppHeader LftHdr="Healthcare Facility" btnYN={false} />
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.horizontalScrollContent}
            showsHorizontalScrollIndicator={false}>
            {hcf?.length > 0 ? (
              // Healthcare Facilities list
              hcf.map((item, i) => (
                <DoctorCard
                  profile_picture={item?.profile_picture}
                  key={`hcf-${item?.suid || i}`}
                  firstname={item?.first_name}
                  middlename={item?.middle_name}
                  lastname={item?.last_name}
                  onClick={() => handleNavigateHCF(item?.suid)}
                  reviews={item?.review_name}
                  speciality={''}
                  hospital={item?.hospital_org}
                  reviewstar={normalizeReviewStar(item?.average_review)}
                />
              ))
            ) : (
              // Loading skeleton for Healthcare Facilities
              <View style={styles.skeletonCard}>
                <View style={styles.skeletonRow}>
                  <SkeletonLoader width={85} height={90} borderRadius={10} />
                  <View style={styles.skeletonTextContainer}>
                    <SkeletonLoader width={wp(60)} height={hp(3)} borderRadius={10} />
                    <SkeletonLoader width={wp(60)} height={hp(3)} borderRadius={10} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
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
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    gap: 10,
  },
  section: {
    marginBottom: 0,
  },
  horizontalScrollContent: {
    gap: 10,
  },
  skeletonCard: {
    flexDirection: 'column',
    gap: 10,
    backgroundColor: COLORS.GRAY_LIGHT,
    padding: 10,
    borderRadius: 10,
    height: hp(18),
    width: wp(95),
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonTextContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  emptyStateContainer: {
    alignSelf: 'center',
  },
  emptyStateImage: {
    height: hp(10),
    width: wp(40),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
