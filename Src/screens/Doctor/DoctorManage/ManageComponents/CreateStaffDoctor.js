import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React from 'react';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import InAppCrossBackHeader from '../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
const CreateStaffDoctor = () => {
    const navigation=useNavigation()
  const staff = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      placeholder: 'Name',
    },
    {
      id: 2,
      name: 'designation',
      type: 'select',
      placeholder: 'Designation',
      options: [
        {
          value: 'Senior Staff',
          label: 'Senior Staff',
        },
        {
          value: 'Junior Staff',
          label: 'Junior Staff',
        },
      ],
    },
    {
      id: 1,
      name: 'department',
      type: 'select',
      placeholder: 'Department',
      options: [
        {
          value: 'Senior Staff',
          label: 'Senior Staff',
        },
        {
          value: 'Junior Staff',
          label: 'Junior Staff',
        },
      ],
    },
    {
      id: 4,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
    },
    {
      id: 5,
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile No',
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
  const handleStaffVerify=()=>{
    navigation.navigate('createstaff-otpverify')
  }
  return (
    <ScrollView style={{backgroundColor:'#fff'}}>
      <SafeAreaView>
        <View>
          <HeaderDoctor />
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
            {staff.map((item, i) => (
              <CustomInput
                type={item.type}
                options={item.options}
                placeholder={item.placeholder}
                name={item.name}
              />
            ))}
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Next"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-Medium'}
              borderRadius={20}
              textColor={'white'}
              width={wp(50)}
              onPress={handleStaffVerify}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateStaffDoctor;
