/**
 * ============================================================================
 * DOCTOR PAGE
 * ============================================================================
 * 
 * PURPOSE:
 * Display detailed doctor information, reviews, education, licenses, awards,
 * and experience. Allows users to book appointments.
 * 
 * FEATURES:
 * - Doctor profile with ratings and reviews
 * - Education, licenses, and awards display
 * - Work experience listing
 * - Book appointment functionality
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates doctor ID before API calls
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
 * - BookAppointmentCard: Appointment booking card
 * - CustomRatingBar: Rating display
 * - CustomReviewCard: Review cards
 * - CustomEduLicAwardCard: Education/license/award cards
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module DoctorPage
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
import CustomRatingBar from '../../../components/customRatingBar/CustomRatingBar';
import InAppHeader from '../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomReviewCard from '../../../components/customReviewCard/CustomReviewCard';
import CustomEduLicAwardCard from '../../../components/customEdu-Licen-AwardCard/CustomEduLicAwardCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import SkeletonLoader from '../../../components/customSkeleton/SkeletonLoader';
import CustomToaster from '../../../components/customToaster/CustomToaster';
import Logger from '../../../constants/logger';
import { COLORS } from '../../../constants/colors';

const DoctorPage = () => {
  const routes = useRoute();
  const {mode} = routes.params;
  const navigation = useNavigation();
  const {data, hcfid} = routes.params;

  const [isExpanded, setIsExpanded] = useState(false);
  const [doctorById, setDoctorrById] = useState({
    response: {},
    doctorLicense: [],
    doctorAwards: [],
    doctorExperience: [],
    doctorReviewData: [],
    doctorTotalconsultations: '',
    doctorTotalReviews: '',
    doctorAverageRating: '',
    doctorTotalExperience: '',
  });
  const [loading, setLoading] = useState(true);

  /**
   * Fetch doctor details by ID
   * SECURITY: Validates doctor ID before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchDoctorById = async () => {
    // SECURITY: Validate doctor ID before API call
    if (!data || data === 'null' || data === 'undefined') {
      Logger.error('Invalid doctor ID', { data });
      CustomToaster.show('error', 'Error', 'Invalid doctor information.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      Logger.api('POST', 'patient/DashboardDoctordetailsbyId', {
        suid: data.toString(),
      });

      const response = await axiosInstance.post(
        `patient/DashboardDoctordetailsbyId`,
        {suid: data.toString()},
      );

      Logger.debug('Doctor details response', {
        hasResponse: !!response?.data?.response,
        hasLicense: !!response?.data?.doctorLicense,
        hasAwards: !!response?.data?.doctorAwards,
      });

      // SECURITY: Validate response data type
      const doctorData = response?.data?.response || {};
      const licenses = Array.isArray(response?.data?.doctorLicense)
        ? response?.data?.doctorLicense
        : [];
      const awards = Array.isArray(response?.data?.doctorAwards)
        ? response?.data?.doctorAwards
        : [];
      const experience = Array.isArray(response?.data?.doctorExperience)
        ? response?.data?.doctorExperience
        : [];
      const reviews = Array.isArray(response?.data?.doctorReviewData)
        ? response?.data?.doctorReviewData
        : [];

      setDoctorrById({
        response: doctorData,
        doctorLicense: licenses,
        doctorAwards: awards,
        doctorExperience: experience,
        doctorReviewData: reviews,
        doctorAverageRating: response?.data?.doctorAverageRating || '0',
        doctorTotalconsultations:
          response?.data?.doctorTotalconsultations || '0',
        doctorTotalReviews: response?.data?.doctorTotalReviews || '0',
        doctorTotalExperience: response?.data?.doctorTotalExperience || '0',
      });

      Logger.info('Doctor details fetched successfully', {
        licensesCount: licenses.length,
        awardsCount: awards.length,
        experienceCount: experience.length,
        reviewsCount: reviews.length,
      });
    } catch (error) {
      Logger.error('Error fetching doctor details', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch doctor details. Please try again later.';
      
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
   * Handle book appointment navigation
   * @param {string|number} doctor_id - Doctor ID
   */
  const handleBookAppointment = doctor_id => {
    Logger.debug('Book appointment initiated', { doctor_id, hcfid, mode });
    
    // SECURITY: Validate doctor ID before navigation
    if (!doctor_id) {
      Logger.error('Invalid doctor ID for booking', { doctor_id });
      CustomToaster.show('error', 'Error', 'Invalid doctor information.');
      return;
    }

    navigation.navigate('BookAppointment', {
      hcf_id: hcfid,
      doctorid: doctor_id,
      mode: mode,
    });
  };

  useEffect(() => {
    Logger.debug('DoctorPage initialized', { data, hcfid, mode });
    fetchDoctorById();
  }, [data.toString()]);

  const fullText = doctorById?.response?.description || '';
  const truncateText = fullText?.slice(0, 200);

  return (
    <ScrollView style={styles.scrollView}>
      <View>
        <Header
          logo={require('../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={true}
          notificationUserIcon={true}
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
              profile_picture={doctorById?.response?.profile_picture}
              firstname={doctorById?.response?.first_name}
              middlename={doctorById?.response?.middle_name}
              lastname={doctorById?.response?.last_name}
              dspecaility={doctorById?.response?.department_name}
              hospital={doctorById?.response?.hospital_org}
              day={doctorById?.response?.working_days_start}
              time={doctorById?.response?.working_time_start}
              onClick={() =>
                handleBookAppointment(doctorById?.response?.doctor_id)
              }
            />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.contentContainer}>
            <View>
              <CustomRatingBar
                pat={doctorById?.doctorTotalconsultations}
                exp={doctorById?.doctorTotalExperience || '0'}
                rat={doctorById?.doctorAverageRating}
                rev={doctorById?.doctorTotalReviews}
              />
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About Me</Text>
              <Text style={styles.aboutText}>
                {isExpanded ? fullText : truncateText}
                {fullText?.length > 200 && (
                  <Text onPress={toggleText} style={styles.showMoreText}>
                    {isExpanded ? ' Show less' : ' Show more'}
                  </Text>
                )}
              </Text>
            </View>

            <View>
              <CustomReviewCard reviwes={doctorById?.doctorReviewData} />
            </View>

            {/* Education Section */}
            <View>
              <View style={styles.sectionHeader}>
                <InAppHeader LftHdr={'Education'} textbtn={false} />
              </View>
              <CustomEduLicAwardCard
                collegename={doctorById?.response?.university_name}
                collegeDegree={doctorById?.response?.degree}
                year={doctorById?.response?.qualified_year}
                collegeicon={
                  doctorById?.response?.university_name?.charAt(0) || ''
                }
                type="education"
              />
            </View>

            {/* Licenses & Certifications Section */}
            <View>
              <View style={styles.sectionHeader}>
                {doctorById?.doctorLicense?.length > 0 && (
                  <InAppHeader
                    LftHdr={'Licenses & Certifications'}
                    textbtn={false}
                  />
                )}
              </View>
              {doctorById.doctorLicense.map((lic, i) => (
                <CustomEduLicAwardCard
                  key={`license-${lic?.lic_id || i}`}
                  type="licenses"
                  certificateName={lic?.lic_title}
                  certificateId={lic?.lic_certificate_no}
                  issueDate={lic?.lic_date}
                  authority={lic?.lic_issuedby}
                  certificateIcon={lic?.lic_title?.charAt(0) || ''}
                  description={lic?.lic_description}
                />
              ))}
            </View>

            {/* Honours & Awards Section */}
            <View>
              <View style={styles.sectionHeader}>
                {doctorById?.doctorAwards?.length > 0 && (
                  <InAppHeader LftHdr={'Honours  & Awards'} textbtn={false} />
                )}
              </View>
              {doctorById?.doctorAwards?.map((award, i) => (
                <CustomEduLicAwardCard
                  key={`award-${award?.award_id || i}`}
                  type="awards"
                  awardTitle={award?.award_title}
                  awardIssued={award?.award_issuedby}
                  issueDate={award?.award_date}
                  description={award?.award_description}
                  awardIcon={award?.award_title?.charAt(0) || ''}
                />
              ))}
            </View>

            {/* Work Experience Section */}
            <View>
              <View style={styles.sectionHeader}>
                {doctorById?.doctorExperience?.length > 0 && (
                  <InAppHeader LftHdr={'Work Experience'} textbtn={false} />
                )}
              </View>
              {doctorById?.doctorExperience?.map((exp, i) => (
                <CustomEduLicAwardCard
                  key={`experience-${exp?.exp_id || i}`}
                  type="experience"
                  job={exp?.job}
                  organization={exp?.organisation}
                  fromdate={exp?.from_date}
                  todate={exp?.to_date}
                  experienceIcon={exp?.organisation?.charAt(0) || ''}
                />
              ))}
            </View>
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
  aboutSection: {
    padding: 19,
    gap: hp(0),
  },
  aboutTitle: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-SemiBold',
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
  sectionHeader: {
    paddingHorizontal: 10,
  },
});

export default DoctorPage;
