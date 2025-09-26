import {View, Text, ScrollView, SafeAreaView, Image} from 'react-native';
import React, {useCallback, useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomButton from '../../../components/customButton/CustomButton';
import CustomInput from '../../../components/customInputs/CustomInputs';
import CustomOtpInput from '../../../components/customOtpInput/CustomOtp';
CustomButton;
const MobileNumber = () => {
  const [number, setNumber] = useState({
    mobile: 0,
  });
  const handleChange = useCallback((name, value) => {
    setNumber(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);
  return (
    <ScrollView>
      <SafeAreaView>
        <View style={{flexDirection: 'column', gap: 10}}>
          <View style={[authenticationStyle.container, {marginBottom: '50%'}]}>
            <View>
              <Image
                style={authenticationStyle.logo}
                source={require('../../../assets/labellogo.png')}
              />
            </View>
            <Text style={authenticationStyle.signUp}>
              Please Enter Mobile No
            </Text>
          </View>
          <View style={{gap: 1}}>
            <View style={{padding: 15}}>
              <CustomInput
                placeholder="Mobile No"
                fontSize={20}
                type="number"
                onChange={handleChange}
                name="mobile"
              />
            </View>
            <View style={{padding: 15}}>
              <CustomButton
                title="Continue"
                bgColor={'#E72B4A'}
                borderRadius={25}
                textColor={'white'}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
              />
            </View>
          </View>
          <View style={{gap: 30}}>
            <Text style={authenticationStyle.forgot}>Forgot Password</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default MobileNumber;
