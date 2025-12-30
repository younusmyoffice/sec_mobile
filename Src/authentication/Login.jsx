/**
 * ============================================================================
 * LOGIN SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * User authentication screen with email/mobile and password login.
 * Supports role-based login (Patient, Doctor, Admin, Clinic, Diagnostic).
 * 
 * FEATURES:
 * - Email or mobile number login
 * - Password authentication
 * - Role-based authentication flow
 * - Form validation
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls (after login)
 * - Input validation and sanitization (handled by CustomInputs and useAuth)
 * - Role-based access control
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages (via useAuth)
 * - Form validation errors displayed inline
 * 
 * REUSABLE COMPONENTS:
 * - CustomInputs: Form input with validation
 * - CustomButton: Action button with loading state
 * - CustomToaster: Toast notifications (via useAuth)
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance after login (reusable throughout app)
 * - Stored securely in AsyncStorage (handled by useAuth)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet from AuthenticationStyle.js
 * 
 * NAVIGATION:
 * - Navigates to role-specific dashboard after successful login
 * - Navigates to ProfileComplete for incomplete profiles
 * 
 * @module Login
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
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCommon} from '../Store/CommonContext';
import {validateField} from '../components/customInputs/FormValidation';
import {useAuth} from '../Store/Authentication';
import Logger from '../constants/logger';
import { COLORS } from '../constants/colors';

const Login = () => {
  const {handleLogin, isLogging, isLoginValid, setIsLoginValid} = useAuth();
  const routes = useRoute();
  const {role_id} = routes.params || {}; // Safe destructuring with fallback
  const navigation = useNavigation();

  const [login, setLogin] = useState({
    email: '',
    password: '',
    login_with_email: true,
    role_id: role_id || null, // Safe fallback to null
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
      Logger.debug('Login field changed', { name, hasValue: !!value });
      
      setLogin(prevState => ({
        ...prevState,
        [name]: value,
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
   * Handle login button press
   * SECURITY: Validates form before submitting
   */
  const handleLoginPress = () => {
    Logger.debug('Login button pressed', {
      hasEmail: !!login.email,
      hasPassword: !!login.password,
      roleId: login.role_id || role_id,
      isFormValid: isLoginValid,
    });

    // SECURITY: Form validation check
    if (!isLoginValid) {
      Logger.warn('Login form validation failed');
      return;
    }

    // Use role_id from route params if available, otherwise use login state
    const finalRoleId = role_id || login.role_id;
    
    Logger.info('Initiating login', {
      email: login.email,
      roleId: finalRoleId,
    });

    handleLogin(login, finalRoleId);
  };

  /**
   * Login form fields configuration
   */
  const loginFields = [
    {
      id: 1,
      label: 'Mobile No',
      name: 'email',
      type: 'email',
      placeholder: 'Mobile No Or Email',
    },
    {
      id: 2,
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
  ];

  Logger.debug('Login component rendered', {
    roleId: role_id || login.role_id,
    isLogging,
    isLoginValid,
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
            <Text style={authenticationStyle.signUp}>Log in</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={authenticationStyle.inputs}>
              {loginFields.map(field => (
                <React.Fragment key={field.id}>
                  <CustomInputs
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={login[field.name]}
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
              
              <CustomButton
                title="Log In"
                bgColor={COLORS.PRIMARY}
                borderRadius={25}
                textColor={COLORS.TEXT_WHITE}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={handleLoginPress}
                loading={true}
                isLogging={isLogging}
                isFormValid={!isLoginValid}
              />
            </View>
            
            <View style={styles.footerContainer}>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('ForgetPassword')}>
                <Text style={styles.forgotText}>Forgot Password</Text>
              </TouchableWithoutFeedback>
              
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  i Don't have an account
                </Text>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                  <Text style={styles.registerLink}>Create Account</Text>
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
  forgotText: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  registerText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 19,
  },
  registerLink: {
    fontSize: 19,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
});

export default Login;
