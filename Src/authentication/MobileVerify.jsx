/**
 * ============================================================================
 * MOBILE VERIFY SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for verifying mobile number with OTP input.
 * 
 * FEATURES:
 * - 6-digit OTP input
 * - Resend OTP functionality
 * - Mobile verification confirmation
 * 
 * SECURITY:
 * - OTP validation
 * 
 * ERROR HANDLING:
 * - Ready for CustomToaster integration
 * 
 * REUSABLE COMPONENTS:
 * - CustomOtpInput: OTP input component
 * - CustomButton: Action button
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * NOTE:
 * This is a utility/placeholder screen. OTP verification API integration
 * should be implemented based on specific use case requirements.
 * 
 * @module MobileVerify
 */

import {View, Text, ScrollView, SafeAreaView, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomButton from '../components/customButton/CustomButton';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const MobileVerify = () => {
  const [mobileotp, setMobileOtp] = useState('');

  /**
   * Handle continue button press
   * TODO: Implement OTP verification API call
   */
  const handleContinue = () => {
    Logger.debug('Continue button pressed', {
      hasOtp: !!mobileotp,
      otpLength: mobileotp?.length || 0,
    });

    // SECURITY: Validate OTP
    if (!mobileotp || mobileotp.length !== 6) {
      Logger.warn('Invalid OTP format');
      return;
    }

    // TODO: Implement OTP verification API call
    Logger.warn('OTP verification functionality not yet implemented');
  };

  /**
   * Handle resend OTP
   * TODO: Implement resend OTP API call
   */
  const handleResendOtp = () => {
    Logger.debug('Resend OTP requested');
    
    // TODO: Implement resend OTP API call
    Logger.warn('Resend OTP functionality not yet implemented');
  };

  Logger.debug('MobileVerify component rendered');

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={[authenticationStyle.container, styles.headerContainer]}>
            <View>
              <Image
                style={authenticationStyle.logo}
                source={require('../assets/labellogo.png')}
              />
            </View>
            <Text style={authenticationStyle.signUp}>
              Please Enter Mobile No
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.otpContainer}>
              <CustomOtpInput
                numberOfDigits={6}
                onTextChange={text => setMobileOtp(text)}
                theme={{
                  containerStyle: authenticationStyle.container,
                  pinCodeContainerStyle: authenticationStyle.pinCodeContainer,
                  pinCodeTextStyle: authenticationStyle.pinCodeText,
                  focusStickStyle: authenticationStyle.focusStick,
                  focusedPinCodeContainerStyle:
                    authenticationStyle.focusedPinCodeContainerStyle,
                }}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Continue"
                bgColor={COLORS.PRIMARY}
                fontfamily={'Poppins-Medium'}
                borderRadius={20}
                textColor={COLORS.TEXT_WHITE}
                width={wp(50)}
                onPress={handleContinue}
              />
            </View>
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendText}>
                Resend Code: <Text style={styles.timerText}>50</Text>
              </Text>
            </TouchableOpacity>
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
    flexDirection: 'column',
    gap: 10,
    padding: 15,
  },
  headerContainer: {
    marginBottom: '50%',
  },
  formContainer: {
    gap: 1,
  },
  otpContainer: {
    padding: 15,
  },
  buttonContainer: {
    alignSelf: 'center',
    padding: 15,
  },
  footerContainer: {
    gap: 30,
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

export default MobileVerify;
