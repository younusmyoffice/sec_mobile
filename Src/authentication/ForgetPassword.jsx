/**
 * ============================================================================
 * FORGET PASSWORD SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Password recovery screen with OTP verification and password reset.
 * 
 * FEATURES:
 * - Email input for OTP request
 * - OTP verification (6 digits)
 * - New password input
 * - Multi-step process (Send OTP → Verify OTP → Update Password)
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated password update API calls
 * - OTP verification before password change
 * - Password validation
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages (via useAuth)
 * - Form validation errors displayed inline
 * 
 * REUSABLE COMPONENTS:
 * - CustomInputs: Form input with validation
 * - CustomButton: Action button with loading state
 * - CustomOtpInput: OTP input component
 * - CustomToaster: Toast notifications (via useAuth)
 * 
 * ACCESS TOKEN:
 * - Password update uses axiosInstance (requires authentication)
 * - OTP request/verification uses axios (public endpoints)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * FLOW:
 * Step 1: Enter email → Send OTP
 * Step 2: Enter OTP → Verify OTP
 * Step 3: Enter new password → Update Password
 * 
 * @module ForgetPassword
 */

import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomInputs from '../components/customInputs/CustomInputs';
import CustomButton from '../components/customButton/CustomButton';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
import {validateField} from '../components/customInputs/FormValidation';
import {useAuth} from '../Store/Authentication';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const ForgetPassword = () => {
  const {
    ForgetPassword,
    showOtpField,
    handleVerifyOtp,
    handleUpdatePassword,
    otpverified,
    setIsLoginValid,
  } = useAuth();

  const [forgetpassword, setForgetPassword] = useState({
    email: '',
  });
  
  const [verifyEmail, setverifyEmail] = useState({
    activation_code: '',
    email: forgetpassword.email,
  });

  const [ChangePassword, setPasswordChange] = useState({
    email: forgetpassword.email,
    new_password: '',
    activation_code: '',
  });
  
  const [errors, setErrors] = useState({});

  /**
   * Handle form field changes
   * SECURITY: Validates input using FormValidation
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = useCallback(
    (name, value) => {
      Logger.debug('ForgetPassword field changed', { name, hasValue: !!value });
      
      setForgetPassword(prevState => ({
        ...prevState,
        [name]: value,
      }));
      
      // Update email in verifyEmail and ChangePassword states
      setverifyEmail(prev => ({
        ...prev,
        email: value,
      }));
      
      setPasswordChange(prev => ({
        ...prev,
        email: value,
      }));
      
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      setIsLoginValid(
        Object.values({...errors, [name]: error}).every(err => !err),
      );
    },
    [errors, setIsLoginValid],
  );

  /**
   * Handle password field change
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handlePasswordChange = (name, value) => {
    Logger.debug('Password field changed', { name, hasValue: !!value });
    
    setPasswordChange(prev => ({
      ...prev,
      new_password: value,
    }));
  };

  /**
   * Handle button press based on current step
   * SECURITY: Validates data before each step
   */
  const handleButtonPress = () => {
    if (!showOtpField) {
      // Step 1: Send OTP
      Logger.info('Sending OTP for password reset', {
        email: forgetpassword.email,
      });
      
      if (!forgetpassword.email) {
        Logger.warn('Email required for OTP request');
        return;
      }
      
      ForgetPassword(forgetpassword);
    } else if (!otpverified) {
      // Step 2: Verify OTP
      Logger.info('Verifying OTP for password reset', {
        email: verifyEmail.email,
        hasOtp: !!verifyEmail.activation_code,
      });
      
      if (!verifyEmail.activation_code || verifyEmail.activation_code.length !== 6) {
        Logger.warn('Valid 6-digit OTP required');
        return;
      }
      
      handleVerifyOtp(verifyEmail);
    } else {
      // Step 3: Update Password
      Logger.info('Updating password', {
        email: forgetpassword.email,
        hasNewPassword: !!ChangePassword.new_password,
      });
      
      if (!ChangePassword.new_password || ChangePassword.new_password.length < 6) {
        Logger.warn('Password must be at least 6 characters');
        return;
      }
      
      const passwordData = {
        email: forgetpassword.email,
        new_password: ChangePassword.new_password,
        activation_code: ChangePassword.activation_code,
      };
      
      Logger.debug('Password update data prepared', {
        email: passwordData.email,
        hasPassword: !!passwordData.new_password,
        hasOtp: !!passwordData.activation_code,
      });
      
      handleUpdatePassword(passwordData);
    }
  };

  /**
   * Get button title based on current step
   */
  const getButtonTitle = () => {
    if (!showOtpField) return 'Send Otp';
    if (!otpverified) return 'Verify Otp';
    return 'Update Password';
  };

  Logger.debug('ForgetPassword component rendered', {
    showOtpField,
    otpverified,
    hasEmail: !!forgetpassword.email,
  });

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={authenticationStyle.container}>
            <View>
              <Image
                style={authenticationStyle.logo}
                source={require('../assets/labellogo.png')}
              />
            </View>
            <Text style={authenticationStyle.signUp}>Send Otp</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={authenticationStyle.inputs}>
              {!showOtpField ? (
                // Step 1: Email Input
                <>
                  <CustomInputs
                    type={'email'}
                    name={'email'}
                    value={forgetpassword['email']}
                    onChange={handleChange}
                    placeholder={'Email Address'}
                    fontSize={20}
                  />
                  {errors['email'] && (
                    <Text style={styles.errorText}>{errors['email']}</Text>
                  )}
                </>
              ) : !otpverified ? (
                // Step 2: OTP Input
                <>
                  <CustomOtpInput
                    numberOfDigits={6}
                    onTextChange={text => {
                      setverifyEmail(prev => ({...prev, activation_code: text}));
                      setPasswordChange(prev => ({...prev, activation_code: text}));
                    }}
                    theme={{
                      containerStyle: authenticationStyle.container,
                      pinCodeContainerStyle: authenticationStyle.pinCodeContainer,
                      pinCodeTextStyle: authenticationStyle.pinCodeText,
                      focusStickStyle: authenticationStyle.focusStick,
                      focusedPinCodeContainerStyle:
                        authenticationStyle.focusedPinCodeContainerStyle,
                    }}
                  />
                </>
              ) : (
                // Step 3: New Password Input
                <CustomInputs
                  name={'new_password'}
                  placeholder={'New Password'}
                  type={'password'}
                  fontSize={20}
                  value={ChangePassword['new_password']}
                  onChange={handlePasswordChange}
                />
              )}

              <CustomButton
                title={getButtonTitle()}
                bgColor={COLORS.PRIMARY}
                borderRadius={25}
                textColor={COLORS.TEXT_WHITE}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={handleButtonPress}
                loading={true}
              />
            </View>
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
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  mainContainer: {
    gap: 50,
  },
  formContainer: {
    gap: 25,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
});

export default ForgetPassword;
