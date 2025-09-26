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
    hcf_id: userId.toString(), //Hcf
    staff_designation: '',
    lab_department_id: '', //lab department
  });

  const [handleemailotp, setHandleemailotp] = useState({
    email: '',
    // mobile: '',
    role_id: '4',
    hcf_id: userId.toString(),
    register_with_email: 'true',
  });
  const [handlemobileotp, setHandlemobbileotp] = useState({
    email: createStaff?.email,
    mobile: '',
    role_id: '4',
    hcf_id: userId.toString(),
    register_with_email: 'false',
  });
  const [visible, setVisible] = useState(false);
  const [visibleMobileModal, setVisibleMobileModal] = useState(false);
  const handleEmailVerify = async () => {
    setVisible(true);
    // setHandleemailotp(prevstate => ({...prevstate, register_with_email: 'true'}));
    try {
      const response = await axiosInstance.post('hcf/addStaff', handleemailotp);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMobileVerify = async () => {
    // setHandleotp(prevstate => ({...prevstate, register_with_email: 'false'}));
    setVisibleMobileModal(true);
    try {
      const response = await axiosInstance.post(
        'hcf/addStaff',
        handlemobileotp,
      );
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
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

  const handleAddStaff =async () => {
  try {
    const response= await axiosInstance.post(`hcf/addStaff`,createStaff)
    console.log(response.data)
    CustomToaster.show('success','Staff Addded Succesfully')
    navigation.goBack()
  } catch (error) {
    console.log(error)
    CustomToaster.show('error','Someting went wrong')
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
              <CustomInput
                type={item.type}
                options={item.options}
                placeholder={item.placeholder}
                name={item.name}
                value={createStaff[item.name] || ''}
                onChange={handleChange}
                addorment={true}
                adormentText={item.adormentText}
                handleVerify={
                  item.handleVerify ? () => item.handleVerify() : undefined
                }
              />
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
