import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomSearch from '../../../../../components/customSearch/CustomSearch';
import CustomAddDoctor from '../../../../../components/customCards/addDoctorCard/CustomAddDoctor';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import {doctorDetails} from '../../../../../utils/data';
import CustomButton from '../../../../../components/customButton/CustomButton';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useNavigation} from '@react-navigation/native';
import {useCommon} from '../../../../../Store/CommonContext';
import axios from 'axios';
import {baseUrl} from '../../../../../utils/baseUrl';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
const AddDoctor = ({
  adddoctor,
  doctorDetails,
  handleAddDoctorClinic,
  handleChange,
  errors,
}) => {
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (fieldName, fieldValue) => {
    if (!fieldValue || fieldValue.trim() === '') {
      CustomToaster.show('error', 'Error', `Please enter ${fieldName} first`);
      return;
    }

    setIsSendingOtp(true);
    
    try {
      console.log(`📧 Sending OTP for ${fieldName}:`, fieldValue);
      
      let endpoint = '';
      let payload = {};
      
      if (fieldName === 'email') {
        endpoint = 'auth/resendCode';
        payload = { email: fieldValue };
      } else if (fieldName === 'mobile') {
        // Note: Mobile OTP endpoint may not be available in backend
        // For now, we'll show a message that mobile verification is not available
        CustomToaster.show(
          'info', 
          'Mobile Verification', 
          'Mobile OTP verification is not available yet. Please use email verification.'
        );
        return;
      } else {
        throw new Error('Invalid field type');
      }
      
      const response = await axios.post(`${baseUrl}${endpoint}`, payload);
      
      console.log('✅ OTP sent successfully:', response.data);
      
      CustomToaster.show(
        'success', 
        'OTP Sent', 
        `OTP has been sent to ${fieldName === 'email' ? 'your email' : 'your mobile'}`
      );
      
      setOtpSent(true);
      
    } catch (error) {
      console.error(`❌ Failed to send OTP for ${fieldName}:`, error);
      
      let errorMessage = `Failed to send OTP to ${fieldName}. Please try again.`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      CustomToaster.show('error', 'OTP Send Failed', errorMessage);
      
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{gap: 15}}>
          {/* <View>
            <CustomSearch
              visible={true}
              placeholder="Search Patient Name / ID"
              placeholderTextColor={'#AEAAAE'}
              showIcon={false}
            />
          </View> */}
          {/* <View>
            <CustomAddDoctor />
          </View> */}
          {/* <View>
            <InAppHeader LftHdr={'Add Doctor'} />
          </View> */}
          <View style={{marginTop: 10}}>
            {adddoctor?.map((item, i) => (
              <View key={item.id}>
                <CustomInput
                  name={item.name}
                  type={item.type}
                  value={doctorDetails[item.name]}
                  placeholder={item.placeholder}
                  addorment={item.isAdorment}
                  adormentText={isSendingOtp ? "Sending..." : item.adormenttext}
                  onChange={handleChange}
                  handleVerify={() => {
                    console.log('🔐 Verification requested for:', item.name);
                    console.log('📧 Current value:', doctorDetails[item.name]);
                    
                    // Send OTP for email or mobile verification
                    handleSendOtp(item.name, doctorDetails[item.name]);
                  }}
                />
                {errors[item.name] && (
                  <Text style={{color: 'red', fontSize: 12, marginTop: 5}}>{errors[item.name]}</Text>
                )}
                {otpSent && (item.name === 'email' || item.name === 'mobile') && (
                  <Text style={{color: 'green', fontSize: 12, marginTop: 5}}>
                    ✅ OTP sent to {item.name === 'email' ? 'email' : 'mobile'}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <View>{/* <InAppHeader LftHdr={'Working Days'} /> */}</View>
          {/* <View>
            {workingdays.map((item, i) => (
              <CustomInput
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                logo={item.logo}
                icon={item.icon}
              />
            ))}
          </View> */}
          <View>{/* <InAppHeader LftHdr={'Working Time'} /> */}</View>
          {/* <View>
            {workingtime.map((item, i) => (
              <CustomInput
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                logo={item.logo}
                icon={item.icon}
              />
            ))}
          </View> */}
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Continue"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-Medium'}
              borderRadius={20}
              textColor={'white'}
              width={wp(50)}
              onPress={handleAddDoctorClinic}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddDoctor;
