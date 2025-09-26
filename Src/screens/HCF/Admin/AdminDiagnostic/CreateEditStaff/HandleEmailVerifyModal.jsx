import {View, Text, SafeAreaView} from 'react-native';
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
const HandleEmailVerifyModal = ({visible, setVisible, email}) => {
  console.log(email)
  const [verifyOtp, setVerifyOtp] = useState({
    email: email,
    activation_code: 0,
  });

  const handleEmailOtpverify = async () => {
    console.log(verifyOtp);
  
    try {
      const response = await axiosInstance.post(
        `hcf/verifyHCFDiagnosticStaffEmail`,
        verifyOtp
      );
  
      CustomToaster.show('success', 'Email Verified', 'Email verification successful');
       
      setVisible(false); 
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
  
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText;
      } else if (error.request) {
        errorMessage = 'No response from the server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
  
      CustomToaster.show('error', 'Verification Failed', errorMessage);
  
      setVerifyOtp(prevState => ({
        ...prevState,
        activation_code: 0
      }));
    }
  };
  
  

  console.log(verifyOtp);
useEffect(()=>{
  setVerifyOtp(prev=>({...prev,email:email}))
},[email])
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
                The OTP have been sent to {email}
              </Text>
            </View>
            <View style={{marginTop: '20%'}}>
              <CustomOtpInput
                numberOfDigits={6}
                onTextChange={text =>
                  setVerifyOtp({
                    ...verifyOtp,
                    activation_code: Number(text),
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
                  onPress={handleEmailOtpverify}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default HandleEmailVerifyModal;
