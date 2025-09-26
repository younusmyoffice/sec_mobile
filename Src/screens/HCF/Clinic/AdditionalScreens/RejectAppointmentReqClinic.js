import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomRadioButton from '../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import { baseUrl } from '../../../utils/baseUrl';
import { useNavigation } from '@react-navigation/native';

import axiosInstance from '../../../utils/axiosInstance';

const RejectAppointmentReqClinic = ({ route }) => {
  const [selectReschedule, setselectReschedule] = useState();
  const { navData } = route.params;
  console.log("navData",navData)
  const navigation = useNavigation();




  const rejectAppointment = async (navData) => {
    

    try {
      // Fix the payload: Use doctor_id from ApiData instead of patient_id
      console.log('apidata',navData.appointment_id)
      const response = await axiosInstance.post(
        `${baseUrl}Doctor/AppointmentsRequestsReject`,
        {
          appointment_id: navData.appointment_id,
          patient_id: navData.patient_id,
          doctor_id: navData.doctor_id, // Corrected this
          status: "in_progress", // Status for the appointment
          reason: selectReschedule,
          option: "reject", // Action for accepting the appointment
        }
);

      console.log('Appointment rejected :', response.data);
      navigation.goBack('')
      doctorRequestAppointment();
      // If the response is successful, you can update the UI or handle it accordingly
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to reject appointment. Please try again later.';
    
    } finally {
     
    }
  };

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
    <ScrollView  style={{backgroundColor:'#fff'}} >
      <SafeAreaView style={{backgroundColor:'#fff'}}>
        <HeaderDoctor/>
       
        
          
       
        <View style={{gap: 30, padding:15}}>
        <InAppCrossBackHeader backgroundColor={'#fff'} showClose={true} />
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: 'black',
                fontWeight: '400',
                fontFamily:'Poppins-SemiBold'
              }}>
              Reject Appointment Request
            </Text>
            <Text style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#484649',
                fontWeight: '400',
                fontFamily:'Poppins-SemiBold'
              }}>
                Are You sure. You want to cancel the appointment.
            </Text>
          </View>
          <View style={{padding: 15, gap: 25}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
              Reason for Rejection
            </Text>
            <View style={{gap: 10}}>
              {reschedule.map((radio, id) => (
                <CustomRadioButton
                  key={radio.id}
                  label={radio.label}
                  selected={selectReschedule === radio.label}
                  onPress={() => handleChange(radio.label)}
                  fontSize={18}
                  //   fontweight={200}
                />
              ))}
            </View>
          </View>
          <View style={{paddingHorizontal: 25}}>
            <Text style={{fontSize: 16, lineHeight: 22}}>
              Note : Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed ut tellus quis sapien interdum commodo. Nunc tincidunt justo
              non dolor bibendum,
            </Text>
          </View>
          <View style={{alignSelf: 'center'}}>
            <CustomButton
              title="Done"
              borderColor={18}
              bgColor={'#E72B4A'}
              textColor={'white'}
              width={250}
              padding={5}
              borderRadius={30}
              onPress={()=> rejectAppointment(navData)

              }
            />
          </View>
        </View>
      
   
    </SafeAreaView>
    </ScrollView>
  );
};

export default RejectAppointmentReqClinic;

