import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import Header from '../../../../components/customComponents/Header/Header';
import {baseUrl} from '../../../../utils/baseUrl';
import {useCommon} from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';

export default function DiagnosticProfileScreen() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({
    suid: 8,
    first_name: '',
    email: '',
    mobile: '',
    role_id: 4,
  });
  const inputRefs = useRef([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const ProfileDetails = [
    {id: 1, name: 'first_name', type: 'text', placeholder: 'First Name'},
    {id: 2, name: 'mobile', type: 'number', placeholder: 'Mobile Number'},
    {id: 3, name: 'email', type: 'text', placeholder: 'Email'},

    
  ]
  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };
  const {userId} = useCommon();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseUrl}hcf/getDiagnosticStaffProfile/${userId}`,
        );
        console.log('dsafdsafdsafds', response.data.response);
        // if (response.data.response.length > 0) {
        //   const userData = response.data.response[0];
        //   console.log('diag form', userData);
        setFormData(response.data.response[0]);
        setName(response.data.response[0].first_name);
        // }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    console.log(formData);
    try {
      const response = await axios.post(`${baseUrl}hcf/updateStaff`, formData);
      if (response.data.response?.statusCode === 200) {
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#E72B4A" />
      </View>
    );
  }

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Header
        logo={require('../../../../assets/headerDiagonsis.jpeg')}
        onlybell={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
      />
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{padding: 15, gap: 10}}>
          <View
            style={{
              backgroundColor: '#E72B4A',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              width: wp(41),
            }}>
            <Text style={{color: 'white'}}>Profile Information</Text>
          </View>
          <TouchableWithoutFeedback onPress={handleEnable}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center',
              gap: 5,
            }}>
            <MaterialCommunityIcons
              name="pencil"
              color={'#E72B4A'}
              size={hp(2)}
            />
            <Text
              style={{
                color: '#E72B4A',
                fontFamily: 'Poppins-Medium',
                fontSize: hp(2),
              }}>
              Edit Profile
            </Text>
          </View>

          </TouchableWithoutFeedback>
          <View
            style={{
              marginTop: '5%',
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: '#AEAAAE',
                fontFamily: 'Poppins-Medium',
                fontSize: hp(2),
              }}>
              Profile ID:
            </Text>
            <Text
              style={{
                color: '#E72B4A',
                fontFamily: 'Poppins-Medium',
                fontSize: hp(2),
              }}>
              3456467DFG
            </Text>
          </View>
          <View>
            {/* <CustomInput
              label={'Namesasa'}
              key={formData.first_name}
              type={'text'}
              name={'first_name'}
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder={'Namedsa'}
              fontSize={14}
            />

            <CustomInput
              label={'Mobile No'}
              key={formData.mobile}
              type={'number'}
              name={'mobile'}
              value={formData.mobile || ''}
              onChange={handleChange}
              placeholder={'mobile no'}
              fontSize={14}
            />
            <CustomInput
              ref={el => (inputRefs.current[2] = el)}
              label={'Email'}
              key={formData.email}
              type={'email'}
              name={'email'}
              value={formData.email || ''}
              onChange={handleChange}
              placeholder={'Email'}
              fontSize={14}
            /> */}
            {ProfileDetails.map((item, index) => (
                <CustomInput
                ref={el => (inputRefs.current[index] = el)}
                // label={'Email'}
                key={item.id}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={formData[item.name] || ''}
                disabled={item.name === 'email' || isDisabled}
                onChange={handleChange}
                fontSize={14}
              /> 
            ))}
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Submit"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'white'}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
              onPress={handleUpdate}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
