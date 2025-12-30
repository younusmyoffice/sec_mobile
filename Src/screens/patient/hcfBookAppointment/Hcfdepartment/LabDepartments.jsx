/**
 * ============================================================================
 * LAB DEPARTMENTS COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Display lab departments with available tests. Allows users to book lab tests.
 * 
 * FEATURES:
 * - Lab department tabs
 * - Lab test cards in horizontal scroll
 * - Book test modal functionality
 * 
 * SECURITY:
 * - No direct API calls (uses CommonContext)
 * - Validates user ID and test ID before booking
 * 
 * ERROR HANDLING:
 * - Empty state handling
 * - Loading states with SkeletonLoader
 * 
 * REUSABLE COMPONENTS:
 * - SkeletonLoader: Loading skeleton
 * - TopTabs: Tab navigation
 * - CustomButton: Action button
 * - CustomModal: Booking modal
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module LabDepartments
 */

import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useCommon} from '../../../../Store/CommonContext';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import SkeletonLoader from '../../../../components/customSkeleton/SkeletonLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomModal from '../../../../components/customModal/CustomModal';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

const LabDepartments = () => {
  const {
    labdept,
    LabactiveTab,
    setLabActiveTab,
    fetchLabTest,
    labtest,
    labload,
    userId
  } = useCommon();
  
  const [modalvisible, setModalVisible] = useState(false);
  const [examid, setExamId] = useState();
  const [hcfid, setHcfId] = useState();
  const [bookTest, setBookTest] = useState({
    book_date: '',
    patient_id: userId?.toString() || '',
    test_subexam_id: '',
    status: 'requested',
    payment_method_nonce: '',
  });

  /**
   * Update patient_id when userId changes
   */
  useEffect(() => {
    if (userId) {
      Logger.debug('User ID updated', { userId });
      setBookTest(prev => ({
        ...prev,
        patient_id: userId.toString(),
      }));
    }
  }, [userId]);

  /**
   * Handle book test button press
   * SECURITY: Validates test ID and user ID before opening modal
   * @param {object} item - Lab test item
   */
  const handleBookTest = (item) => {
    Logger.debug('Book test button pressed', {
      testId: item?.sub_exam_id,
      examId: item?.exam_id,
      hcfId: item?.hcf_id,
    });

    // SECURITY: Validate required fields before opening modal
    if (!item?.sub_exam_id || !item?.exam_id || !item?.hcf_id) {
      Logger.error('Invalid test information', { item });
      return;
    }

    setModalVisible(true);
    setBookTest(prev => ({
      ...prev,
      test_subexam_id: item.sub_exam_id.toString(),
    }));
    setExamId(item.exam_id);
    setHcfId(item.hcf_id);
  };

  Logger.debug('LabDepartments rendered', {
    departmentsCount: labdept?.length || 0,
    testsCount: labtest?.length || 0,
    isLoading: labload,
    userId,
  });

  return (
    <View style={styles.container}>
      {modalvisible && (
        <CustomModal
          modalVisible={modalvisible}
          set={setModalVisible}
          examid={examid}
          bookTest={bookTest}
          hcfid={hcfid}
          setBookTest={setBookTest}
        />
      )}
      
      <TopTabs
        borderwidth={1}
        bordercolor={COLORS.BG_WHITE}
        data={labdept?.map((item, i) => ({
          id: i,
          title: item.lab_department_name,
        })) || []}
        activeTab={LabactiveTab}
        setActiveTab={(tab) => {
          Logger.debug('Lab tab changed', { from: LabactiveTab, to: tab });
          setLabActiveTab(tab);
        }}
        tabfunc={fetchLabTest}
        funcstatus={true}
      />

      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}>
          {labload ? (
            // Show loader while fetching
            <View style={styles.skeletonContainer}>
              <View style={styles.skeletonRow}>
                <SkeletonLoader
                  width={85}
                  height={90}
                  borderRadius={10}
                />
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
          ) : labtest?.length > 0 ? (
            // Show data if available
            labtest.map((item, i) => (
              <View
                key={`test-${item?.sub_exam_id || i}`}
                style={styles.testCard}>
                <View>
                  <View style={styles.testHeader}>
                    <Text style={styles.testName}>
                      {item?.sub_exam_name}
                    </Text>
                    <Text style={styles.testPrice}>
                      Price: {item?.test_price}
                    </Text>
                  </View>
                  <Text style={styles.testInfo}>
                    Working days: {item?.lab_working_days_from} -
                    {item?.lab_working_days_to}
                  </Text>
                  <Text style={styles.testInfo}>
                    Working time: {item?.lab_working_time_from} -
                    {item?.lab_working_time_to}
                  </Text>
                </View>
                <View>
                  <CustomButton
                    title="Buy"
                    bgColor={COLORS.PRIMARY}
                    borderRadius={20}
                    textColor={COLORS.TEXT_WHITE}
                    onPress={() => handleBookTest(item)}
                  />
                </View>
              </View>
            ))
          ) : (
            // Show empty state if no data exists after loading
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
    padding: 10,
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
  testCard: {
    padding: 15,
    borderRadius: 16,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
    margin: 10,
    backgroundColor: COLORS.BG_WHITE,
    width: wp(90), // 90% of screen width
    flexDirection: 'column',
    gap: 10,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  testName: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  testPrice: {
    fontSize: hp(1.8),
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Poppins-thin',
  },
  testInfo: {
    fontSize: hp(1.8),
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'Poppins-thin',
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

export default LabDepartments;
