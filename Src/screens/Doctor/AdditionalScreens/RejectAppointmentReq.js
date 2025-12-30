/**
 * ============================================================================
 * SCREEN: Reject Appointment Request
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for doctors to reject appointment requests with reason selection
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Input sanitization added before API submission
 * - Comprehensive error handling
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Validation errors shown via Alert and Toast
 * - API errors handled gracefully
 * - Success feedback provided
 * 
 * @module RejectAppointmentReq
 */

import {View, Text, ScrollView, SafeAreaView, Alert, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

// Components
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';

// Utils & Constants
import {baseUrl} from '../../../utils/baseUrl';
import axiosInstance from '../../../utils/axiosInstance'; // SECURITY: Auto token injection
import CustomToaster from '../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import Logger from '../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../constants/colors'; // DESIGN: Color constants
import {sanitizeInput} from '../../../utils/inputSanitization'; // SECURITY: Input sanitization

const RejectAppointmentReq = ({route}) => {
  const navigation = useNavigation();
  
  // STATE: Selected rejection reason and loading state
  const [selectReschedule, setselectReschedule] = useState();
  const [isLoading, setIsLoading] = useState(false);
  
  // DATA: Get appointment data from route params
  const {navData} = route.params || {};
  
  Logger.debug('RejectAppointmentReq initialized', {
    hasNavData: !!navData,
    appointment_id: navData?.appointment_id,
  });

  /**
   * API: Reject appointment request with reason
   * 
   * SECURITY:
   * - Uses axiosInstance (automatic token injection)
   * - Input sanitization before API call
   * - Integer type validation for IDs
   * 
   * ERROR HANDLING: ✅ Comprehensive
   * - Validation errors
   * - API errors
   * - User feedback via Toast and Alert
   * 
   * @param {Object} navData - Appointment data from route params
   * @param {number|string} navData.appointment_id - Appointment ID
   * @param {number|string} navData.patient_id - Patient ID
   * @param {number|string} navData.doctor_id - Doctor ID
   * @returns {Promise<void>}
   */
  const rejectAppointment = async (navData) => {
    // VALIDATION: Check if reason is selected
    if (!selectReschedule) {
      Logger.warn('Rejection reason not selected');
      // REUSABLE TOAST: Show validation error
      CustomToaster.show('error', 'Validation Error', 'Please select a reason for rejecting the appointment');
      Alert.alert(
        'Validation Error',
        'Please select a reason for rejecting the appointment.',
        [{text: 'OK'}],
      );
      return;
    }

    // VALIDATION: Check if navData is provided
    if (!navData || !navData.appointment_id) {
      Logger.error('Invalid appointment data', { navData });
      CustomToaster.show('error', 'Error', 'Invalid appointment data');
      Alert.alert('Error', 'Invalid appointment data. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // SECURITY: Sanitize rejection reason before API call
      const sanitizedReason = sanitizeInput(selectReschedule);

      Logger.api('POST', 'Doctor/AppointmentsRequestsReject', {
        appointment_id: navData.appointment_id,
        reason: sanitizedReason,
      });

      const response = await axiosInstance.post(
        `${baseUrl}Doctor/AppointmentsRequestsReject`,
        {
          appointment_id: parseInt(navData.appointment_id), // SECURITY: Ensure integer type
          patient_id: parseInt(navData.patient_id), // SECURITY: Ensure integer type
          doctor_id: parseInt(navData.doctor_id), // SECURITY: Ensure integer type
          status: "in_progress",
          reason: sanitizedReason, // SECURITY: Use sanitized reason
          option: "reject",
        },
      );

      Logger.info('Appointment rejected successfully', {
        appointment_id: navData.appointment_id,
        response: response?.data,
      });

      // REUSABLE TOAST: Show success message
      CustomToaster.show('success', 'Success', 'Appointment has been rejected successfully');

      // Show success alert with navigation
      Alert.alert(
        'Success',
        'Appointment has been rejected successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to reject appointment. Please try again later.';

      Logger.error('Error rejecting appointment', {
        status: err?.response?.status,
        message: errorMessage,
        error: err,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);

      // Show error alert
      Alert.alert('Error', errorMessage, [{text: 'OK'}]);
    } finally {
      setIsLoading(false);
    }
  };

  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the scheduled time'},
    {id: 3, label: 'Patient condition requires immediate attention'},
    {id: 4, label: 'Emergency situation has arisen'},
    {id: 5, label: 'Other professional commitment'},
  ];

  /**
   * HANDLER: Update selected rejection reason
   * 
   * @param {string} radio - Selected reason label
   */
  const handleChange = radio => {
    // SECURITY: Sanitize input before processing
    const sanitizedReason = sanitizeInput(radio);
    Logger.debug('Rejection reason selected', { reason: sanitizedReason });
    setselectReschedule(sanitizedReason);
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <HeaderDoctor />

        <View style={styles.content}>
          <InAppCrossBackHeader
            backgroundColor={COLORS.BG_WHITE} // DESIGN: Use color constant
            showClose={true}
            onBackPress={() => navigation.goBack()}
          />
          <View>
            <Text style={styles.title}>Reject Appointment Request</Text>
            <Text style={styles.subtitle}>
              Are You sure. You want to cancel the appointment.
            </Text>
          </View>
          <View style={styles.reasonSection}>
            <Text style={styles.reasonTitle}>Reason for Rejection</Text>
            <View style={{gap: 10}}>
              {reschedule.map((radio, id) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={18}
                  //   fontweight={200}
                />
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22}}>
              Note : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo
              non dolor bibendum,
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? 'Rejecting...' : 'Done'}
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              bgColor={isLoading ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              width={250}
              padding={5}
              borderRadius={30}
              disabled={isLoading}
              onPress={() => rejectAppointment(navData)}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// DESIGN: Styles using color constants and StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  content: {
    gap: 30,
    padding: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  reasonSection: {
    padding: 15,
    gap: 25,
  },
  reasonTitle: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontWeight: '500',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default RejectAppointmentReq;

