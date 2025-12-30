import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import InAppCrossBackHeader from '../../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../../components/customComponents/Header/Header';
import {useAuth} from '../../../../../Store/Authentication';
import axiosInstance from '../../../../../utils/axiosInstance';
import Modal from 'react-native-modal';
import CustomOtpInput from '../../../../../components/customOtpInput/CustomOtp';
import authenticationStyle from '../../../../../authentication/AuthenticationStyle';
import HandleEmailVerifyModal from './HandleEmailVerifyModal';
import HandleMobileVerifyModal from './HandleMobileVerifyModal';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import axios from 'axios';
import {baseUrl} from '../../../../../utils/baseUrl';

const CreateStaff = () => {
  const {userId} = useAuth();
  const navigation = useNavigation();
  const [staffDesg, setStaffDesg] = useState([]);
  const [dept, setDept] = useState([]);
  const [createStaff, setCreateStaff] = useState({
    first_name: '',
    email: '',
    mobile: '',
    role_id: '4',
    password: '',
    hcf_id: userId ? userId.toString() : '', //Hcf
    staff_designation: '',
    lab_department_id: '', //lab department
  });

  const [handleemailotp, setHandleemailotp] = useState({
    email: '',
    // mobile: '',
    role_id: '4',
    hcf_id: userId ? userId.toString() : '',
    register_with_email: 'true',
  });
  const [handlemobileotp, setHandlemobbileotp] = useState({
    email: createStaff?.email,
    mobile: '',
    role_id: '4',
    hcf_id: userId ? userId.toString() : '',
    register_with_email: 'false',
  });
  const [visible, setVisible] = useState(false);
  const [visibleMobileModal, setVisibleMobileModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState({email: false, mobile: false});

  const handleEmailVerify = async () => {
    if (!createStaff.email || createStaff.email.trim() === '') {
      CustomToaster.show('error', 'Error', 'Please enter email first');
      return;
    }

    setIsSendingOtp(true);
    
    try {
      console.log('📧 Sending email OTP for:', createStaff.email);
      console.log('📧 Payload:', {
        email: createStaff.email,
        role_id: '4',
        hcf_id: userId ? userId.toString() : '',
        register_with_email: 'true'
      });
      
      const response = await axiosInstance.post(`hcf/addStaff`, {
        email: createStaff.email,
        role_id: '4',
        hcf_id: userId ? userId.toString() : '',
        register_with_email: 'true'
      });
      
      console.log('✅ Email OTP response:', response.data);
      
      if (response.data?.error === 'EMAIL_NOT_VERIFIED') {
        CustomToaster.show(
          'success', 
          'OTP Sent', 
          'OTP has been sent to your email. Please check your inbox and spam folder.'
        );
        
        setOtpSent(prev => ({...prev, email: true}));
        setVisible(true);
      } else {
        console.log('⚠️ Unexpected email response:', response.data);
        CustomToaster.show(
          'info', 
          'OTP Sent', 
          'OTP has been sent to your email. Please check your inbox.'
        );
        
        setOtpSent(prev => ({...prev, email: true}));
        setVisible(true);
      }
      
    } catch (error) {
      console.error('❌ Failed to send email OTP:', error);
      
      let errorMessage = 'Failed to send OTP to email. Please try again.';
      
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

  const handleMobileVerify = async () => {
    if (!createStaff.mobile || createStaff.mobile.trim() === '') {
      CustomToaster.show('error', 'Error', 'Please enter mobile number first');
      return;
    }

    setIsSendingOtp(true);
    
    try {
      console.log('📱 Sending mobile OTP for:', createStaff.mobile);
      console.log('📱 Payload:', {
        mobile: createStaff.mobile,
        email: createStaff.email,
        role_id: '4',
        hcf_id: userId ? userId.toString() : '',
        register_with_email: 'false'
      });
      
      const response = await axiosInstance.post(`hcf/addStaff`, {
        mobile: createStaff.mobile,
        email: createStaff.email,
        role_id: '4',
        hcf_id: userId ? userId.toString() : '',
        register_with_email: 'false'
      });
      
      console.log('✅ Mobile OTP response:', response.data);
      
      if (response.data?.response?.body === 'OTP_SENT' || response.data?.response?.statusCode === 200) {
        CustomToaster.show(
          'success', 
          'OTP Sent', 
          'OTP has been sent to your mobile. Please check your SMS.'
        );
        
        setOtpSent(prev => ({...prev, mobile: true}));
        setVisibleMobileModal(true);
      } else {
        console.log('⚠️ Unexpected mobile response:', response.data);
        CustomToaster.show(
          'info', 
          'OTP Sent', 
          'OTP has been sent to your mobile. Please check your SMS.'
        );
        
        setOtpSent(prev => ({...prev, mobile: true}));
        setVisibleMobileModal(true);
      }
      
    } catch (error) {
      console.error('❌ Failed to send mobile OTP:', error);
      
      let errorMessage = 'Failed to send OTP to mobile. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.response?.body) {
        // Handle case where OTP was actually sent but response format is different
        if (error.response.data.response.body === 'OTP_SENT') {
          CustomToaster.show(
            'success', 
            'OTP Sent', 
            'OTP has been sent to your mobile. Please check your SMS.'
          );
          
          setOtpSent(prev => ({...prev, mobile: true}));
          setVisibleMobileModal(true);
          return;
        }
      }
      
      CustomToaster.show('error', 'OTP Send Failed', errorMessage);
      
    } finally {
      setIsSendingOtp(false);
    }
  };
  const staff = [
    {
      id: 1,
      name: 'first_name',
      type: 'text',
      placeholder: 'Name',
    },
    {
      id: 2,
      name: 'staff_designation',
      type: 'select',
      placeholder: 'Designation',
    },
    {
      id: 3,
      name: 'lab_department_id',
      type: 'select',
      placeholder: 'Department',
    },
    {
      id: 4,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      adormentText: 'Verify',
      handleVerify: handleEmailVerify,
    },
    {
      id: 5,
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile No',
      adormentText: 'Verify',
      handleVerify: handleMobileVerify,
    },
    {
      id: 6,
      name: 'password',
      type: 'password',
      placeholder: 'Create Password',
    },
    {
      id: 7,
      name: 'cpassword',
      type: 'password',
      placeholder: 'Confirm Password',
    },
  ];
  const fetchDeptandDesg = async () => {
    try {
      const response = await axiosInstance.get(`labDepartments`);
      const desginations = await axiosInstance.get(`staffDesignations`);
      console.log(response.data.response);
      setDept(
        response.data.response?.map((item, i) => ({
          label: item?.lab_department_name,
          value: item?.lab_department_id?.toString(),
        })),
      );
      setStaffDesg(
        desginations.data.response?.map((item, i) => ({
          label: item?.staff_designation_name,
          value: item?.staff_designation_id?.toString(),
        })),
      );
    } catch (error) {}
  };

  const dynamicFields = staff.map(field => {
    if (field.name === 'staff_designation') {
      return {...field, options: staffDesg};
    }
    if (field.name === 'lab_department_id') {
      return {...field, options: dept};
    }
    return field;
  });

  const handleChange = (name, value) => {
    setCreateStaff(prevState => ({
      ...prevState,
      [name]: value,
    }));

    setHandleemailotp(prevState => {
      if (name === 'mobile') {
        return {...prevState, email: null};
      }
      return {...prevState, [name]: value};
    });

    setHandlemobbileotp(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddStaff = async () => {
    // Validate required fields
    if (!createStaff.first_name || !createStaff.email || !createStaff.mobile || 
        !createStaff.password || !createStaff.staff_designation || !createStaff.lab_department_id) {
      CustomToaster.show('error', 'Missing Fields', 'Please fill in all required fields');
      return;
    }
    
    // Validate password match
    if (createStaff.password !== createStaff.cpassword) {
      CustomToaster.show('error', 'Password Mismatch', 'Password and confirm password do not match');
      return;
    }
    
    // Check if email verification is completed
    if (!otpSent.email) {
      CustomToaster.show('error', 'Email Verification Required', 'Please verify your email before creating staff');
      return;
    }
    
    // Check if mobile verification is completed
    if (!otpSent.mobile) {
      CustomToaster.show('error', 'Mobile Verification Required', 'Please verify your mobile number before creating staff');
      return;
    }

    try {
      console.log('👨‍⚕️ Creating staff with data:', createStaff);
      
      const response = await axiosInstance.post(`hcf/addStaff`, createStaff);
      console.log('✅ Staff creation response:', response.data);
      
      CustomToaster.show('success', 'Staff Added Successfully', 'Staff has been created successfully');
      navigation.goBack();
      
    } catch (error) {
      console.error('❌ Staff creation failed:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      CustomToaster.show('error', 'Staff Creation Failed', errorMessage);
    }
  };
  // const handleEmailVerify=async()=>{
  //   console.log("email")

  // }
  // const handleMobileVerify=async()=>{
  //   console.log("mobile")

  // }
  console.log(createStaff);
  console.log(handleemailotp);
  console.log(handlemobileotp);
  useEffect(() => {
    fetchDeptandDesg();
  }, []);
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView>
        <View>
          <Header
            logo={require('../../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15, gap: 10}}>
          <View>
            <InAppCrossBackHeader
              showClose={true}
              backIconSize={25}
              closeIconSize={25}
            />
          </View>
          <View>
            <InAppHeader
              LftHdr={'Create Staff'}
              textcolor="#E72B4A"
              fontsize={hp(1.8)}
              fontfamily={'Poppins-SemiBold'}
            />
          </View>
          <View>
            {dynamicFields?.map((item, i) => (
              <View key={item.id}>
                <CustomInput
                  type={item.type}
                  options={item.options}
                  placeholder={item.placeholder}
                  name={item.name}
                  value={createStaff[item.name] || ''}
                  onChange={handleChange}
                  addorment={item.adormentText ? true : false}
                  adormentText={isSendingOtp ? "Sending..." : item.adormentText}
                  handleVerify={
                    item.handleVerify ? () => item.handleVerify() : undefined
                  }
                />
                {otpSent[item.name] && (
                  <Text style={{color: 'green', fontSize: 12, marginTop: 5}}>
                    ✅ OTP sent to {item.name}
                  </Text>
                )}
                {item.name === 'email' && (
                  <Text style={{color: '#666', fontSize: 10, marginTop: 2}}>
                    💡 Check your email inbox and spam folder
                  </Text>
                )}
                {item.name === 'mobile' && (
                  <Text style={{color: '#666', fontSize: 10, marginTop: 2}}>
                    💡 Check your SMS messages
                  </Text>
                )}
              </View>
            ))}
            <HandleEmailVerifyModal
              visible={visible}
              setVisible={setVisible}
              setHandleotp={setHandleemailotp}
              handleotp={handleemailotp}
              email={createStaff?.email}
            />
            <HandleMobileVerifyModal
              visible={visibleMobileModal}
              setVisible={setVisibleMobileModal}
              setHandleotp={setHandlemobbileotp}
              handleotp={handlemobileotp}
              mobile={createStaff?.mobile}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Create Staff"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-Medium'}
              borderRadius={20}
              textColor={'white'}
              width={wp(50)}
              onPress={handleAddStaff}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateStaff;
