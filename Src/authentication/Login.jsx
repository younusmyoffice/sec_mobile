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
const Login = () => {
  const {handleLogin, isLogging, isLoginValid, setIsLoginValid} = useAuth();
  const routes = useRoute();
  const {role_id} = routes.params;
  console.log('inside login', role_id);
  const navigation = useNavigation();

  const [login, setLogin] = useState({
    email: '',
    password: '',
    login_with_email: true,
    role_id: role_id,
  });
  const [errors, setErrors] = useState({});
  const handleChange = useCallback(
    (name, value) => {
      setLogin(prevState => ({
        ...prevState,
        [name]: value,
      }));
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      setIsLoginValid(
        Object.values({...errors, [name]: error}).every(err => !err),
      );
    },
    [errors],
  );

  const loginFields = [
    {
      id: 1,
      label: 'Mobile No',
      name: 'email',
      type: 'email',
      placeholder: 'Mobile No Or Email',
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

  console.log(login);

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
            <Text style={authenticationStyle.signUp}>Log in</Text>
          </View>

          <View style={{gap: 25}}>
            <View style={authenticationStyle.inputs}>
              {loginFields.map(field => (
                <>
                  <CustomInputs
                    key={field.name}
                    label={field.label}
                    type={field.type}
                    name={field.name}
                    value={login[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    options={field.options}
                    maxLength={field.maxLength}
                    logo={null}
                    fontSize={20}
                    eyeicon={field.logo}
                  />
                  {errors[field.name] && (
                    <Text style={{color: 'red'}}>{errors[field.name]}</Text>
                  )}
                </>
              ))}
              <CustomButton
                title="Log In"
                bgColor={'#E72B4A'}
                borderRadius={25}
                textColor={'white'}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={() => handleLogin(login, role_id)}
                loading={true}
                isLogging={isLogging}
                isFormValid={!isLoginValid}
              />
            </View>
            <View style={{gap: 30}}>
              <TouchableWithoutFeedback onPress={()=>navigation.navigate('ForgetPassword')}>
              <Text style={authenticationStyle.forgot}>Forgot Password</Text>

              </TouchableWithoutFeedback>
              {/* <Text style={authenticationStyle.forgot}>Log in with OTP</Text> */}
              <View
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
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;
