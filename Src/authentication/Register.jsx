/**
 * ============================================================================
 * REGISTER SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * User registration screen with mobile number, email, and password.
 * Supports role-based registration (Patient, Doctor, Admin, Clinic, Diagnostic).
 * 
 * FEATURES:
 * - Mobile number with dialing code selection
 * - Email address input
 * - Password input with validation
 * - Role-based registration flow
 * 
 * SECURITY:
 * - Uses axios for registration API (public endpoint)
 * - Input validation and sanitization (handled by CustomInputs and useAuth)
 * - XSS and SQL injection detection (handled by useAuth)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages (via useAuth)
 * - Form validation errors displayed inline
 * 
 * REUSABLE COMPONENTS:
 * - CustomInputs: Form input with validation
 * - CustomButton: Action button with loading state
 * - CombinedMobileInput: Mobile number with dialing code
 * - CustomToaster: Toast notifications (via useAuth)
 * 
 * ACCESS TOKEN:
 * - Registration doesn't require authentication
 * - After successful registration, user needs to verify email before login
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * NAVIGATION:
 * - Navigates to VerifyEmail after successful registration
 * - Navigates back to Login screen
 * 
 * @module Register
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
import CombinedMobileInput from '../components/customInputs/CombinedMobileInput';
import {useNavigation, useRoute} from '@react-navigation/native';
import {validateField} from '../components/customInputs/FormValidation';
import {useCommon} from '../Store/CommonContext';
import {useAuth} from '../Store/Authentication';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const Register = () => {
  const {handleRegister, isRegisterValid, setIsRegisterValid, isLogging} = useAuth();

  const navigation = useNavigation();
  const route = useRoute();
  const {roleId} = route.params || {};

  const [errors, setErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    mobile: 0,
    email: '',
    password: '',
    dialing_code: '91', // Default to India's dialing code
    role_id: roleId,
    added_by: 'self', // Required field for backend
  });

  /**
   * Handle form field changes
   * SECURITY: Validates input using FormValidation
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = useCallback(
    (name, value) => {
      Logger.debug('Register field changed', { name, hasValue: !!value });
      
      setRegisterData(prevState => ({
        ...prevState,
        [name]: value,
      }));
      
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      setIsRegisterValid(
        Object.values({...errors, [name]: error}).every(err => !err),
      );
    },
    [errors, setIsRegisterValid],
  );

  /**
   * Handle register button press
   * SECURITY: Validates form before submitting
   */
  const handleRegisterPress = () => {
    Logger.debug('Register button pressed', {
      hasEmail: !!registerData.email,
      hasPassword: !!registerData.password,
      hasMobile: !!registerData.mobile,
      roleId: registerData.role_id,
      isFormValid: isRegisterValid,
    });

    // SECURITY: Form validation check
    if (!isRegisterValid) {
      Logger.warn('Register form validation failed');
      return;
    }

    Logger.info('Initiating registration', {
      email: registerData.email,
      roleId: registerData.role_id,
    });

    handleRegister(registerData, roleId);
  };

  /**
   * Register form fields configuration
   */
  const registerField = [
    {
      id: 1,
      label: 'Email Address',
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
    },
    {
      id: 2,
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
  ];

  Logger.debug('Register component rendered', {
    roleId,
    isLogging,
    isRegisterValid,
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
            <Text style={authenticationStyle.signUp}>Sign Up</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={authenticationStyle.inputs}>
              <View>
                {/* Mobile Number with Dialing Code */}
                <CombinedMobileInput
                  label="Mobile Number"
                  dialingCodeValue={registerData.dialing_code}
                  mobileValue={registerData.mobile}
                  onDialingCodeChange={handleChange}
                  onMobileChange={handleChange}
                  onValidationChange={(field, error) => {
                    setErrors(prev => ({...prev, [field]: error}));
                    setIsRegisterValid(
                      Object.values({...errors, [field]: error}).every(err => !err),
                    );
                  }}
                  fontSize={20}
                />
                
                {/* Email and Password Fields */}
                {registerField.map(field => (
                  <React.Fragment key={field.id}>
                    <CustomInputs
                      label={field.label}
                      type={field.type}
                      name={field.name}
                      value={registerData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      options={field.options}
                      maxLength={field.maxLength}
                      logo={null}
                      fontSize={20}
                      eyeicon={field.logo}
                    />
                    {errors[field.name] && (
                      <Text style={styles.errorText}>{errors[field.name]}</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
              
              <CustomButton
                title="Register"
                bgColor={COLORS.PRIMARY}
                borderRadius={25}
                textColor={COLORS.TEXT_WHITE}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={handleRegisterPress}
                loading={true}
                isFormValid={!isRegisterValid}
                isLogging={isLogging}
              />
            </View>
            
            <View style={styles.footerContainer}>
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  i have an account
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Login', {role_id: roleId})
                  }>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableWithoutFeedback>
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
    gap: 50,
  },
  formContainer: {
    gap: 25,
  },
  footerContainer: {
    gap: 30,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  loginText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 19,
  },
  loginLink: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
});

export default Register;
