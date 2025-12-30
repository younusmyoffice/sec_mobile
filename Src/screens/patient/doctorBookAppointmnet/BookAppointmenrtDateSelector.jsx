import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import DatePicker from '../../../components/callendarPicker/DatePickerCallendar';
import CustomInput from '../../../components/customInputs/CustomInputs';
import CustomButton from '../../../components/customButton/CustomButton';
// import TimePicker from 'react-time-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import TimeRangePicker from '../../../components/callendarPicker/TimeRangePicker';
import axiosInstance from '../../../utils/axiosInstance';
import {baseUrl} from '../../../utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BookAppointmenrtDateSelector = ({
  patientdetails,
  SetPatientDetails,
  // doctorid,
  availableDates,
  availableDurations,
}) => {
  // const [availableDates, setAvailableDates] = useState([]);
  // const [availableDurations, setAvailableDurations] = useState([]);

  console.log('availableDurations', availableDurations);
  console.log('📅 DateSelector - Current patientdetails:', patientdetails);
  
  const handleChange = (name, value) => {
    console.log(`📅 DateSelector - Setting ${name}:`, value);
    SetPatientDetails(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // console.log(patientdetails)
  // const fetchSuidAndDates = async () => {
  //   try {
  //     const suid = await AsyncStorage.getItem('suid');
  //     console.log('SUID:', suid);
  //     setUserId(suid);
  //     fetchAvailableDates();
  //   } catch (error) {
  //     console.error('Error fetching suid:', error);
  //   }
  // };

  // const fetchAvailableDates = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       `patient/getAvailableAppointmentDates`,
  //       {
  //         doctor_id: doctorid,
  //       },
  //     );
  //     setAvailableDates(response?.data?.availableDates);
  //     // console.log('dates', response.data.availableDates);
  //     // console.log(response)
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const fetchDuration = async () => {
  //   const response = await axiosInstance.get(
  //     `patient/getAppointmentPlanDuration/${doctorid}?date=${patientdetails.date}`,
  //   );
  //   console.log(
  //     `duration now ` + patientdetails.date,
  //     response.data.response.durations,
  //   );
  //   setAvailableDurations(response.data.response.durations);
  // };
  // useEffect(() => {
  //   // fetchSuidAndDates();
  //   fetchAvailableDates();

  //   fetchDuration();
  // }, [patientdetails.date]);

  return (
    <ScrollView>
      <SafeAreaView>
        {/* <View>
          <Header />
        </View> */}
        {/* <View>
          <InAppCrossBackHeader showClose={true} />
        </View> */}
        <View style={{gap: 10}}>
          <View style={{marginTop: '5%'}}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              Select Date
            </Text>

            <DatePicker
              availableDates={availableDates}
              patientdetails={patientdetails}
              SetPatientDetails={SetPatientDetails}
            />
          </View>
          <View style={{gap: 10}}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              Select Time
            </Text>
            {/* <CustomInput
              placeholder={'Select Time'}
              type={'select'}
              name={'time'}
              options={time}
              // fontSize={20}
            /> */}
            <CustomInput
              type={'select'}
              options={
                availableDurations && availableDurations.length > 0
                  ? availableDurations.map(item => ({
                      label: item?.plan_duration,
                      value: item?.plan_duration,
                    }))
                  : [{label: 'Please Wait...', value: ''}]
              }
              name={'duration'}
              value={patientdetails['duration']}
              onChange={handleChange}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default BookAppointmenrtDateSelector;
