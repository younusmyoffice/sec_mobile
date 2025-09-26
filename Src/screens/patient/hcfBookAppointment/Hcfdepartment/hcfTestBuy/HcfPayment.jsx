import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import {baseUrl} from '../../../../../utils/baseUrl';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
const HcfPayment = ({webviewRef, bookTest, setBookTest}) => {
  // console.log(bookTest);
  const [isTokenFetched, setIsTokenFetched] = useState(false);
  const [token, setToken] = useState('');
  const fetchToken = async () => {
    try {
      const response = await axios.get(
        `https://api.shareecare.com/sec/payment/generateToken`,
      );
      console.log(response.data);
      setToken(response.data);
      setIsTokenFetched(true);
    } catch (error) {
      console.error('Error fetching token:', error);
      Alert.alert('Error', 'Failed to fetch token');
    }
  };
  const handleWebViewMessage = async event => {
    // console.log('patient nonce', bookTest);
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

    const {nonce} = data;
    console.log(nonce);
    const updatedDetails = {...bookTest, payment_method_nonce: nonce};
    // console.log("updatedDetails",updatedDetails)
    try {
      console.log('Processing payment...');
      setBookTest(updatedDetails);
      console.log("bookTest",bookTest)
// console.log("booktest",bookTest)
      const response = await axiosInstance.post(
        `patient/createTest`,
        updatedDetails,
      );
console.log("test response",response?.data)
      const {isPaymentSuccessful, errorText} = response.data;
      // Alert.alert(
      //   isPaymentSuccessful
      //     ? 'Payment Successful'
      //     : `Payment Error - ${errorText || 'Unknown error'}`,
      // );
      CustomToaster.show('success', 'Appointment Booked Successfully');
    } catch (error) {
      console.error('Payment transaction failed:', error);
      // Alert.alert('Payment Successful', 'Appointment Booked Successfully');
      CustomToaster.show('error', 'Appointment Booking Failed');
    } finally {
      // Reset fields
      // setBookTest({
      //   book_date: '',
      //   patient_id: '',
      //   test_subexam_id: '',
      //   status: 'requested',
      //   payment_method_nonce: '',
      // });
    }
  };
  console.log("submission",bookTest)
  useEffect(() => {
    fetchToken();
  }, []);
  return (
    <View>
      {isTokenFetched && (
        <View style={styles.webviewContainer}>
          <WebView
            ref={webviewRef}
            source={{uri: `${baseUrl}payment/mobileBraintreePaymentPage`}}
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
    </View>
  );
};

const styles = StyleSheet.create({
  webviewContainer: {
    height: hp(50),
    width: wp(80),
    marginBottom: 20,
    // borderColor:'red',
    // borderWidth:5
  },
});

export default HcfPayment;
