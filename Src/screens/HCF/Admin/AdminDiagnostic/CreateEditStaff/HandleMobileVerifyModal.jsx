import {View, Text, SafeAreaView, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import CustomOtpInput from '../../../../../components/customOtpInput/CustomOtp';
import authenticationStyle from '../../../../../authentication/AuthenticationStyle';
import CustomButton from '../../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axiosInstance from '../../../../../utils/axiosInstance';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
const HandleMobileVerifyModal = ({visible, setVisible, mobile}) => {
  const [verifyOtp, setVerifyOtp] = useState({
    mobile: mobile,
    otp_code: '',
  });
  const [otp, setotp] = useState('');
  const handleMobileVerifyotp = async () => {
    try {
      const response = await axiosInstance.post(
        `hcf/verifyHCFDiagnosticStaffMobile`,
        verifyOtp,
      );
      CustomToaster.show(
        'success',
        'Mobile Verified',
        'Mobile verification successful',
      );
      setVisible(false);
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.response) {
        errorMessage =
          error.response.data?.message || error.response.statusText;
      } else if (error.request) {
        errorMessage =
          'No response from the server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }

      CustomToaster.show('error', 'Verification Failed', errorMessage);
      setVerifyOtp(prevState => ({
        ...prevState,
        otp_code: 0
      }));
    }
  };

  console.log('mobile', verifyOtp);
  useEffect(() => {
    setVerifyOtp(prev => ({...prev, mobile: mobile}));
  }, [mobile]);
  return (
    <View>
      <Modal
        isVisible={visible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        deviceWidth={true}
        onRequestClose={() => setVisible(false)}>
        <SafeAreaView>
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
              // height: '80%',
              gap: 20,
              width: '100%',
              marginTop: 50,
            }}>
            <View style={{alignSelf: 'center', gap: 10}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(2.5),
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                }}>
                Please enter OTP
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: hp(1.8),
                  fontFamily: 'Poppins-Regular',
                }}>
                The OTP have been sent to {mobile}
              </Text>
            </View>
            <View style={{marginTop: '20%'}}>
              {/* <CustomOtpInput
                numberOfDigits={6}
                onTextChange={text =>
                  setVerifyOtp({
                    ...verifyOtp,
                    otp_code: Number(text),
                  })
                }
                theme={{
                  // containerStyle: authenticationStyle.container,
                  pinCodeContainerStyle: authenticationStyle.pinCodeContainer,
                  pinCodeTextStyle: authenticationStyle.pinCodeText,
                  focusStickStyle: authenticationStyle.focusStick,
                  focusedPinCodeContainerStyle:
                    authenticationStyle.focusedPinCodeContainerStyle,
                }}
              /> */}
              <TextInput
                value={verifyOtp.otp_code}
                onChangeText={text =>
                  setVerifyOtp(prev => ({...prev, otp_code: text}))
                }
                maxLength={6}
                autoCapitalize="characters"
                keyboardType="default"
                style={{
                  borderBottomWidth: 1,
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#E72B4A',
                  letterSpacing: 10,
                  width: 140,
                  fontFamily: 'monospace',
                }}
              />
            </View>
            <View style={{marginTop: '10%'}}>
              <View style={{gap: 30}}>
                <Text
                  style={{
                    color: '#E72B4A',
                    fontSize: hp(2),
                    textAlign: 'center',
                  }}>
                  Resend Code: <Text style={{color: 'black'}}>50</Text>
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  padding: 15,
                  marginTop: '10%',
                }}>
                <CustomButton
                  title="Continue"
                  bgColor={'#E72B4A'}
                  fontfamily={'Poppins-Medium'}
                  borderRadius={20}
                  textColor={'white'}
                  width={wp(50)}
                  onPress={handleMobileVerifyotp}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default HandleMobileVerifyModal;
