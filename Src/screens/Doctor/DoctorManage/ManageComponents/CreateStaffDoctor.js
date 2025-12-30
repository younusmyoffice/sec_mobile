/**
 * ============================================================================
 * SCREEN: Create Staff Doctor
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for creating new staff members for doctor's practice
 * 
 * SECURITY:
 * - Form input handling
 * - Input validation should be added
 * - Password confirmation required
 * 
 * TODO:
 * - Add input validation
 * - Add form submission API integration
 * - Add input sanitization before API call
 * - Add success/error toast notifications
 * 
 * @module CreateStaffDoctor
 */

import {View, Text, ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

// Components
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import InAppCrossBackHeader from '../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';

// Utils & Constants
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import {sanitizeInput, sanitizeFormData} from '../../../../utils/inputSanitization'; // SECURITY: Input sanitization
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection (for future API calls)

const CreateStaffDoctor = () => {
  const navigation = useNavigation();

  // STATE: Form data and validation
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  Logger.debug('CreateStaffDoctor screen initialized');

  // DATA: Form fields configuration
  const staff = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      placeholder: 'Name',
    },
    {
      id: 2,
      name: 'designation',
      type: 'select',
      placeholder: 'Designation',
      options: [
        {
          value: 'Senior Staff',
          label: 'Senior Staff',
        },
        {
          value: 'Junior Staff',
          label: 'Junior Staff',
        },
      ],
    },
    {
      id: 1,
      name: 'department',
      type: 'select',
      placeholder: 'Department',
      options: [
        {
          value: 'Senior Staff',
          label: 'Senior Staff',
        },
        {
          value: 'Junior Staff',
          label: 'Junior Staff',
        },
      ],
    },
    {
      id: 4,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
    },
    {
      id: 5,
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile No',
    },
    {
      id: 6,
      name: 'password',
      type: 'password',
      placeholder: 'Create Password',
    },
    {
      id: 7,
      name: 'cpassword',
      type: 'password',
      placeholder: 'Confirm Password',
    },
  ];

  /**
   * HANDLER: Handle form input changes
   * 
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleInputChange = (name, value) => {
    // SECURITY: Sanitize input before storing
    const sanitizedValue = sanitizeInput(value);
    Logger.debug('Input changed', { field: name, value: sanitizedValue });
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  /**
   * HANDLER: Validate form before submission
   * 
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    // VALIDATION: Check required fields
    if (!formData.name || !formData.email || !formData.mobile) {
      CustomToaster.show('error', 'Validation Error', 'Please fill in all required fields');
      Logger.warn('Form validation failed - missing required fields');
      return false;
    }

    // VALIDATION: Check password match
    if (formData.password !== formData.cpassword) {
      CustomToaster.show('error', 'Validation Error', 'Passwords do not match');
      Logger.warn('Form validation failed - passwords do not match');
      return false;
    }

    // VALIDATION: Check password length
    if (formData.password && formData.password.length < 6) {
      CustomToaster.show('error', 'Validation Error', 'Password must be at least 6 characters');
      Logger.warn('Form validation failed - password too short');
      return false;
    }

    return true;
  };

  /**
   * HANDLER: Submit staff creation form
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleStaffSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // SECURITY: Sanitize form data before API call
      const sanitizedData = sanitizeFormData(formData);

      Logger.api('POST', 'doctor/createStaff', {
        name: sanitizedData.name,
        email: sanitizedData.email,
      });

      // TODO: Replace with actual API endpoint
      // const response = await axiosInstance.post('doctor/createStaff', sanitizedData);

      Logger.info('Staff creation form submitted successfully');

      // REUSABLE TOAST: Show success message
      CustomToaster.show('success', 'Success', 'Staff created successfully');

      // Navigate to OTP verification
      navigation.navigate('createstaff-otpverify', { formData: sanitizedData });
    } catch (err) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create staff. Please try again later.';

      Logger.error('Error creating staff', {
        status: err?.response?.status,
        message: errorMessage,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * HANDLER: Navigate to OTP verification
   * 
   * This is a temporary handler until API integration is complete
   */
  const handleStaffVerify = () => {
    if (!validateForm()) {
      return;
    }

    Logger.debug('Navigating to OTP verification', { formData });
    navigation.navigate('createstaff-otpverify', { formData });
  };
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View>
          <HeaderDoctor />
        </View>
        <View style={styles.content}>
          <View>
            <InAppCrossBackHeader
              showClose={true}
              backIconSize={25}
              closeIconSize={25}
              onBackPress={() => navigation.goBack()}
            />
          </View>
          <View>
            <InAppHeader
              LftHdr={'Create Staff'}
              textcolor={COLORS.PRIMARY} // DESIGN: Use color constant
              fontsize={hp(1.8)}
              fontfamily={'Poppins-SemiBold'}
            />
          </View>
          <View>
            {staff.map((item, i) => (
              <CustomInput
                key={item.id || i} // FIX: Added key prop
                type={item.type}
                options={item.options}
                placeholder={item.placeholder}
                name={item.name}
                onChangeText={(value) => handleInputChange(item.name, value)} // SECURITY: Sanitized input
              />
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? 'Processing...' : 'Next'}
              bgColor={isLoading ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY} // DESIGN: Use color constant
              fontfamily={'Poppins-Medium'}
              borderRadius={20}
              textColor={COLORS.TEXT_WHITE} // DESIGN: Use color constant
              width={wp(50)}
              disabled={isLoading}
              onPress={handleStaffVerify}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  content: {
    padding: 15,
    gap: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default CreateStaffDoctor;
