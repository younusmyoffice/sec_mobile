/**
 * ============================================================================
 * REJECT APPOINTMENT REQUEST - CLINIC
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for Clinic users to reject appointment requests with a reason.
 * 
 * FEATURES:
 * - Display appointment rejection reasons
 * - Add custom notes for rejection
 * - Submit rejection to backend API
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates appointment data before API call
 * - Input sanitization for form data
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Form validation (reason required)
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - CustomRadioButton: Selection UI
 * - CustomButton: Action button
 * - CustomInput: Text input/textarea
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module RejectAppointmentReqClinic
 */

import {View, Text, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import { baseUrl } from '../../../utils/baseUrl';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import CustomLoader from '../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../components/customToaster/CustomToaster';
import Logger from '../../../constants/logger';
import { COLORS } from '../../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../components/customInputs/CustomInputs';

const RejectAppointmentReqClinic = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { navData } = route.params || {};
  
  const [selectReschedule, setSelectReschedule] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // SECURITY: Validate navData exists
  if (!navData) {
    Logger.error('RejectAppointmentReqClinic: navData is missing');
    CustomToaster.show('error', 'Error', 'Appointment data not found. Please try again.');
    navigation.goBack();
    return null;
  }

  Logger.debug('RejectAppointmentReqClinic initialized', { 
    appointment_id: navData.appointment_id 
  });

  /**
   * Reject appointment request
   * SECURITY: Validates all required data before API call
   * ERROR HANDLING: Comprehensive error handling with user-friendly messages
   */
  const rejectAppointment = async () => {
    // SECURITY: Validate reason is selected
    if (!selectReschedule) {
      CustomToaster.show('error', 'Validation Error', 'Please select a reason for rejection.');
      Logger.warn('Rejection reason not selected');
      return;
    }

    // SECURITY: Validate appointment data
    if (!navData?.appointment_id || !navData?.patient_id || !navData?.doctor_id) {
      const errorMsg = 'Invalid appointment data. Please try again.';
      Logger.error('Invalid appointment data', { navData });
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);
    
    try {
      // SECURITY: Prepare payload with validated data
      const payload = {
        appointment_id: Number(navData.appointment_id),
        patient_id: Number(navData.patient_id),
        doctor_id: Number(navData.doctor_id),
        status: 'in_progress',
        reason: String(selectReschedule).trim(),
        note: String(note || '').trim(),
        option: 'reject',
      };

      Logger.api('POST', 'Doctor/AppointmentsRequestsReject', { 
        appointment_id: payload.appointment_id 
      });

      const response = await axiosInstance.post(
        `Doctor/AppointmentsRequestsReject`,
        payload
      );

      Logger.info('Appointment rejected successfully', { 
        appointment_id: payload.appointment_id,
        response: response.data 
      });

      // SUCCESS: Show success message and navigate back
      CustomToaster.show(
        'success',
        'Success',
        'Appointment request rejected successfully.'
      );

      // Navigate back after a short delay to allow toast to show
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      Logger.error('Error rejecting appointment', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to reject appointment. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rejection reason options
   * SECURITY: Predefined reasons to prevent injection attacks
   */
  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the schedule'},
    {id: 3, label: 'Reason 3'},
    {id: 4, label: 'Reason 4'},
    {id: 5, label: 'Reason 5'},
  ];

  /**
   * Handle radio button selection
   * @param {string} radio - Selected reason label
   */
  const handleChange = radio => {
    setSelectReschedule(radio);
    Logger.debug('Rejection reason selected', { reason: radio });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <HeaderDoctor/>
        
        {/* REUSABLE COMPONENT: CustomLoader for loading states */}
        {loading && <CustomLoader />}
        
        <View style={styles.content}>
          <InAppCrossBackHeader backgroundColor={COLORS.BG_WHITE} showClose={true} />
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              Reject Appointment Request
            </Text>
            <Text style={styles.subtitle}>
              Are You sure. You want to cancel the appointment.
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>
              Reason for Rejection
            </Text>
            <View style={styles.radioContainer}>
              {reschedule.map((radio) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={hp(1.8)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.noteContainer}>
            <Text style={styles.label}>
              Add Note
            </Text>
            <CustomInput 
              type={'textarea'} 
              value={note}
              onChange={(name, value) => {
                setNote(value);
                Logger.debug('Note updated', { length: value.length });
              }}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Done"
              bgColor={COLORS.PRIMARY}
              fontfamily={'Poppins-SemiBold'}
              textColor={COLORS.TEXT_WHITE}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
              onPress={rejectAppointment}
              disabled={loading || !selectReschedule}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  content: {
    gap: 30,
    padding: 15,
  },
  headerContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '400',
    fontFamily: 'Poppins-SemiBold',
  },
  formContainer: {
    padding: 15,
    gap: 25,
  },
  label: {
    fontSize: hp(2),
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  radioContainer: {
    gap: 10,
  },
  noteContainer: {
    gap: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default RejectAppointmentReqClinic;
