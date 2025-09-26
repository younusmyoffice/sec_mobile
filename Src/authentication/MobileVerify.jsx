import {View, Text, ScrollView, SafeAreaView, Image} from 'react-native';
import React, {useCallback, useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomButton from '../components/customButton/CustomButton';
import CustomInput from '../components/customInputs/CustomInputs';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const MobileVerify = () => {
  const [mobileotp, setMobileOtp] = useState();

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={{flexDirection: 'column', gap: 10,padding:15}}>
          <View style={[authenticationStyle.container, {marginBottom: '50%'}]}>
            <View>
              <Image
                style={authenticationStyle.logo}
                source={require('../assets/labellogo.png')}
              />
            </View>
            <Text style={authenticationStyle.signUp}>
              Please Enter Mobile No
            </Text>
          </View>
          <View style={{gap: 1}}>
            <View style={{padding: 15}}>
              <CustomOtpInput
                numberOfDigits={6}
                onTextChange={text => setMobileOtp(text)}
                theme={{
                  containerStyle: authenticationStyle.container,
                  pinCodeContainerStyle: authenticationStyle.pinCodeContainer,
                  pinCodeTextStyle: authenticationStyle.pinCodeText,
                  focusStickStyle: authenticationStyle.focusStick,
                  focusedPinCodeContainerStyle:
                    authenticationStyle.focusedPinCodeContainerStyle,
                }}
              />
            </View>
            <View style={{alignSelf:'center',padding:15}}>
              <CustomButton
                title="Continue"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-Medium'}
              borderRadius={20}
              textColor={'white'}
              width={wp(50)}
              />
            </View>
          </View>

          <View style={{gap: 30}}>
            <Text style={{color: '#E72B4A', fontSize: 19, textAlign: 'center'}}>
              Resend Code: <Text style={{color: 'black'}}>50</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default MobileVerify;
