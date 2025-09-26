import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomInputs from '../components/customInputs/CustomInputs';
import CustomButton from '../components/customButton/CustomButton';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { baseUrl } from '../utils/baseUrl';
import CustomToaster from '../components/customToaster/CustomToaster';
const VerifyEmail = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const { roleid, email } = routes.params;
  const [verifyEmail, setverifyEmail] = useState({
    activation_code: 0,
    email: email,
  });

  console.log('inside verify', roleid);
  console.log(verifyEmail);
  const handleVerifyEmail = async () => {
    console.log('mera button click ho gya');
    try {
      console.log('mai try kr rha hu');
      const response = await axios.post(

        `${baseUrl}auth/verifyEmail`,

        verifyEmail,
      );
      navigation.navigate('Login', { role_id: roleid });
      console.log('registered : ', response.data);
    } catch (error) {
      console.log('Error kyu aa rha h ');
      console.error('error', error);
    }
    console.log('my otp:', verifyEmail);
  };
  const handlResendOtp = async () => {
    console.log('mera button click ho gya');
    try {
      console.log('mai try kr rha hu');
      const response = await axios.post(

        `${baseUrl}auth/resendCode`,

        {email: email},
      );
      CustomToaster.show('success', 'Code Sent Successfully');
      // navigation.navigate('Login', { role_id: roleid });
      console.log('verified : ', response.data);
    } catch (error) {
      console.log('Error kyu aa rha h ');
      console.error('error', error);
    }
    console.log('my otp:', verifyEmail);
  };
  return (
    <ScrollView>
      <SafeAreaView>
        <View
          style={{
            gap: 10,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={authenticationStyle.container}>
            <View>
              <Image
                style={authenticationStyle.logo}
              // source={require('../../../assets/labellogo.png')}
              />
            </View>

            <Text style={authenticationStyle.signUp}>Verify Email</Text>
            <View style={{ padding: 10 }}>
              <Text style={{ textAlign: 'center', color: 'black' }}>
                We’ve sent an email to
                <Text style={{ color: '#E72B4A' }}> {email}</Text> to
                verify you email address and activate your account. the link in
                the email will expire in 30 minutes.
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              // source={require('../../../assets/email.png')}
              style={{ height: 150, width: 150, resizeMode: 'contain' }}
            />
          </View>

          <View style={{ gap: 25 }}>
            <CustomOtpInput
              numberOfDigits={6}
              onTextChange={text =>
                setverifyEmail({ ...verifyEmail, activation_code: text })
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

            <View style={{ gap: 40 }}>
              <View style={{ padding: 10 }}>
                <CustomButton
                  title="Continue"
                  bgColor={'#E72B4A'}
                  borderRadius={25}
                  textColor={'white'}
                  fontWeight={'bold'}
                  fontSize={15}
                  padding={8}
                  onPress={handleVerifyEmail}
                />
              </View>

              <View>
                <TouchableOpacity onPress={handlResendOtp}>
                  <Text
                    style={{ color: '#E72B4A', fontSize: 19, textAlign: 'center' }}>
                    Resend Code: <Text style={{ color: 'black' }}>50</Text>
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

export default VerifyEmail;
