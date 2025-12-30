import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button, Alert, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import axiosInstance from '../../../utils/axiosInstance';
import { baseUrl } from '../../../utils/baseUrl';
import CustomToaster from '../../../components/customToaster/CustomToaster';

const HOST = 'http://localhost:8000';
const url = 'http://localhost:3000/sec/';

export default function AppointmentPayment({
  webviewRef,
  handlePayPress,
  price,
  token,
  isFetched,
  SetPatientDetails,
  patientdetails,
  docid,
  mode
}) {
  console.log("mode in payment", mode)
  console.log("🔑 isFetched:", isFetched, "token:", token ? "present" : "missing")

  // Debug: Log current patient details to see what data is available
  useEffect(() => {
    console.log("📋 Current patient details:", {
      appointment_date: patientdetails.appointment_date,
      appointment_time: patientdetails.appointment_time,
      duration: patientdetails.duration,
      doctor_fee_plan_id: patientdetails.doctor_fee_plan_id,
      name: patientdetails.name,
      gender: patientdetails.gender,
      age: patientdetails.age,
      patient_type: patientdetails.patient_type,
      doctor_id: patientdetails.doctor_id,
      patient_id: patientdetails.patient_id,
      answer_1: patientdetails.answer_1,
      answer_2: patientdetails.answer_2,
      answer_3: patientdetails.answer_3,
      answer_4: patientdetails.answer_4,
      answer_5: patientdetails.answer_5,
      problem: patientdetails.problem,
      fileName: patientdetails.fileName,
      file: patientdetails.file
    });
    
    // Check if we have any user data at all
    const hasUserData = Object.entries(patientdetails).some(([key, value]) => 
      key !== 'doctor_id' && key !== 'patient_id' && value && value !== ''
    );
    
    if (!hasUserData) {
      console.warn("⚠️ No user data found - user may have skipped steps or not filled forms");
    } else {
      console.log("✅ User data found - proceeding with user input");
    }
  }, [patientdetails]);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [loggedInPatientId, setLoggedInPatientId] = useState(null);

  // Load logged-in patient id (suid) dynamically from storage
  useEffect(() => {
    (async () => {
      try {
        const suid = await AsyncStorage.getItem('suid');
        let parsed = null;
        
        // Safely parse suid
        if (suid && suid !== 'token' && suid !== 'null') {
          try {
            parsed = JSON.parse(suid);
          } catch (parseError) {
            console.error('Error parsing suid in AppointmenrPayment:', parseError);
            console.log('suid value that failed to parse:', suid);
            parsed = null;
          }
        }
        
        setLoggedInPatientId(parsed);
        // If patientdetails is missing patient_id, set it once
        if (!patientdetails?.patient_id && parsed) {
          SetPatientDetails(prev => ({ ...prev, patient_id: parsed?.toString?.() || `${parsed}` }));
        }
      } catch (e) {
        console.warn('⚠️ Unable to load patient suid from storage:', e?.message);
      }
    })();
  }, []);

  // Debug WebView ref changes
  useEffect(() => {
    console.log("🌐 WebView ref changed:", webviewRef.current ? "set" : "null");
  }, [webviewRef.current]);

  // Extract client token from the token object
  const clientToken = token && typeof token === 'object' && token.clientToken 
    ? token.clientToken 
    : token;

  console.log("🔑 Extracted client token:", clientToken);
  console.log("🔑 Client token type:", typeof clientToken);
  // const [token, setToken] = useState('');
  // const [isTokenFetched, setIsTokenFetched] = useState(false);

  // const fetchToken = async () => {
  //   try {
  //     const response = await axios.get(`${url}payment/generateToken`);
  //     console.log(response.data);
  //     setToken(response.data);
  //     setIsTokenFetched(true);
  //   } catch (error) {
  //     console.error('Error fetching token:', error);
  //     Alert.alert('Error', 'Failed to fetch token');
  //   }
  // };

  // useEffect(() => {
  //   fetchToken();
  // }, []);
  // const webviewRef = useRef(null);

  // const handlePayPress = () => {
  //   webviewRef.current.injectJavaScript(`
  //     if (window.instance) {
  //       window.instance.requestPaymentMethod((err, payload) => {
  //         if (err) {
  //           window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
  //         } else {
  //           window.ReactNativeWebView.postMessage(JSON.stringify({ nonce: payload.nonce }));
  //         }
  //       });
  //     } else {
  //       window.ReactNativeWebView.postMessage(JSON.stringify({ error: "Payment instance not found" }));
  //     }
  //   `);
  // };
  const handleWebViewMessage = async event => {
    console.log('📨 WebView message received:', event.nativeEvent.data);
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (parseError) {
      console.error('Failed to parse message data:', parseError);
      Alert.alert('Payment Successful', 'Appointment Booked Successfully');
      return;
    }

    // Handle Braintree ready state
    if (data.ready) {
      console.log('✅ Braintree payment system is ready');
      return;
    }

    if (data.error) {
      console.error('❌ Payment error:', data.error);
      Alert.alert('Payment Error', data.error);
      return;
    }

    const { nonce } = data;
    console.log('💳 Payment nonce received:', nonce);
    
    // Validate required fields before processing payment
    const requiredFields = {
      appointment_date: patientdetails.appointment_date,
      appointment_time: patientdetails.appointment_time,
      duration: patientdetails.duration,
      doctor_fee_plan_id: patientdetails.doctor_fee_plan_id,
      name: patientdetails.name,
      gender: patientdetails.gender,
      age: patientdetails.age,
      patient_type: patientdetails.patient_type
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      console.error('❌ Current patient details:', patientdetails);
      
      // Check if user has any data at all
      const hasAnyUserData = Object.entries(patientdetails).some(([key, value]) => 
        key !== 'doctor_id' && key !== 'patient_id' && value && value !== ''
      );
      
      const alertMessage = hasAnyUserData 
        ? `Missing required fields: ${missingFields.join(', ')}. Please go back to previous steps to complete them.`
        : `No user data found. You may have skipped the form steps. Please go back and fill out the appointment details.`;
      
      Alert.alert(
        'Incomplete Information', 
        alertMessage,
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      return;
    }
    
    // Normalize patient_type to what backend expects
    const rawPatientType = (patientdetails.patient_type || '').toString().trim().toLowerCase();
    const patientTypeMap = {
      self: 'myself',
      me: 'myself',
      myself: 'myself',
      minor: 'minor',
      child: 'minor',
      kid: 'minor'
    };
    const normalizedPatientType = patientTypeMap[rawPatientType] || (rawPatientType || 'myself');

    // Format the payload according to API requirements (matching your exact format)
    const formattedPayload = {
      appointment_date: patientdetails.appointment_date,
      appointment_time: patientdetails.appointment_time?.replace(/(\d+):(\d+)/g, (match, hour, minute) => {
        // Convert "9:30 - 10:00" to "09:30 - 10:00"
        return `${hour.padStart(2, '0')}:${minute}`;
      }),
      duration: patientdetails.duration,
      patient_id: parseInt(patientdetails.patient_id || loggedInPatientId), // Ensure it's a number and dynamic
      doctor_id: parseInt(patientdetails.doctor_id), // Ensure it's a number
      // Include HCF context when booking via HCF doctor flow
      ...(mode ? { hcf_id: parseInt(patientdetails.hcf_id) } : {}),
      patient_type: normalizedPatientType,
      name: patientdetails.name,
      gender: patientdetails.gender?.toLowerCase(), // Ensure lowercase
      age: parseInt(patientdetails.age), // Ensure it's a number
      answer_1: patientdetails.answer_1 || "",
      answer_2: patientdetails.answer_2 || "",
      answer_3: patientdetails.answer_3 || "",
      answer_4: patientdetails.answer_4 || "",
      answer_5: patientdetails.answer_5 || "",
      doctor_fee_plan_id: parseInt(patientdetails.doctor_fee_plan_id), // Ensure it's a number
      payment_method_nonce: nonce,
      problem: patientdetails.problem || "",
      fileName: patientdetails.fileName || "",
      file: patientdetails.file || ""
    };
    
    console.log('📋 Original patient details:', patientdetails);
    console.log('📋 Formatted payload:', JSON.stringify(formattedPayload, null, 2));
    
    try {
      console.log('💳 Processing payment with formatted payload...');
      SetPatientDetails(formattedPayload);
      const route = !mode ? 'patient/createAppointment' : 'patient/createAppointmentHcfDoctor'
      console.log('🌐 API Route:', route);
      console.log('🌐 API URL:', `${baseUrl}${route}`);
      console.log('🌐 Request payload:', JSON.stringify(formattedPayload, null, 2));
      
      const response = await axiosInstance.post(
        route,
        formattedPayload
      );
      console.log("💳 Payment response:", JSON.stringify(response.data, null, 2));
      
      // Check for success in multiple possible response formats
      const isSuccess = response.data?.isPaymentSuccessful === true || 
                       response.data?.success === true || 
                       response.data?.status === 'success' ||
                       response.status === 200;
      
      const errorText = response.data?.errorText || response.data?.error || response.data?.message;

      if (isSuccess) {
        console.log('✅ Appointment booked successfully');
        // Show success alert and toaster
        Alert.alert(
          'Success!',
          'Appointment Booked Successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('✅ User acknowledged appointment success');
              }
            }
          ]
        );
        CustomToaster.show('success', 'Appointment Booked Successfully');
        
        // Only reset fields after successful payment
        SetPatientDetails({
          appointment_date: '',
          appointment_time: '',
          duration: '',
          patient_id: (loggedInPatientId?.toString?.() || `${loggedInPatientId}` || ''),
          doctor_id: docid.toString(),
          fileName: '',
          fileExtension: '',
          patient_type: '',
          name: '',
          gender: '',
          age: '',
          answer_1: '',
          answer_2: '',
          answer_3: '',
          answer_4: '',
          answer_5: '',
          doctor_fee_plan_id: '',
          payment_method_nonce: '',
          problem: '',
        });
      } else if (errorText) {
        console.error('❌ Payment failed:', errorText);
        Alert.alert(
          'Payment Failed',
          `Appointment Booking Failed: ${errorText}`,
          [
            { text: 'OK' }
          ]
        );
        CustomToaster.show('error', `Appointment Booking Failed: ${errorText}`);
        // Don't reset fields on error - let user try again
      } else {
        // If no clear error but also no clear success, assume success for 200 status
        console.log('✅ Appointment booked successfully (assuming success from 200 status)');
        Alert.alert(
          'Success!',
          'Appointment Booked Successfully',
          [
            { text: 'OK' }
          ]
        );
        CustomToaster.show('success', 'Appointment Booked Successfully');
        
        // Only reset fields after successful payment
        SetPatientDetails({
          appointment_date: '',
          appointment_time: '',
          duration: '',
          patient_id: (loggedInPatientId?.toString?.() || `${loggedInPatientId}` || ''),
          doctor_id: docid.toString(),
          fileName: '',
          fileExtension: '',
          patient_type: '',
          name: '',
          gender: '',
          age: '',
          answer_1: '',
          answer_2: '',
          answer_3: '',
          answer_4: '',
          answer_5: '',
          doctor_fee_plan_id: '',
          payment_method_nonce: '',
          problem: '',
        });
      }
    } catch (error) {
      console.error('❌ Payment transaction failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      console.error('❌ Full error response:', JSON.stringify(error.response?.data, null, 2));
      console.error('❌ Request that failed:', {
        url: `${baseUrl}${!mode ? 'patient/createAppointment' : 'patient/createAppointmentHcfDoctor'}`,
        payload: JSON.stringify(formattedPayload, null, 2)
      });
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      Alert.alert(
        'Payment Error',
        `Appointment Booking Failed: ${errorMessage}`,
        [
          { text: 'OK' }
        ]
      );
      CustomToaster.show('error', `Appointment Booking Failed: ${errorMessage}`);
      // Don't reset fields on error - let user try again
    }
  };

  console.log(price);
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: 'column',
          rowGap: 10,
          backgroundColor: 'white',
          paddingVertical: 10,
          borderWidth: 1.5,
          borderRadius: 10,
          borderColor: '#E72B4A',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}>
            Plan Selected
          </Text>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}>
            Plan Duration
          </Text>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}>
            Plan Fees
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Light',
            }}>
            {price?.planname}
          </Text>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Light',
            }}>
            {price?.duration}
          </Text>
          <Text
            style={{
              fontSize: hp(2),
              color: 'black',
              fontFamily: 'Poppins-Light',
            }}>
            {price?.amount}
          </Text>
        </View>
        <View></View>
      </View>
      {isFetched && (
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            source={{ uri: `${baseUrl}payment/mobileBraintreePaymentPage` }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleWebViewMessage}
            onLoad={() => {
              console.log('🌐 WebView loaded, injecting client token...');
              setIsWebViewReady(true);
              // Inject the client token into the server's HTML page
              webviewRef.current.injectJavaScript(`
                console.log('🌐 Injecting client token into server HTML...');
                console.log('🌐 Client token:', '${clientToken}');
                
                // Wait for Braintree library to load, then create Drop-in
                setTimeout(() => {
                  if (typeof braintree !== 'undefined') {
                    console.log('🌐 Creating Braintree Drop-in with server HTML...');
                    braintree.dropin.create({
                      authorization: '${clientToken}',
                      container: '#dropin-container'
                    }, function (err, instance) {
                      if (err) {
                        console.error('🌐 Braintree Drop-in creation failed:', err);
                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                          error: err.message 
                        }));
                      } else {
                        console.log('🌐 Braintree Drop-in created successfully');
                        window.instance = instance;
                        window.ReactNativeWebView.postMessage(JSON.stringify({ 
                          ready: true 
                        }));
                      }
                    });
                  } else {
                    console.error('🌐 Braintree library not available');
                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                          error: 'Braintree library not loaded' 
                        }));
                  }
                }, 2000);
              `);
            }}
          />
        </View>
      )}
      
      

      {/* Pay Button */}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!isFetched || !isWebViewReady) && styles.payButtonDisabled
          ]}
          onPress={handlePayPress}
          disabled={!isFetched || !isWebViewReady}
        >
          <Text style={[
            styles.payButtonText,
            (!isFetched || !isWebViewReady) && styles.payButtonTextDisabled
          ]}>
            {!isFetched ? 'Loading Payment...' : !isWebViewReady ? 'Preparing Payment...' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
  },
  webviewContainer: {
    height: hp(50),
    width: wp(90),
    marginBottom: 20,
    // borderColor:'red',
    // borderWidth:5
  },
  payButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  payButton: {
    backgroundColor: '#E72B4A',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: wp(60),
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontFamily: 'Poppins-SemiBold',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonTextDisabled: {
    color: '#999',
  },
  testButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: wp(40),
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Medium',
  },
});
