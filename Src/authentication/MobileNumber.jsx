/**
 * ============================================================================
 * MOBILE NUMBER SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for entering mobile number (placeholder/utility screen).
 * 
 * FEATURES:
 * - Mobile number input
 * - Continue button
 * 
 * SECURITY:
 * - Input validation
 * 
 * REUSABLE COMPONENTS:
 * - CustomInput: Form input component
 * - CustomButton: Action button
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * NOTE:
 * This is a utility/placeholder screen. Functionality should be implemented
 * based on specific use case requirements.
 * 
 * @module MobileNumber
 */

import {View, Text, ScrollView, SafeAreaView, Image, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomButton from '../components/customButton/CustomButton';
import CustomInput from '../components/customInputs/CustomInputs';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const MobileNumber = () => {
  const [number, setNumber] = useState({
    mobile: '',
  });

  /**
   * Handle mobile number change
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = useCallback((name, value) => {
    Logger.debug('Mobile number changed', { name, value });
    
    setNumber(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  /**
   * Handle continue button press
   * TODO: Implement navigation or API call based on requirements
   */
  const handleContinue = () => {
    Logger.debug('Continue button pressed', {
      hasMobile: !!number.mobile,
      mobile: number.mobile,
    });
    
    // TODO: Implement navigation or API call
    Logger.warn('Continue functionality not yet implemented');
  };

  Logger.debug('MobileNumber component rendered');

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
            <View style={styles.inputContainer}>
              <CustomInput
                placeholder="Mobile No"
                fontSize={20}
                type="number"
                onChange={handleChange}
                name="mobile"
                value={number.mobile}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Continue"
                bgColor={COLORS.PRIMARY}
                borderRadius={25}
                textColor={COLORS.TEXT_WHITE}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={handleContinue}
              />
            </View>
          </View>
          
          <View style={styles.footerContainer}>
            <Text style={styles.forgotText}>Forgot Password</Text>
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
  },
  headerContainer: {
    marginBottom: '50%',
  },
  formContainer: {
    gap: 1,
  },
  inputContainer: {
    padding: 15,
  },
  buttonContainer: {
    padding: 15,
  },
  footerContainer: {
    gap: 30,
  },
  forgotText: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
});

export default MobileNumber;
