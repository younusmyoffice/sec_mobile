/**
 * ============================================================================
 * CONTACT DETAILS COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying and editing patient contact details.
 * Handles country, state, city, zip code, and street addresses.
 * 
 * FEATURES:
 * - Dynamic form fields with cascading dropdowns
 * - Save functionality
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Input validation before update
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomToaster: Toast notifications
 * - CustomInput: Form input component
 * - CustomButton: Action button
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ContactDetails
 */

import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';
import axiosInstance from '../../../../../utils/axiosInstance';

export default function ContactDetails({
  rest,
  formData,
  setFormData,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable
}) {
  const [uploading, setUploading] = useState(false);

  /**
   * Handle changes in form fields
   * PERFORMANCE: Resets dependent fields when parent changes
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = (name, value) => {
    Logger.debug('Contact field changed', { name, hasValue: !!value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Reset dependent fields when parent changes
    if (name === 'country_id') {
      Logger.debug('Country changed, resetting state and city');
      setFormData(prev => ({
        ...prev,
        state_id: '',
        city_id: '',
      }));
    }
  };

  /**
   * Handle contact details update
   * SECURITY: Validates form data before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleContactUpdate = async () => {
    // SECURITY: Basic input validation
    if (!formData.email) {
      Logger.warn('Contact update validation failed', {
        hasEmail: !!formData.email,
      });
      CustomToaster.show('error', 'Validation Error', 'Email is required.');
      return;
    }

    try {
      Logger.api('POST', 'updatePateintProfile', {
        email: formData.email,
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
        street_address1: formData.street_address1,
        street_address2: formData.street_address2,
        zip_code: formData.zip_code,
      });

      setUploading(true);
      
      const response = await axiosInstance.post('updatePateintProfile', {
        email: formData.email,
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
        street_address1: formData.street_address1,
        street_address2: formData.street_address2,
        zip_code: formData.zip_code,
      });
      
      Logger.info('Contact update successful', {
        hasResponse: !!response?.data,
      });

      // Refresh profile details after update
      if (showdetails) {
        await showdetails();
      }

      CustomToaster.show('success', 'Contact Updated', 'Contact information updated successfully.');
      setIsDisabled(true);
      
      Logger.info('Contact information updated successfully');
    } catch (error) {
      Logger.error('Contact update error', error);
      
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Contact update failed. Please try again later.';
      
      CustomToaster.show('error', 'Update Failed', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  Logger.debug('ContactDetails rendered', {
    fieldsCount: rest?.length || 0,
    isDisabled,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rest.map((item, index) => {
        Logger.debug('Rendering contact field', {
          name: item.name,
          type: item.type,
          optionsCount: item.options?.length || 0,
          value: formData[item.name],
        });
        
        return (
          <CustomInput
            ref={el => (inputRefs.current[index + 6] = el)} // Offset by 6 for firstFive fields
            key={`${item.id}-${item.name}`}
            name={item.name}
            type={item.type}
            placeholder={item.placeholder}
            value={formData[item.name] || ''}
            onChange={handleChange}
            options={item.options || []}
            disabled={item.name === 'email' || isDisabled}
            fontFamily={'Poppins-Medium'}
            fontSize={hp(1.7)}
          />
        );
      })}

      <View style={styles.saveButtonContainer}>
        <CustomButton
          title="Save Changes"
          bgColor={COLORS.PRIMARY}
          textColor={COLORS.TEXT_WHITE}
          borderColor={COLORS.PRIMARY}
          borderWidth={1}
          borderRadius={30}
          onPress={handleContactUpdate}
          disabled={uploading || isDisabled}
        />
      </View>
    </ScrollView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  saveButtonContainer: {
    margin: 10,
    padding: 10,
    marginTop: 20,
  },
});
