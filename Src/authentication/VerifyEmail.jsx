/**
 * ============================================================================
 * VERIFY EMAIL SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Email verification screen with OTP input after user registration.
 * 
 * FEATURES:
 * - 6-digit OTP input
 * - Resend OTP functionality
 * - Email verification confirmation
 * 
 * SECURITY:
 * - Uses axios for verification API (public endpoint)
 * - OTP validation
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomOtpInput: OTP input component
 * - CustomButton: Action button
 * - CustomToaster: Toast notifications
 * 
 * ACCESS TOKEN:
 * - Email verification uses axios (public endpoint, no auth required)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * NAVIGATION:
 * - Navigates to Login after successful verification
 * - Passes role_id to Login screen
 * 
 * @module VerifyEmail
 */

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomButton from '../components/customButton/CustomButton';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {baseUrl} from '../utils/baseUrl';
import CustomToaster from '../components/customToaster/CustomToaster';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const VerifyEmail = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const {roleid, email} = routes.params || {};
  
  const [verifyEmail, setverifyEmail] = useState({
    activation_code: '',
    email: email || '',
  });

  /**
   * Handle email verification
   * SECURITY: Validates OTP before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handleVerifyEmail = async () => {
    Logger.debug('Email verification initiated', {
      email: verifyEmail.email,
      hasOtp: !!verifyEmail.activation_code,
      otpLength: verifyEmail.activation_code?.length || 0,
      roleId: roleid,
    });

    // SECURITY: Validate OTP
    if (!verifyEmail.activation_code || verifyEmail.activation_code.length !== 6) {
      Logger.warn('Invalid OTP format');
      CustomToaster.show('error', 'Invalid OTP', 'Please enter a valid 6-digit OTP code.');
      return;
    }

    try {
      Logger.api('POST', 'auth/verifyEmail', verifyEmail);

      const response = await axios.post(
        `${baseUrl}auth/verifyEmail`,
        verifyEmail,
      );

      Logger.info('Email verified successfully', {
        hasResponse: !!response?.data,
      });

      CustomToaster.show('success', 'Email Verified', 'Your email has been verified successfully.');
      
      // Navigate to Login with role_id
      navigation.navigate('Login', {role_id: roleid});
    } catch (error) {
      Logger.error('Email verification failed', error);
      
      const errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Email verification failed. Please try again.';
      
      CustomToaster.show('error', 'Verification Failed', errorMessage);
    }
  };

  /**
   * Handle resend OTP
   * ERROR HANDLING: Comprehensive error handling
   */
  const handlResendOtp = async () => {
    Logger.debug('Resend OTP requested', { email });

    if (!email) {
      Logger.warn('Email required for OTP resend');
      CustomToaster.show('error', 'Error', 'Email address is required.');
      return;
    }

    try {
      Logger.api('POST', 'auth/resendCode', { email });

      const response = await axios.post(
        `${baseUrl}auth/resendCode`,
        {email: email},
      );

      Logger.info('OTP resent successfully', {
        hasResponse: !!response?.data,
      });

      CustomToaster.show('success', 'Code Sent Successfully', 'A new verification code has been sent to your email.');
    } catch (error) {
      Logger.error('Resend OTP failed', error);
      
      const errorMessage = error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to resend code. Please try again.';
      
      CustomToaster.show('error', 'Resend Failed', errorMessage);
    }
  };

  Logger.debug('VerifyEmail component rendered', {
    email,
    roleId: roleid,
    hasOtp: !!verifyEmail.activation_code,
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

            <Text style={authenticationStyle.signUp}>Verify Email</Text>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                We've sent an email to
                <Text style={styles.emailText}> {email}</Text> to verify you
                email address and activate your account. the link in the email
                will expire in 30 minutes.
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/email.png')}
              style={styles.emailImage}
            />
          </View>

          <View style={styles.formContainer}>
            <CustomOtpInput
              numberOfDigits={6}
              onTextChange={text =>
                setverifyEmail({...verifyEmail, activation_code: text})
              }
              theme={{
                containerStyle: authenticationStyle.container,
                pinCodeContainerStyle: authenticationStyle.pinCodeContainer,
                pinCodeTextStyle: authenticationStyle.pinCodeText,
                focusStickStyle: authenticationStyle.focusStick,
                focusedPinCodeContainerStyle:
                  authenticationStyle.focusedPinCodeContainerStyle,
              }}
            />

            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <CustomButton
                  title="Continue"
                  bgColor={COLORS.PRIMARY}
                  borderRadius={25}
                  textColor={COLORS.TEXT_WHITE}
                  fontWeight={'bold'}
                  fontSize={15}
                  padding={8}
                  onPress={handleVerifyEmail}
                />
              </View>

              <View>
                <TouchableOpacity onPress={handlResendOtp}>
                  <Text style={styles.resendText}>
                    Resend Code: <Text style={styles.timerText}>50</Text>
                  </Text>
                </TouchableOpacity>
              </View>
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
    gap: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    padding: 10,
  },
  messageText: {
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
  emailText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  formContainer: {
    gap: 25,
  },
  buttonContainer: {
    gap: 40,
  },
  buttonWrapper: {
    padding: 10,
  },
  resendText: {
    color: COLORS.PRIMARY,
    fontSize: 19,
    textAlign: 'center',
  },
  timerText: {
    color: COLORS.TEXT_PRIMARY,
  },
});

export default VerifyEmail;
