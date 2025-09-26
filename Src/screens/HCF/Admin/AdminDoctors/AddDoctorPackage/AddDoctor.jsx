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
const AddDoctor = ({
  adddoctor,
  doctorDetails,
  handleAddDoctorClinic,
  handleChange,
  errors,
}) => {
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
              <>
                <CustomInput
                  name={item.name}
                  type={item.type}
                  value={doctorDetails[item.name]}
                  placeholder={item.placeholder}
                  // addorment={item.isAdorment}
                  // adormentText={item.adormenttext}
                  onChange={handleChange}
                />
                {errors[item.name] && (
                  <Text style={{color: 'red'}}>{errors[item.name]}</Text>
                )}
              </>
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
