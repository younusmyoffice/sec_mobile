import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomOtpInput from '../../../../../components/customOtpInput/CustomOtp';
import authenticationStyle from '../../../../../authentication/AuthenticationStyle';
import CustomButton from '../../../../../components/customButton/CustomButton';
import SuccessMessage from '../../../../../components/customSuccess/SuccessMessage';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useCommon} from '../../../../../Store/CommonContext';
// useRoute
const VerifyStaff = () => {
  const {handleVerify} = useCommon();
  const routes = useRoute();
  const {data, routePath} = routes.params;
  console.log('🔍 VerifyStaff - Received data:', data);
  console.log('🔍 VerifyStaff - Route path:', routePath);
  const navigation = useNavigation();
  const [isSuccess, setisSuccess] = useState(false);
  const [title, settitle] = useState('Verify Email');
  const [verifyOtp, setVerifyOtp] = useState({ 
    email: data?.email,
    activation_code: 0,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const handleVerify = async () => {
  //   try {
  //     setLoad(false);
  //     console.log('ruko zara sabar karo,hojayega');
  //     const response = await axiosInstance.post('auth/verifyEmail', verifyOtp);
  //     console.log(response.data.response?.suid);
  //     setDoctorId(response.data.response?.suid)
  //     setLoad(true);

  //     setisSuccess(!isSuccess);
  //     settitle('User Registered Successfully');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleSuccess = () => {
    console.log('✅ Verification successful, navigating to:', routePath);
    navigation.navigate(routePath);
  };

  const handleVerifyOtp = async () => {
    if (!verifyOtp.activation_code || verifyOtp.activation_code === 0) {
      setErrorMessage('Please enter the OTP');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      console.log('🔐 Attempting to verify OTP:', verifyOtp);
      await handleVerify(verifyOtp, setisSuccess, isSuccess, settitle);
      console.log('✅ OTP verification successful');
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      setErrorMessage('Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  console.log('🔍 Current verifyOtp:', verifyOtp);
  console.log('🔍 Is verifying:', isVerifying);
  console.log('🔍 Error message:', errorMessage);
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        {/* <View>
        <Header logo={require('../../../../../assets/hcfadmin.png')} notificationUserIcon={true} width={wp(41)} height={wp(4)} resize={'contain'}/>

        </View> */}
        <View style={{padding: 15, gap: 10}}>
          <View>
            <InAppCrossBackHeader
              showClose={false}
              backIconSize={25}
              closeIconSize={25}
              onBackPress={()=>navigation.goBack()}
            />
          </View>
          <View>
            <InAppHeader
              LftHdr={title}
              textcolor="#E72B4A"
              fontsize={hp(1.8)}
              fontfamily={'Poppins-SemiBold'}
            />
          </View>
          <View style={{marginTop: '10%'}}>
            {isSuccess ? (
              <>
                <View style={{alignSelf: 'center'}}>
                  <SuccessMessage />
                </View>
                <View style={{marginTop: '10%'}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Poppins-Medium',
                      color: 'black',
                      fontSize: hp(2.5),
                    }}>
                    Registration Successful
                  </Text>
                  <View
                    style={{
                      alignSelf: 'center',
                      padding: 15,
                      marginTop: '10%',
                    }}>
                    <CustomButton
                      title="Done"
                      bgColor={'#E72B4A'}
                      fontfamily={'Poppins-Medium'}
                      borderRadius={20}
                      textColor={'white'}
                      width={wp(50)}
                      onPress={handleSuccess}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
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
                    The OTP have been sent to {data?.email}
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
                      pinCodeContainerStyle:
                        authenticationStyle.pinCodeContainer,
                      pinCodeTextStyle: authenticationStyle.pinCodeText,
                      focusStickStyle: authenticationStyle.focusStick,
                      focusedPinCodeContainerStyle:
                        authenticationStyle.focusedPinCodeContainerStyle,
                    }}
                  />
                </View>
                <View style={{marginTop: '10%'}}>
                  {errorMessage ? (
                    <View style={{marginBottom: 20}}>
                      <Text
                        style={{
                          color: '#E72B4A',
                          fontSize: hp(1.8),
                          textAlign: 'center',
                          fontFamily: 'Poppins-Medium',
                        }}>
                        {errorMessage}
                      </Text>
                    </View>
                  ) : null}
                  
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
                      title={isVerifying ? "Verifying..." : "Continue"}
                      bgColor={isVerifying ? '#ccc' : '#E72B4A'}
                      fontfamily={'Poppins-Medium'}
                      borderRadius={20}
                      textColor={'white'}
                      width={wp(50)}
                      onPress={handleVerifyOtp}
                      disabled={isVerifying}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
        {/* <View>
          <SuccessMessage />
        </View> */}
      </SafeAreaView>
    </ScrollView>
  );
};

export default VerifyStaff;
