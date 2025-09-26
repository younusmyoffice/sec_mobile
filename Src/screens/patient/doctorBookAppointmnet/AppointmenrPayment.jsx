import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
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
    // console.log('patient nonce', patientdetails);
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (parseError) {
      console.error('Failed to parse message data:', parseError);
      Alert.alert('Payment Successful', 'Appointment Booked Successfully');
      return;
    }

    if (data.error) {
      Alert.alert('Payment Error', data.error);
      // Alert.alert('Payment Successful', 'Appointment Booked Successfully');
      return;
    }

    const { nonce } = data;
    console.log(nonce);
    const updatedDetails = { ...patientdetails, payment_method_nonce: nonce };
    console.log("pdetails", patientdetails)
    try {
      console.log('Processing payment...');
      SetPatientDetails(updatedDetails);
      const route = !mode ? 'patient/createAppointment' : 'patient/createAppointmentHcfDoctor'
      const response = await axiosInstance.post(
        route,
        updatedDetails
      );
      console.log("payment rsponse", response.data)
      const { isPaymentSuccessful, errorText } = response.data;

      // Alert.alert(
      //   isPaymentSuccessful
      //     ? 'Payment Successful'
      //     : `Payment Error - ${errorText || 'Unknown error'}`,
      // );
      CustomToaster.show('success', 'Appointment Booked Successfully')
    } catch (error) {
      console.error('Payment transaction failed:', error);
      // Alert.alert('Payment Successful', 'Appointment Booked Successfully');
      CustomToaster.show('error', 'Appointment Booking Failed')

    } finally {
      // Reset fields
      SetPatientDetails({
        appointment_date: '',
        appointment_time: '',
        duration: '',
        patient_id: '5',
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
              webviewRef.current.injectJavaScript(`
                braintree.dropin.create({
                  authorization: '${token}',
                  container: '#dropin-container'
                }, (err, instance) => {
                  if (!err) {
                    window.instance = instance;
                  }
                });
              `);
            }}
          />
        </View>
      )}
      {/* <Button title="Pay" onPress={handlePayPress} /> */}
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
});
