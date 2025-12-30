import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AdminHeader from '../../../../../components/customComponents/AdminHeader/AdminHeader';
import AddDoctor from './AddDoctor';
import AddPackage from './AddPackage/AddPackage';
import TopTabs from '../../../../../components/customComponents/TopTabs/TopTabs';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../../utils/axiosInstance';
import {useNavigation} from '@react-navigation/native';
import {useCommon} from '../../../../../Store/CommonContext';
import {validateField} from '../../../../../components/customInputs/FormValidation';
import axios from 'axios';
import {baseUrl} from '../../../../../utils/baseUrl';
const ParentDoctorPackage = () => {
  const [activeTab, setactiveTab] = useState('Add Doctor');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {userId, load} = useCommon();
  const [errors, setErrors] = useState({});
  const[isFieldValid,setIsFieldValid]=useState(false)
  const [doctorDetails, setDoctorDetails] = useState({
    email: '',
    mobile: '',
    role_id: '6',
    password: '',
    confirmpassword: '',
  });
  console.log('🔍 ParentDoctorPackage Debug:');
  console.log('👤 User ID:', userId, 'Type:', typeof userId);
  console.log('📋 Doctor Details:', doctorDetails);
  console.log('🔄 Load state:', load);
  const addDoctorField = [
    {
      id: 1,
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
      label: 'Email Address',
      isAdorment: true,
      adormenttext: 'Verify',
    },
    {
      id: 2,
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile Number',
      label: 'Mobile Number',
      isAdorment: true,
      adormenttext: 'Verify',
    },
    {
      id: 3,
      name: 'password',
      type: 'password',
      placeholder: 'Create Password',
      label: 'Create Password',
    },
    {
      id: 4,
      name: 'confirmpassword',
      type: 'password',
      placeholder: 'Confirm Password',
      label: 'Confirm Password',
    },
    // {
    //   id: 5,
    //   name: 'from',
    //   type: 'date',
    //   placeholder: 'From',
    //   label: 'From',
    //   logo: true,
    //   icon: 'calendar',
    // },
    // {
    //   id: 6,
    //   name: 'to',
    //   type: 'date',
    //   placeholder: 'To',
    //   label: 'To',
    //   logo: true,
    //   icon: 'calendar',
    // },
    // {
    //   id: 7,
    //   name: 'fromTime',
    //   type: 'number',
    //   placeholder: 'From',
    //   label: 'From',
    // },
    // {
    //   id: 8,
    //   name: 'toTime',
    //   type: 'number',
    //   placeholder: 'To',
    //   label: 'To',
    // },
  ];
  const adddoctor = addDoctorField.slice(0, 4);
  const workingdays = addDoctorField.slice(4, 6);
  const workingtime = addDoctorField.slice(6, 8);

  const handleChange = (name, value) => {
    setDoctorDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
    const error = validateField(name, value);
    setErrors(prev => ({...prev, [name]: error}));
    setIsFieldValid(
      Object.values({...errors, [name]: error}).every(err => !err),
    );
  };

  console.log(doctorDetails);

  const handleAddDoctorClinic = async () => {
    console.log("first Submitsaddsa",doctorDetails);
    
    // Validate required fields
    if (!doctorDetails.email || !doctorDetails.mobile || !doctorDetails.password || !doctorDetails.confirmpassword) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }
    
    // Validate password match
    if (doctorDetails.password !== doctorDetails.confirmpassword) {
      Alert.alert('Password Mismatch', 'Password and confirm password do not match', [
        {text: 'OK', onPress: () => console.log('Password mismatch')},
      ]);
      return;
    }
    
    try {
      setLoading(true);
      console.log('👨‍⚕️ Adding doctor with data:', doctorDetails);
      
      const response = await axiosInstance.post(
        `hcf/addDoctor`,
        doctorDetails,
      );
      
      console.log('✅ Doctor creation response:', response.data);
      
      // Check if doctor was created successfully
      if (response.data?.error === 'EMAIL_NOT_VERIFIED') {
        console.log('📧 Doctor created, email verification required');
        
        // Navigate to OTP verification
        navigation.navigate('verify-doctorotp', {
          data: doctorDetails,
          routePath: 'doctor-package',
        });
        
        // Clear form after successful submission
        setDoctorDetails({
          email: '',
          mobile: '',
          role_id: '6',
          password: '',
          confirmpassword: '',
        });
        
      } else if (response.data?.response?.doctor_id) {
        console.log('✅ Doctor created successfully with ID:', response.data.response.doctor_id);
        
        // Navigate directly to package creation if no verification needed
        navigation.navigate('doctor-package');
        
      } else {
        console.log('⚠️ Unexpected response:', response.data);
        Alert.alert('Success', 'Doctor created successfully');
      }
      
    } catch (error) {
      console.error('❌ Error adding doctor:', error);
      
      let errorMessage = 'Failed to add doctor. Please try again.';
      
      if (error.response?.data?.error) {
        if (error.response.data.error === 'MOBILE_EXISTS_FOR_PATIENT_DIAGNOSTIC_ADMIN') {
          errorMessage = 'Mobile number already exists. Please use a different mobile number.';
        } else if (error.response.data.error === 'EMAIL_EXISTS') {
          errorMessage = 'Email already exists. Please use a different email address.';
        } else {
          errorMessage = error.response.data.error;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Note: hcf_id is automatically set by the backend from the authenticated user's suid

  const renderComponent = () => {
    switch (activeTab) {
      case 'Add Doctor':
        return (
          <AddDoctor
            adddoctor={adddoctor}
            doctorDetails={doctorDetails}
            handleAddDoctorClinic={handleAddDoctorClinic}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 'Add Package':
        return <AddPackage />;

      default:
        break;
    }
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View>
          <Header
            logo={require('../../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>
        <View style={{padding: 15, gap: 10, backgroundColor: '#fff'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TopTabs
              data={[
                {id: 1, title: 'Add Doctor'},
                load && {id: 2, title: 'Add Package'},
              ]}
              activeTab={activeTab}
              setActiveTab={setactiveTab}
              borderRadius={10}
            />
            <View
              style={{
                borderWidth: 1.5,
                padding: 10,
                borderRadius: 50,
                borderColor: '#E6E1E5',
                // position: 'relative',
                height: hp(4.5),
                width: wp(10),
              }}>
              <TouchableOpacity style={{alignSelf: 'center'}}>
                <MaterialCommunityIcons
                  name="kebab-horizontal"
                  size={15}
                  color="#AEAAAE"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>{renderComponent()}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ParentDoctorPackage;
