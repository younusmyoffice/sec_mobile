import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import InAppCrossBackHeader from '../../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import ClinicHeader from '../../../../components/customComponents/ClinicHeader/ClinicHeader';
import CustomRadioButton from '../../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import Header from '../../../../components/customComponents/Header/Header';

const RejectPatientAppointment = () => {
  const [selectReschedule, setselectReschedule] = useState();

  const reschedule = [
    {id: 1, label: 'I have a schedule clash.'},
    {id: 2, label: 'I am not available at the schedule'},
    {id: 3, label: 'Reason 3'},
    {id: 4, label: 'Reason 4'},
    {id: 5, label: 'Reason 5'},
  ];

  const handleChange = radio => {
    setselectReschedule(radio);
  };

  console.log(selectReschedule);

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
      <Header
        logo={require('../../../../assets/Clinic1.jpeg')}
        notificationUserIcon={true}
        width={wp(41)}
        height={hp(4)}
        resize={'contain'}
        onlybell={true}
      
      />
        <View style={{gap: 15, padding: 15}}>
          <InAppCrossBackHeader backgroundColor={'#fff'} showClose={true} />
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: 'black',
                fontWeight: '400',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Reject Appointment Request
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#484649',
                fontWeight: '400',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Are You sure. You want to cancel the appointment.
            </Text>
          </View>
          <View style={{gap: 25}}>
            <Text style={{fontSize: hp(2), color: 'black', fontWeight: '500'}}>
              Reason for Rejection
            </Text>
            <View style={{gap: 10}}>
              {reschedule.map((radio, id) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={hp(1.8)}
                />
              ))}
            </View>
          </View>
          {/* <View style={{paddingHorizontal: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22}}>
              Note : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo
              non dolor bibendum,
            </Text>
          </View> */}
          <View>
            <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
              Add Note
            </Text>
          </View>
          <CustomInput type={'textarea'} />
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Done"
              bgColor={'#E72B4A'}
              fontfamily={'Poppins-SemiBold'}
              textColor={'white'}
              fontSize={hp(2)}
              borderRadius={20}
              width={wp(60)}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default RejectPatientAppointment;
