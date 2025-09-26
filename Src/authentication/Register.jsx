import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import authenticationStyle from './AuthenticationStyle';
import CustomInputs from '../components/customInputs/CustomInputs';
import CustomButton from '../components/customButton/CustomButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {baseUrl} from '../utils/baseUrl';
import {validateField} from '../components/customInputs/FormValidation';
import {useCommon} from '../Store/CommonContext';
import {useAuth} from '../Store/Authentication';

const Register = () => {
  const {handleRegister, isRegisterValid,setIsRegisterValid,isLogging} = useAuth();

  const navigation = useNavigation();
  const route = useRoute();
  const {roleId} = route.params;
  console.log(roleId);
  const [errors, setErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    mobile: 0,
    email: '',
    password: '',
    // cpassword: '',
    role_id: roleId,
  });

  console.log(registerData);
  const handleChange = useCallback(
    (name, value) => {
      setRegisterData(prevState => ({
        ...prevState,
        [name]: value,
      }));
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      setIsRegisterValid(
        Object.values({...errors, [name]: error}).every(err => !err),
      );
    },
    [],
  );
  const registerField = [
    {
      id: 1,
      label: 'Mobile No',
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile No',
    },
    {
      id: 2,
      label: 'Email Address',
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
    },
    {
      id: 3,
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
  ];

 
  
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
            <Text style={authenticationStyle.signUp}>Sign Up</Text>
          </View>

          <View style={{gap: 25}}>
            <View style={authenticationStyle.inputs}>
              <View>
                {registerField.map(field => (
                  <>
                    <CustomInputs
                      key={field.name}
                      label={field.label}
                      type={field.type}
                      name={field.name}
                      value={registerData[field.name] || ''}
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
              </View>
              <CustomButton
                title="Register"
                bgColor={'#E72B4A'}
                borderRadius={25}
                textColor={'white'}
                fontWeight={'bold'}
                fontSize={15}
                padding={8}
                onPress={() => handleRegister(registerData, roleId)}
                loading={true}
                isFormValid={!isRegisterValid}
                isLogging={isLogging}
                
              />
            </View>
            <View style={{gap: 30}}>
              {/* <Text style={authenticationStyle.forgot}>Forgot Password</Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 5,
                }}>
                <Text style={{color: 'black', fontSize: 19}}>
                  i have an account
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('Login', {role_id: roleId})
                  }>
                  <Text style={authenticationStyle.forgot}>Login </Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;
