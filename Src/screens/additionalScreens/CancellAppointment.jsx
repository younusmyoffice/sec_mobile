/**
 * ============================================================================
 * SCREEN: Cancel Appointment Confirmation
 * ============================================================================
 * 
 * PURPOSE:
 * Confirmation screen for cancelling appointments
 * 
 * SECURITY:
 * - Uses axiosInstance for API calls (automatic token injection)
 * - Input validation before submission
 * 
 * TODO:
 * - Integrate with API endpoint for appointment cancellation
 * - Add navigation props to receive appointment data
 * - Add success/error handling
 * 
 * @module CancellAppointment
 */

import {View, Text, ScrollView, SafeAreaView, Alert} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

// Components
import Header from '../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomButton from '../../components/customButton/CustomButton';

// Utils & Constants
import {COLORS} from '../../constants/colors'; // DESIGN: Color constants
import Logger from '../../constants/logger'; // UTILITY: Structured logging
import CustomToaster from '../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import axiosInstance from '../../utils/axiosInstance'; // SECURITY: Auto token injection

const CancellAppointment = ({route}) => {
  const navigation = useNavigation();
  
  // STATE: Loading state for API call
  const [isLoading, setIsLoading] = useState(false);
  
  // Get appointment data from route params (if provided)
  const appointmentData = route?.params?.appointmentData || null;

  /**
   * API: Cancel appointment
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const handleCancelAppointment = async () => {
    setIsLoading(true);

    try {
      if (!appointmentData) {
        Logger.warn('No appointment data provided');
        CustomToaster.show('error', 'Error', 'Appointment data is missing');
        return;
      }

      Logger.api('POST', 'Appointment/Cancel', {
        appointment_id: appointmentData.appointment_id,
      });

      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post('Appointment/Cancel', {
      //   appointment_id: appointmentData.appointment_id,
      //   patient_id: appointmentData.patient_id,
      //   doctor_id: appointmentData.doctor_id,
      // });

      Logger.info('Appointment cancelled successfully', {
        appointment_id: appointmentData.appointment_id,
      });

      // REUSABLE TOAST: Show success message
      CustomToaster.show('success', 'Success', 'Appointment cancelled successfully');

      Alert.alert(
        'Success',
        'Appointment has been cancelled successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          'Failed to cancel appointment. Please try again later.';

      Logger.error('Error cancelling appointment', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);

      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);

    } finally {
      setIsLoading(false);
    }
  };

  /**
   * HANDLER: Handle "No" button - go back
   */
  const handleCancel = () => {
    Logger.debug('User cancelled the cancellation action');
    navigation.goBack();
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <InAppCrossBackHeader showClose={true} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 22,
              color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
              fontWeight: '400',
            }}>
            Cancel Appointment
          </Text>

          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
              marginTop: 30,
              fontWeight: '300',
            }}>
            Are you sure you want to cancel the appointment?
          </Text>

          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: COLORS.TEXT_GRAY, // DESIGN: Use color constant
              marginTop: 80,
              marginHorizontal: 20,
            }}>
            Note: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ut tellus quis sapien interdum commodo.
          </Text>

          <View style={{flexDirection: 'column', marginTop: 250, gap: 18}}>
            {/* BUTTON: Cancel action (go back) */}
            <CustomButton
              title="No"
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.PRIMARY} // DESIGN: Use color constant
              borderWidth={1}
              borderRadius={30}
              padding={5}
              fontSize={16}
              width={200}
              onPress={handleCancel}
            />
            
            {/* BUTTON: Confirm cancellation */}
            <CustomButton
              title={isLoading ? "Cancelling..." : "Yes, Cancel"}
              bgColor={isLoading ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              borderRadius={30}
              padding={5}
              fontSize={16}
              disabled={isLoading}
              onPress={handleCancelAppointment}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CancellAppointment;
