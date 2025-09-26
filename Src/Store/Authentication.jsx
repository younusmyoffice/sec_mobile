import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import CustomToaster from '../components/customToaster/CustomToaster';
import { duration } from 'moment';
import axiosInstance from '../utils/axiosInstance';

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
  const [doctorDetails, setDoctorDetails] = useState()

  // Register Function
  const handleRegister = async (registerData, roleId) => {
    console.log("calling")
    if (!isRegisterValid) return;
    // if (registerData || Object.keys(registerData).length === 0) return;
    console.log('mera button click ho gya');
    try {
      setisLogging(true);

      console.log('mai try kr rha hu');
      const response = await axios.post(
        `${baseUrl}auth/register`,
        registerData,
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
      CustomToaster.show('error', 'Register  Failed', error.response?.data?.error, {
        duration: 2000,
      });
      console.log('Error kyu aa rha h ');
      console.error('error', error);
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

    await AsyncStorage.clear();

    try {
      setisLogging(true);
      console.log('Logging in...');

      const response = await axios.post(`${baseUrl}auth/login`, login);
      console.log('Response:', response?.data?.response);


      // Check if login was successful
      const userData = response?.data?.response;

      // if (!userData?.access_token || !userData?.suid) {
      //   throw new Error(userData?.message || 'INVALID_USER');
      // }

      // Store authentication details
      await AsyncStorage.setItem('access_token', userData?.access_token || "token");
      await AsyncStorage.setItem('suid', JSON.stringify(userData?.suid) || "token");
      await AsyncStorage.setItem('role_id', JSON.stringify(userData?.role_id) || "token");

      // Success Toaster after storing data
      // CustomToaster.show("success", "Login Successful", "Welcome to ShareCare");

      // Handle incomplete profiles
      if (userData?.body === 'INCOMPLETE_PROFILE') {
        navigation.navigate('ProfileComplete', {
          email: login.email,
          role_id: login.role_id,
        });
        return;
      }

      // Navigate based on role_id
      handleRoleNavigation(login.role_id);
      CustomToaster.show(
        'success',
        'Login Successful',
        'Welcome to ShareCare',
        {
          duration: 2000,


        },
      );

      // Retrieve stored user data
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedSuid = await AsyncStorage.getItem('suid');
      console.log("is there suid", storedSuid);
      setUserId(storedSuid ? JSON.parse(storedSuid) : null);

      console.log('Token Retrieved:', storedToken);
      console.log('User ID:', storedSuid);
    } catch (error) {
      setisLogging(false);

      if (axios.isAxiosError(error)) {
        console.error(
          'API Error:',
          error.response?.data?.error || error.message,
        );
        CustomToaster.show(
          'error',
          'Login Failed',
          error.response?.data?.error || 'Incorrect Credentials',
        );
      } else {
        console.error('Error:', error.message);
        CustomToaster.show('error', 'Login Failed', 'Something went wrong');
      }

      Alert.alert(
        'Login Failed',
        error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setisLogging(false);
    }
  };

  // Function to handle role-based navigation
  const handleRoleNavigation = role_id => {
    const roleRoutes = {
      6: 'ClinicNavigation',
      5: 'PatientNavigation',
      3: 'DoctorNavigation',
      4: 'DiagnosticNavigation',
      2: 'AdminNavigation',
    };

    const route = roleRoutes[role_id];

    if (route) {
      navigation.navigate(route);
      // CustomToaster.show('success', 'Login Successful', 'Welcome to ShareCare');
    } else {
      console.log('Navigation not defined for this role.');
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
      console.log('mai try kr rha hu');
      const response = await axios.post(
        `${baseUrl}auth/verifyEmail`,

        verifyEmail,
      );
      setOtpVerified(true);
      console.log('registered : ', response.data);
      CustomToaster.show('success', 'Verified', {
        duration: 2000,
      });
    } catch (error) {
      console.log('Error kyu aa rha h ');
      CustomToaster.show(
        'error',
        'Verification Failed',
        error.response?.data?.error,
        {
          duration: 2000,
        },
      );
      console.error('error', error);
    }
    console.log('my otp:', verifyEmail);
  };
  const DoctorDetailsApi = async () => {
    console.log('under dashboard details', userId)

    try {
      const response = await axiosInstance.get(
        `Doctor/doctorProfileDetailsbyId?doctor_id=${userId}`);

      console.log('Appointment accepted doctorDetails:', response.data.response[0]);
      setDoctorDetails(response.data.response[0])
      // Trigger re-render of the parent component to re-fetch appointment requests
      console.log("to upper case", doctorDetails)
    } catch (err) {
      console.error('Error getting doctor details:', err);
      const errorMessage =
        err?.response?.data?.message ||
        'Failed to accept appointment. Please try again later.';

    } finally {

    }
  };
  // useEffect(()=>{
  useEffect(() => {
    if (userId) {
      DoctorDetailsApi();
    }
  }, [userId]);
  // },[])

  useEffect(() => {
    const fetchStoredSuid = async () => {
      const storedSuid = await AsyncStorage.getItem('suid');
      if (storedSuid) {
        setUserId(JSON.parse(storedSuid));
      }
    };
  
    fetchStoredSuid();
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

        userId,
        ForgetPassword,
        showOtpField,
        setshowOtpField,
        handleVerifyOtp,
        otpverified,
        setOtpVerified,
        doctorDetails
      }}>
      {children}
    </Authentication.Provider>
  );
};

export default AuthenticationProvider;
