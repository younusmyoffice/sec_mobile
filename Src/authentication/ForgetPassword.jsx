import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomInputs from '../components/customInputs/CustomInputs';
import CustomButton from '../components/customButton/CustomButton';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../utils/baseUrl';
import {useCommon} from '../Store/CommonContext';
import {validateField} from '../components/customInputs/FormValidation';
import {useAuth} from '../Store/Authentication';
import CustomOtpInput from '../components/customOtpInput/CustomOtp';
const ForgetPassword = () => {
  const {
    handleLogin,
    setIsLoginValid,
    ForgetPassword,
    showOtpField,
    handleVerifyOtp,
    otpverified,
  } = useAuth();

  //   const [showOtpField, setshowOtpField] = useState(false);
  // const routes = useRoute();
  // const {role_id} = routes.params;
  // console.log('inside login', role_id);
  // const navigation = useNavigation();

  const [forgetpassword, setForgetPassword] = useState({
    email: '',
    //   login_with_email: true,
    //   role_id: role_id,
  });
  const [verifyEmail, setverifyEmail] = useState({
    activation_code: 0,
    email: forgetpassword.email,
  });

  const [ChangePassword, setPasswordChange] = useState({
    email: forgetpassword.email,
    new_password: '',
    activation_code: verifyEmail.activation_code,
  });
  const [errors, setErrors] = useState({});
  const handleChange = useCallback(
    (name, value) => {
      setForgetPassword(prevState => ({
        ...prevState,
        [name]: value,
      }));
      setverifyEmail(prev => ({
        ...prev,
        email: value,
      }));
      setPasswordChange(prev => ({
        ...prev,
        email: value,
      }));
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      setIsLoginValid(
        Object.values({...errors, [name]: error}).every(err => !err),
      );
    },
    [errors],
  );

  const handlePasswordChange = (name, value) => {
    setPasswordChange(prev => ({
      ...prev,
     new_password: value,
    }));
  };
  const loginFields = [
    {
      id: 1,
      label: 'Mobile No',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
    },

    {
      id: 2,
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      // logo: require('../../../assets/logo.png'),
    },
  ];
  console.log(ChangePassword);
  // console.log(login);
  // useEffect(()=>{
  //     setverifyEmail({
  //         email:forgetpassword.email
  //     })
  // },[forgetpassword])
  return (
    <ScrollView>
      <SafeAreaView>
        <View style={{gap: 50}}>
          <View style={authenticationStyle.container}>
            <View>
              <Image
                style={authenticationStyle.logo}
                source={require('../assets/labellogo.png')}
              />
            </View>
            <Text style={authenticationStyle.signUp}>Send Otp</Text>
          </View>

          <View style={{gap: 25}}>
            <View style={authenticationStyle.inputs}>
              {!showOtpField ? (
                <>
                  <CustomInputs
                    type={'email'}
                    name={'email'}
                    value={forgetpassword['email']}
                    onChange={handleChange}
                    placeholder={'Email Address'}
                    fontSize={20}
                  />
                  {errors['email'] && (
                    <Text style={{color: 'red'}}>{errors['email']}</Text>
                  )}
                </>
              ) : !otpverified ? (
                <>
                  <CustomOtpInput
                    numberOfDigits={6}
                    onTextChange={text =>{
                      setverifyEmail({...verifyEmail, activation_code: text})
                      setPasswordChange({...ChangePassword,activation_code:text})}
                    }
                    theme={{
                      containerStyle: authenticationStyle.container,
                      pinCodeContainerStyle:
                        authenticationStyle.pinCodeContainer,
                      pinCodeTextStyle: authenticationStyle.pinCodeText,
                      focusStickStyle: authenticationStyle.focusStick,
                      focusedPinCodeContainerStyle:
                        authenticationStyle.focusedPinCodeContainerStyle,
                    }}
                  />
                </>
              ) : (
                <CustomInputs
                  name={'new_password'}
                  placeholder={'New Password'}
                  type={'password'}
                  fontSize={20}
                  value={ChangePassword['new_password']}
                  onChange={handlePasswordChange}
                />
              )}
              <></>

              <CustomButton
                title={!showOtpField ? 'Send Otp' : 'Verify Otp'}
                bgColor={'#E72B4A'}
                borderRadius={25}
                textColor={'white'}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={() =>
                  !showOtpField
                    ? ForgetPassword(forgetpassword)
                    : handleVerifyOtp(verifyEmail)
                }
                loading={true}
                //   isLogging={isLogging}
                //   isFormValid={!isLoginValid}
              />
            </View>
            <View style={{gap: 30}}>
              {/* <Text style={authenticationStyle.forgot}>Forgot Password</Text> */}
              {/* <Text style={authenticationStyle.forgot}>Log in with OTP</Text> */}
              {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 5,
                  }}>
                  <Text style={{color: 'black', fontSize: 19}}>
                    i Don't have an account
                  </Text>
                  <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Text style={authenticationStyle.forgot}>Create Account</Text>
                  </TouchableWithoutFeedback>
                </View> */}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ForgetPassword;
