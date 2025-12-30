/**
 * ============================================================================
 * SECURITY: Authentication Provider with Session Management
 * ============================================================================
 * 
 * INTEGRATED SECURITY FEATURES:
 * 1. Session timeout - Auto-logout on inactivity
 * 2. Input sanitization - XSS & SQL injection prevention
 * 3. Token management - Secure storage and retrieval
 * 4. Error handling - Comprehensive error management
 * 
 * SECURITY NOTES:
 * - Session automatically times out after inactivity
 * - All user inputs are sanitized before processing
 * - Tokens stored securely in AsyncStorage
 * - Invalid tokens cleared automatically
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CustomToaster from '../components/customToaster/CustomToaster';
import { duration } from 'moment';
import axiosInstance from '../utils/axiosInstance';

// SECURITY: Import session timeout and input sanitization
import {
  startSessionTimeout,
  resetSessionTimeout,
  clearSession,
  updateLastActivity,
} from '../utils/sessionTimeout';
import { sanitizeFormData, detectXSS, detectSQLInjection } from '../utils/inputSanitization';

export const Authentication = createContext({});

export const useAuth = () => {
  const auth = useContext(Authentication);
  if (!auth) {
    throw new Error(' error error ');
  }
  return auth;
};

const AuthenticationProvider = ({ children }) => {
  const navigation = useNavigation();
  const [isRegisterValid, setIsRegisterValid] = useState(false);
  const [isLoginValid, setIsLoginValid] = useState(false);
  const [isLogging, setisLogging] = useState(false);
  const [showOtpField, setshowOtpField] = useState(false);
  const [otpverified, setOtpVerified] = useState(false);
  const [userId, setUserId] = useState();
  const [doctorDetails, setDoctorDetails] = useState();
  
  // SECURITY: Session timeout state
  const [userRoleId, setUserRoleId] = useState(null);
  const [sessionTimeoutCleanup, setSessionTimeoutCleanup] = useState(null);

  // Register Function
  const handleRegister = async (registerData, roleId) => {
    console.log("calling")
    if (!isRegisterValid) return;
    
    // SECURITY: Sanitize user input to prevent XSS and SQL injection
    const sanitizedData = sanitizeFormData(registerData);
    
    // SECURITY: Detect XSS attempts
    if (detectXSS(registerData.email) || detectXSS(registerData.password)) {
      CustomToaster.show('error', 'Security Alert', 'Invalid characters detected in input');
      return;
    }
    
    // SECURITY: Detect SQL injection attempts
    if (detectSQLInjection(registerData.email)) {
      CustomToaster.show('error', 'Security Alert', 'Invalid input detected');
      return;
    }
    
    console.log('mera button click ho gya');
    try {
      setisLogging(true);

      console.log('mai try kr rha hu');
      const response = await axios.post(
        `${baseUrl}auth/register`,
        sanitizedData, // SECURITY: Use sanitized data
      );
      navigation.navigate('VerifyEmail', {
        roleid: roleId,
        email: registerData.email,
      });
      setisLogging(false);

      console.log('registered : ', response.data);
      CustomToaster.show('success', 'Register Successful', {
        duration: 2000,
      });
      console.log(registerData);
    } catch (error) {
      setisLogging(false);
      
      // Handle specific error cases
      let errorMessage = 'Registration Failed';
      let errorDetails = '';
      
      if (error.response?.status === 403) {
        if (error.response?.data?.error === 'EMAIL_EXISTS') {
          errorMessage = 'Email Already Exists';
          errorDetails = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.response?.data?.error === 'INVALID_INPUT') {
          errorMessage = 'Invalid Registration Data';
          errorDetails = 'Please check your registration details. Make sure you selected the correct user type (Doctor, Patient, etc.).';
        } else {
          errorMessage = 'Access Forbidden';
          errorDetails = error.response?.data?.error || 'Please check your registration details.';
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid Registration Data';
        errorDetails = error.response?.data?.error || 'Please check all required fields.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server Error';
        errorDetails = 'Please try again later or contact support.';
      } else {
        errorMessage = 'Registration Failed';
        errorDetails = error.response?.data?.error || error.message || 'Please try again.';
      }
      
      CustomToaster.show('error', errorMessage, errorDetails, {
        duration: 3000,
      });
      
      console.log('Registration Error Details:', {
        status: error.response?.status,
        error: error.response?.data?.error,
        message: error.message,
        registerData: registerData,
        roleMapping: {
          '2': 'ADMIN',
          '3': 'DOCTOR', 
          '4': 'DIAGNOSTIC',
          '5': 'PATIENT',
          '6': 'CLINIC'
        }
      });
      console.error('Full error object:', error);
    }
  };

  // Login Function
  // const handleLogin = async (login, role_id, email) => {
  //   console.log('Button clicked');
  //   if (!isLoginValid) return;
  //   await AsyncStorage.clear();
  //   try {
  //     setisLogging(true);
  //     console.log('Please wait...');
  //     const response = await axios.post(`${baseUrl}auth/login`, login);

  //     console.log('response', response);

  //     if (
  //       response?.data?.response?.access_token &&
  //       response?.data?.response?.suid
  //     ) {
  //       await AsyncStorage.setItem(
  //         'access_token',
  //         response?.data?.response?.access_token,
  //       );
  //       await AsyncStorage.setItem(
  //         'suid',
  //         JSON.stringify(response?.data?.response?.suid),
  //       );
  //     }

  //     if (response?.data?.response?.body === 'INCOMPLETE_PROFILE') {
  //       navigation.navigate('ProfileComplete', {
  //         email: login.email,
  //         role_id: role_id,
  //       });
  //     } else {
  //       switch (role_id) {
  //         case 6:
  //           navigation.navigate('ClinicNavigation');
  //           setisLogging(false);

  //           break;
  //         case 5:
  //           navigation.navigate('PatientNavigation');
  //           setisLogging(false);

  //           break;
  //         case 3:
  //           navigation.navigate('DoctorNavigation');
  //           setisLogging(false);

  //           break;
  //         case 4:
  //           navigation.replace('DiagnosticNavigation');
  //           setisLogging(false);

  //           break;
  //         case 2:
  //           navigation.replace('AdminNavigation');
  //           setisLogging(false);

  //           break;
  //         default:
  //           console.log('Navigation not defined for this role.');
  //       }
  //     }
  //     const token = await AsyncStorage.getItem('access_token');
  //     const suidString = await AsyncStorage.getItem('suid');
  //     const suid = suidString ? JSON.parse(suidString) : null;
  //     setUserId(suid);
  //     console.log('token retriived', token);
  //     console.log('suid', suid);
  //   } catch (error) {
  //     setisLogging(false);

  //     console.log('Error occurred');
  //     console.error('Error:', error);
  //   }
  // };
  const handleLogin = async login => {
    console.log('Button clicked');

    if (!isLoginValid) return;

    // Clear only authentication-related items, not all AsyncStorage
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('suid');
      await AsyncStorage.removeItem('role_id');
      console.log('🧹 Cleared previous authentication data');
    } catch (clearError) {
      console.log('⚠️ Error clearing previous auth data:', clearError);
    }

    try {
      setisLogging(true);
      console.log('Logging in...');

      console.log('🔐 Login Request Details:');
      console.log('  - URL:', `${baseUrl}auth/login`);
      console.log('  - Payload:', login);
      console.log('  - Base URL:', baseUrl);
      
      const response = await axios.post(`${baseUrl}auth/login`, login);
      console.log('📡 Full Login Response:', response?.data);

      // Check if login was successful
      const userData = response?.data?.response;
      console.log('👤 User Data received:', userData);
      console.log('🔑 Role ID from API:', userData?.role_id, 'type:', typeof userData?.role_id);
      console.log('🔑 Role ID from login form:', login.role_id, 'type:', typeof login.role_id);
      
      // Handle incomplete profiles FIRST - before token validation
      const isIncompleteProfile = userData?.body === 'INCOMPLETE_PROFILE' || 
                                 response?.data?.body === 'INCOMPLETE_PROFILE' ||
                                 response?.data?.response?.body === 'INCOMPLETE_PROFILE';
      
      if (isIncompleteProfile) {
        console.log('📋 Profile incomplete, navigating to ProfileComplete');
        console.log('📧 Email:', userData?.data?.email || userData?.email || login.email);
        console.log('🔢 Role ID from API:', userData?.data?.role_id || userData?.role_id, 'type:', typeof (userData?.data?.role_id || userData?.role_id));
        console.log('🔢 Sec Role ID from API:', userData?.data?.sec_role_id || userData?.sec_role_id, 'type:', typeof (userData?.data?.sec_role_id || userData?.sec_role_id));
        console.log('🔢 Role ID from login form:', login.role_id, 'type:', typeof login.role_id);
        console.log('📋 Response body:', response?.data?.body);
        console.log('📋 UserData body:', userData?.body);
        
        // FIX: Use sec_role_id if role_id is null (for clinic users)
        // For clinic users, API returns role_id: null but sec_role_id: 6
        const apiRoleId = userData?.data?.role_id || userData?.role_id;
        const apiSecRoleId = userData?.data?.sec_role_id || userData?.sec_role_id;
        
        // Use role_id if available, otherwise use sec_role_id, finally fallback to login form
        const finalRoleId = apiRoleId || apiSecRoleId || login.role_id;
        console.log('🔢 Final Role ID being passed:', finalRoleId, 'type:', typeof finalRoleId);
        console.log('🔢 Used sec_role_id?', !apiRoleId && !!apiSecRoleId);
        
        // FIX: Store access token and suid for incomplete profiles so they can complete profile
        // Access token and suid are in userData.data for incomplete profiles
        const incompleteProfileData = userData?.data || userData;
        
        if (incompleteProfileData?.access_token && incompleteProfileData?.suid) {
          try {
            const normalizedToken =
              typeof incompleteProfileData.access_token === 'string'
                ? incompleteProfileData.access_token.replace(/^Bearer\s+/i, '').trim()
                : '';
            
            await AsyncStorage.setItem('access_token', normalizedToken || 'token');
            
            if (incompleteProfileData.suid !== undefined && incompleteProfileData.suid !== null && incompleteProfileData.suid !== 'token') {
              const suidValue = JSON.stringify(incompleteProfileData.suid);
              await AsyncStorage.setItem('suid', suidValue);
            }
            
            // Store role_id using sec_role_id if role_id is null
            if (finalRoleId !== undefined && finalRoleId !== null && finalRoleId !== 'token') {
              const roleIdValue = JSON.stringify(finalRoleId);
              await AsyncStorage.setItem('role_id', roleIdValue);
            }
            
            console.log('✅ Stored auth data for incomplete profile');
          } catch (storageError) {
            console.error('❌ Error storing auth data for incomplete profile:', storageError);
          }
        }
        
        navigation.navigate('ProfileComplete', {
          email: userData?.data?.email || userData?.email || login.email,
          role_id: finalRoleId,
        });
        setisLogging(false);
        return;
      }
      
      // Enhanced validation - only proceed if we have valid authentication data
      // For incomplete profiles, access_token and suid are in userData.data
      const actualUserData = userData?.data || userData;
      const isValidToken = actualUserData?.access_token && 
                          typeof actualUserData.access_token === 'string' && 
                          actualUserData.access_token.trim().length > 0 &&
                          actualUserData.access_token !== 'token';
      
      const isValidSuid = actualUserData?.suid && 
                         (typeof actualUserData.suid === 'number' || typeof actualUserData.suid === 'string') &&
                         actualUserData.suid !== 'null' &&
                         actualUserData.suid !== 'undefined';
      
      if (!isValidToken || !isValidSuid) {
        console.log('❌ Login failed - invalid authentication data');
        console.log('❌ access_token valid:', isValidToken);
        console.log('❌ suid valid:', isValidSuid);
        console.log('❌ access_token:', userData?.access_token ? 'Present' : 'Missing');
        console.log('❌ suid:', userData?.suid ? 'Present' : 'Missing');
        console.log('❌ Error message:', userData?.message || 'INVALID_USER');
        
        // Show error alert and stay on login page
        Alert.alert(
          'Login Failed',
          userData?.message || 'Invalid credentials. Please check your email and password.',
          [{ text: 'OK' }]
        );
        
        CustomToaster.show(
          'error',
          'Login Failed',
          userData?.message || 'Invalid credentials. Please try again.',
          { duration: 3000 }
        );
        
        setisLogging(false);
        return; // Exit without navigation
      }
      
      console.log('✅ Login successful - valid authentication data received');
      
      // HCF Admin specific logging
      if (actualUserData?.role_id === 2 || actualUserData?.sec_role_id === 2 || login.role_id === 2) {
        console.log('🏥 HCF Admin Login Detected:');
        console.log('  - suid (hcf_id):', actualUserData?.suid);
        console.log('  - hcf_id:', actualUserData?.hcf_id);
        console.log('  - role_id:', actualUserData?.role_id);
        console.log('  - sec_role_id:', actualUserData?.sec_role_id);
        console.log('  - For HCF Admin, suid should equal hcf_id:', actualUserData?.suid === actualUserData?.hcf_id);
      }
      
      // Clinic specific logging
      const clinicRoleId = actualUserData?.role_id || actualUserData?.sec_role_id;
      if (clinicRoleId === 6 || login.role_id === 6) {
        console.log('🏥 Clinic Login Detected:');
        console.log('  - suid:', actualUserData?.suid);
        console.log('  - role_id:', actualUserData?.role_id);
        console.log('  - sec_role_id:', actualUserData?.sec_role_id);
        console.log('  - email:', actualUserData?.email);
      }

      // Store authentication details
      console.log('💾 Storing auth data:');
      console.log('  - access_token:', actualUserData?.access_token ? 'Present' : 'Missing');
      console.log('  - suid:', actualUserData?.suid);
      console.log('  - role_id:', actualUserData?.role_id, 'type:', typeof actualUserData?.role_id);
      console.log('  - sec_role_id:', actualUserData?.sec_role_id, 'type:', typeof actualUserData?.sec_role_id);
      
      // Determine final suid per role
      // Default: prefer suid; fallback to staff_id (diagnostic), then user_id
      let finalSuid =
        actualUserData?.suid !== undefined && actualUserData?.suid !== null
          ? actualUserData.suid
          : (actualUserData?.staff_id !== undefined && actualUserData?.staff_id !== null
              ? actualUserData.staff_id
              : actualUserData?.user_id);

      // For HCF Admin, ensure suid is properly set as hcf_id
      if (actualUserData?.role_id === 2 || login.role_id === 2) {
        console.log('🏥 HCF Admin: Ensuring suid equals hcf_id');
        console.log('  - Original suid:', actualUserData?.suid);
        console.log('  - hcf_id from API:', actualUserData?.hcf_id);
        
        // Use hcf_id if available, otherwise use suid
        finalSuid = actualUserData?.hcf_id || actualUserData?.suid;
        console.log('  - Final suid (hcf_id):', finalSuid);
      }
      
      const normalizedToken =
        typeof actualUserData?.access_token === 'string'
          ? actualUserData.access_token.replace(/^Bearer\s+/i, '').trim()
          : '';
      
      // Safely store authentication data
      try {
        console.log('💾 Storing authentication data...');
        
        // Store access token
        await AsyncStorage.setItem('access_token', normalizedToken || 'token');
        console.log('✅ access_token stored:', normalizedToken ? 'Present' : 'Default');
        
        // Store suid - ensure it's always stored as JSON string
        if (finalSuid !== undefined && finalSuid !== null && finalSuid !== 'token') {
          const suidValue = JSON.stringify(finalSuid);
          await AsyncStorage.setItem('suid', suidValue);
          console.log('✅ suid stored:', suidValue);
        } else {
          await AsyncStorage.setItem('suid', 'null');
          console.log('⚠️ suid is invalid, stored as null');
        }
        
        // Store role_id
        // FIX: Use sec_role_id if role_id is null (for clinic users)
        const roleIdToStore = actualUserData?.role_id || actualUserData?.sec_role_id || login.role_id;
        
        if (roleIdToStore !== undefined && roleIdToStore !== null && roleIdToStore !== 'token') {
          const roleIdValue = JSON.stringify(roleIdToStore);
          await AsyncStorage.setItem('role_id', roleIdValue);
          console.log('✅ role_id stored:', roleIdValue, '(from role_id:', actualUserData?.role_id, 'sec_role_id:', actualUserData?.sec_role_id, 'login:', login.role_id, ')');
        } else {
          await AsyncStorage.setItem('role_id', 'null');
          console.log('⚠️ role_id is invalid, stored as null');
        }
        
        console.log('✅ Authentication data stored successfully');
      } catch (storageError) {
        console.error('❌ Error storing authentication data:', storageError);
        throw new Error('Failed to store authentication data');
      }

      // Success Toaster after storing data
      // CustomToaster.show("success", "Login Successful", "Welcome to ShareCare");


      // Navigate based on role_id
      console.log('🚀 About to navigate with role_id:', actualUserData?.role_id, 'type:', typeof actualUserData?.role_id);
      console.log('🚀 Sec Role ID from API:', actualUserData?.sec_role_id, 'type:', typeof actualUserData?.sec_role_id);
      console.log('🚀 Login form role_id:', login.role_id, 'type:', typeof login.role_id);
      
      // FIX: Use sec_role_id if role_id is null (for clinic users)
      // For clinic users, API returns role_id: null but sec_role_id: 6
      const apiRoleId = actualUserData?.role_id;
      const apiSecRoleId = actualUserData?.sec_role_id;
      
      // Use role_id if available, otherwise use sec_role_id, finally fallback to login form
      const finalRoleId = apiRoleId || apiSecRoleId || login.role_id;
      console.log('🚀 Final role_id for navigation:', finalRoleId, 'type:', typeof finalRoleId);
      console.log('🚀 Used sec_role_id?', !apiRoleId && !!apiSecRoleId);
      
      // Check if navigation is available before attempting to navigate
      if (!navigation) {
        console.error('❌ Navigation object is not available!');
        CustomToaster.show(
          'error',
          'Navigation Error',
          'Unable to navigate to dashboard',
        );
        return;
      }
      
      handleRoleNavigation(finalRoleId);
      CustomToaster.show(
        'success',
        'Login Successful',
        'Welcome to ShareCare',
        {
          duration: 2000,


        },
      );

      // Verify stored data immediately after storing
      console.log('🔍 Verifying stored authentication data...');
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedSuid = await AsyncStorage.getItem('suid');
      const storedRoleId = await AsyncStorage.getItem('role_id');
      
      console.log('🔍 Verification results:');
      console.log('  - storedToken:', storedToken ? 'Present' : 'Missing');
      console.log('  - storedSuid:', storedSuid);
      console.log('  - storedRoleId:', storedRoleId);
      
      // Safely parse storedSuid - handle cases where it might be "token" or invalid JSON
      let parsedSuid = null;
      try {
        if (storedSuid && storedSuid !== 'token' && storedSuid !== 'null') {
          parsedSuid = JSON.parse(storedSuid);
          console.log('✅ Successfully parsed suid:', parsedSuid);
        } else {
          console.log('⚠️ No valid suid to parse');
        }
      } catch (parseError) {
        console.error('❌ Error parsing storedSuid:', parseError);
        console.log('storedSuid value that failed to parse:', storedSuid);
        parsedSuid = null;
      }
      
      setUserId(parsedSuid);
      console.log('✅ userId set to:', parsedSuid);
      
      // SECURITY: Initialize session timeout management
      setUserRoleId(actualUserData?.role_id || login.role_id);
      await updateLastActivity();
      
      // SECURITY: Start session timeout monitoring
      if (sessionTimeoutCleanup) {
        sessionTimeoutCleanup();
      }
      const cleanup = startSessionTimeout(handleLogout, actualUserData?.role_id || login.role_id);
      setSessionTimeoutCleanup(() => cleanup);
      
      // HCF Admin specific verification
      if (actualUserData?.role_id === 2 || login.role_id === 2) {
        console.log('🏥 HCF Admin Verification:');
        console.log('  - Stored suid (hcf_id):', parsedSuid);
        console.log('  - This suid will be used for HCF dashboard APIs');
        console.log('  - API calls will use this as hcf_id parameter');
      }
    } catch (error) {
      setisLogging(false);

      console.log('❌ Login error occurred:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
        console.error('API Error:', errorMessage);
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        CustomToaster.show(
          'error',
          'Login Failed',
          errorMessage || 'Incorrect Credentials',
          { duration: 3000 }
        );
        
        Alert.alert(
          'Login Failed',
          errorMessage || 'Incorrect credentials. Please check your email and password.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('Non-API Error:', error.message);
        CustomToaster.show('error', 'Login Failed', 'Something went wrong. Please try again.', { duration: 3000 });
        
        Alert.alert(
          'Login Failed',
          'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      }
      
      // Don't navigate - stay on login page
      console.log('❌ Login failed - staying on login page');
    } finally {
      setisLogging(false);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      console.log('🚪 Logout initiated');
      
      // SECURITY: Stop session timeout monitoring
      if (sessionTimeoutCleanup) {
        sessionTimeoutCleanup();
        setSessionTimeoutCleanup(null);
      }
      
      // SECURITY: Clear session data
      await clearSession();
      
      // First, call the backend logout API to invalidate the token
      try {
        console.log('📡 Calling backend logout API...');
        const logoutResponse = await axiosInstance.post(`${baseUrl}auth/logout`);
        console.log('✅ Backend logout successful:', logoutResponse?.data);
      } catch (apiError) {
        console.log('⚠️ Backend logout failed, but continuing with local logout:', apiError?.response?.data || apiError?.message);
        // Continue with local logout even if backend call fails
      }
      
      // Clear only authentication-related items, not all AsyncStorage
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('suid');
      await AsyncStorage.removeItem('role_id');
      
      // Reset authentication state
      setUserId(null);
      setUserRoleId(null);
      setDoctorDetails(null);
      setisLogging(false);
      setIsLoginValid(false);
      setIsRegisterValid(false);
      
      console.log('✅ Logout successful - authentication data cleared');
      
      // Show success message
      CustomToaster.show(
        'success',
        'Logged Out',
        'You have been successfully logged out',
        { duration: 2000 }
      );
      
      // Navigate to launch screen
      if (navigation) {
        navigation.navigate('Launchscreen');
        console.log('🚀 Navigated to Launchscreen');
      } else {
        console.log('⚠️ Navigation object not available');
      }
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      CustomToaster.show(
        'error',
        'Logout Failed',
        'Something went wrong during logout',
        { duration: 3000 }
      );
    }
  };

  // Function to handle role-based navigation
  const handleRoleNavigation = role_id => {
    console.log('🎯 handleRoleNavigation called with role_id:', role_id, 'type:', typeof role_id);
    
    // Convert role_id to number if it's a string
    const numericRoleId = typeof role_id === 'string' ? parseInt(role_id, 10) : role_id;
    console.log('🎯 Converted role_id to number:', numericRoleId, 'type:', typeof numericRoleId);
    
    const roleRoutes = {
      6: 'ClinicNavigation',
      5: 'PatientNavigation',
      3: 'DoctorNavigation',
      4: 'DiagnosticNavigation',
      2: 'AdminNavigation',
    };

    const route = roleRoutes[numericRoleId];
    console.log('🎯 Mapped route for role_id', numericRoleId, ':', route);
    console.log('🎯 Available routes:', Object.keys(roleRoutes));
    console.log('🎯 Navigation object available:', !!navigation);

    if (route) {
      console.log('🚀 Navigating to:', route);
      try {
        navigation.navigate(route);
        console.log('✅ Navigation successful to:', route);
      } catch (navError) {
        console.error('❌ Navigation error:', navError);
        CustomToaster.show(
          'error',
          'Navigation Failed',
          'Unable to navigate to dashboard',
        );
      }
    } else {
      console.log('❌ Navigation not defined for role_id:', numericRoleId);
      console.log('❌ Available role_ids:', Object.keys(roleRoutes).map(Number));
      CustomToaster.show(
        'error',
        'Invalid User',
        'Please login with correct details',
      );
    }
  };

  // Forget Password
  const ForgetPassword = async forgetPassword => {
    try {
      console.log('otp func', forgetPassword);
      const response = await axios.post(
        `${baseUrl}auth/forgotPassword`,
        forgetPassword,
      );
      console.log(response.data);
      setshowOtpField(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Verify otp
  const handleVerifyOtp = async verifyEmail => {
    try {
      console.log('🔐 OTP Verification initiated');
      console.log('📧 Email:', verifyEmail.email);
      console.log('🔢 OTP:', verifyEmail.otp);
      
      const response = await axios.post(
        `${baseUrl}auth/verifyEmail`,
        verifyEmail,
      );
      
      console.log('✅ OTP Verification successful:', response.data);
      setOtpVerified(true);
      
      // Show success message
      CustomToaster.show('success', 'OTP Verified', 'OTP verified successfully. Please enter your new password.', {
        duration: 3000,
      });
      
      // Don't navigate - let the ForgetPassword screen handle the flow
      console.log('✅ OTP verified - staying on ForgetPassword screen for new password entry');
      
    } catch (error) {
      console.log('❌ OTP Verification failed');
      console.error('Error details:', error.response?.data || error.message);
      
      CustomToaster.show(
        'error',
        'Verification Failed',
        error.response?.data?.error || 'Invalid OTP. Please try again.',
        {
          duration: 3000,
        },
      );
      console.error('error', error);
    }
    console.log('my otp:', verifyEmail);
  };

  // Update new password after OTP verification
  const handleUpdatePassword = async (passwordData) => {
    try {
      console.log('🔑 Password Update initiated');
      console.log('📧 Email:', passwordData.email);
      console.log('🔑 New Password:', passwordData.new_password ? 'Provided' : 'Missing');
      
      const response = await axios.post(
        `${baseUrl}auth/changePassword`,
        passwordData,
      );
      
      console.log('✅ Password Update successful:', response.data);
      
      // Show success message
      CustomToaster.show('success', 'Password Updated', 'Your password has been updated successfully. Please login with your new password.', {
        duration: 3000,
      });
      
      // Navigate to login screen after successful password update
      console.log('🚀 Navigating to login screen after password update');
      if (navigation) {
        // Navigate to login screen with role_id for diagnostic users
        navigation.navigate('Login', { role_id: passwordData.role_id || 4 });
        console.log('✅ Navigated to Login screen with role_id:', passwordData.role_id || 4);
      } else {
        console.log('⚠️ Navigation object not available');
      }
      
    } catch (error) {
      console.log('❌ Password Update failed');
      console.error('Error details:', error.response?.data || error.message);
      
      CustomToaster.show(
        'error',
        'Password Update Failed',
        error.response?.data?.error || 'Failed to update password. Please try again.',
        {
          duration: 3000,
        },
      );
      console.error('error', error);
    }
  };

  const DoctorDetailsApi = async () => {
    console.log('👨‍⚕️ DoctorDetailsApi called with userId:', userId);

    // Validate userId before making API call
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      console.log('⚠️ No valid userId provided, skipping doctor details fetch');
      return;
    }

    try {
      console.log('📡 Fetching doctor details for ID:', userId);
      const response = await axiosInstance.get(
        `Doctor/doctorProfileDetailsbyId?doctor_id=${userId}`
      );

      console.log('✅ Doctor details API response:', response.data);
      
      // Check if response has the expected structure
      if (response.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        const doctorData = response.data.response[0];
        console.log('👨‍⚕️ Doctor details found:', Object.keys(doctorData));
        setDoctorDetails(doctorData);
        console.log('✅ Doctor details stored successfully');
      } else {
        console.log('⚠️ No doctor details found in response');
        setDoctorDetails(null);
      }
    } catch (err) {
      console.error('❌ Error getting doctor details:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        console.log('🔐 Authentication required for doctor details');
        CustomToaster.show('error', 'Authentication Required', 'Please login again');
      } else if (err.response?.status === 404) {
        console.log('👨‍⚕️ Doctor not found');
        CustomToaster.show('error', 'Doctor Not Found', 'Doctor details not available');
      } else {
        const errorMessage = err?.response?.data?.message || 'Failed to fetch doctor details';
        console.log('❌ API Error:', errorMessage);
        CustomToaster.show('error', 'Error', errorMessage);
      }
      
      setDoctorDetails(null);
    }
  };
  // useEffect(()=>{
  useEffect(() => {
    if (userId) {
      DoctorDetailsApi();
    }
  }, [userId]);
  // },[])

  // Function to validate stored authentication data
  const validateStoredAuth = async () => {
    try {
      console.log('🔄 Validating stored authentication data...');
      
      const storedSuid = await AsyncStorage.getItem('suid');
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedRoleId = await AsyncStorage.getItem('role_id');
      
      console.log('🔍 AsyncStorage contents:');
      console.log('  - suid:', storedSuid);
      console.log('  - access_token:', storedToken ? 'Present' : 'Missing');
      console.log('  - role_id:', storedRoleId);
      
      // Validate token format
      const isValidStoredToken = storedToken && 
                                storedToken !== 'token' && 
                                storedToken !== 'null' &&
                                typeof storedToken === 'string' &&
                                storedToken.trim().length > 0;
      
      // Validate suid format
      const isValidStoredSuid = storedSuid && 
                               storedSuid !== 'token' && 
                               storedSuid !== 'null' &&
                               storedSuid !== 'undefined';
      
      if (!isValidStoredToken || !isValidStoredSuid) {
        console.log('❌ Invalid stored authentication data - clearing storage');
        console.log('❌ Token valid:', isValidStoredToken);
        console.log('❌ Suid valid:', isValidStoredSuid);
        
        // Clear invalid authentication data
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('suid');
        await AsyncStorage.removeItem('role_id');
        
        setUserId(null);
        console.log('🧹 Cleared invalid authentication data');
        return false;
      }
      
      // Parse and validate suid
      try {
        const parsedSuid = JSON.parse(storedSuid);
        
        // Additional validation for parsed suid
        if (parsedSuid === null || parsedSuid === undefined || parsedSuid === 'null') {
          console.log('❌ Parsed suid is invalid - clearing storage');
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('suid');
          await AsyncStorage.removeItem('role_id');
          setUserId(null);
          return false;
        }
        
        setUserId(parsedSuid);
        console.log('✅ Valid authentication data found - userId set to:', parsedSuid);
        
        // Check if this is HCF Admin
        if (storedRoleId && storedRoleId !== 'null') {
          try {
            const parsedRoleId = JSON.parse(storedRoleId);
            if (parsedRoleId === 2) {
              console.log('🏥 HCF Admin session restored:');
              console.log('  - suid (hcf_id):', parsedSuid);
              console.log('  - role_id:', parsedRoleId);
              console.log('  - Ready for HCF dashboard APIs');
            }
          } catch (roleParseError) {
            console.log('⚠️ Could not parse role_id:', roleParseError);
          }
        }
        
        return true; // Valid authentication data
      } catch (parseError) {
        console.error('❌ Error parsing storedSuid:', parseError);
        console.log('storedSuid value that failed to parse:', storedSuid);
        
        // Clear corrupted data
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('suid');
        await AsyncStorage.removeItem('role_id');
        setUserId(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Error validating stored authentication:', error);
      setUserId(null);
      return false;
    }
  };

  useEffect(() => {
    validateStoredAuth();
  }, []);
  
  return (
    <Authentication.Provider
      value={{
        handleRegister,
        isLogging,
        setisLogging,
        isRegisterValid,
        setIsRegisterValid,
        isLoginValid,
        setIsLoginValid,
        handleLogin,
        handleLogout,
        userId,
        ForgetPassword,
        showOtpField,
        setshowOtpField,
        handleVerifyOtp,
        handleUpdatePassword,
        otpverified,
        setOtpVerified,
        doctorDetails
      }}>
      {children}
    </Authentication.Provider>
  );
};

export default AuthenticationProvider;
