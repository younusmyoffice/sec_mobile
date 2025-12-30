/**
 * ============================================================================
 * SCREEN: Cancel Appointment Reason
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for selecting a reason when cancelling an appointment
 * 
 * SECURITY:
 * - Input sanitization should be added before API submission
 * - No sensitive data handled directly
 * 
 * TODO:
 * - Integrate with API endpoint for appointment cancellation
 * - Add input sanitization before submission
 * - Add success/error toast notifications
 * 
 * @module CancelReason
 */

import {View, Text, ScrollView, SafeAreaView, Alert} from 'react-native';
import React, {useState} from 'react';

// Components
import Header from '../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../components/customButton/CustomButton';

// Utils & Constants
import {COLORS} from '../../constants/colors'; // DESIGN: Color constants
import Logger from '../../constants/logger'; // UTILITY: Structured logging
import CustomToaster from '../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import axiosInstance from '../../utils/axiosInstance'; // SECURITY: Auto token injection
import {sanitizeInput} from '../../utils/inputSanitization'; // SECURITY: Input sanitization

const CancelReason = () => {
  // STATE: Selected cancellation reason
  const [selectReschedule, setselectReschedule] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // DATA: Available cancellation reasons
  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the schedule'},
    {id: 3, label: 'Reason 3'},
    {id: 4, label: 'Reason 4'},
    {id: 5, label: 'Reason 5'},
  ];

  /**
   * HANDLER: Update selected cancellation reason
   * 
   * @param {string} radio - Selected reason label
   */
  const handleChange = radio => {
    // SECURITY: Sanitize input before processing
    const sanitizedReason = sanitizeInput(radio);
    Logger.debug('Cancellation reason selected', { reason: sanitizedReason });
    setselectReschedule(sanitizedReason);
  };

  /**
   * API: Submit cancellation request with reason
   * 
   * TODO: Integrate with actual API endpoint
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    // VALIDATION: Check if reason is selected
    if (!selectReschedule) {
      // REUSABLE TOAST: Show validation error
      CustomToaster.show('error', 'Validation Error', 'Please select a reason for cancellation');
      Alert.alert('Validation Error', 'Please select a reason for cancellation.');
      return;
    }

    setIsLoading(true);

    try {
      // SECURITY: Sanitize reason before API call
      const sanitizedReason = sanitizeInput(selectReschedule);

      Logger.api('POST', 'Appointment/Cancel', { reason: sanitizedReason });

      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post('Appointment/Cancel', {
      //   appointment_id: appointmentId,
      //   reason: sanitizedReason,
      // });

      Logger.info('Appointment cancellation submitted', { reason: sanitizedReason });

      // REUSABLE TOAST: Show success message
      CustomToaster.show('success', 'Success', 'Appointment cancelled successfully');

      Alert.alert(
        'Success',
        'Appointment has been cancelled successfully.',
        [{ text: 'OK' }]
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

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <InAppCrossBackHeader showClose={true} />
        </View>
        <View style={{gap: 30}}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
                fontWeight: '400',
              }}>
              Cancel Appointment
            </Text>
          </View>
          <View style={{padding: 15, gap: 25}}>
            <Text style={{fontSize: 18, color: COLORS.TEXT_PRIMARY, fontWeight: '500'}}>
              Reason for Cancellation
            </Text>
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
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title={isLoading ? "Submitting..." : "Continue"}
              borderColor={COLORS.PRIMARY} // DESIGN: Use color constant
              bgColor={isLoading ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY} // DESIGN: Use color constant
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              width={250}
              padding={5}
              borderRadius={30}
              disabled={isLoading}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CancelReason;
