import React, {useEffect, useState} from 'react';
import {Alert, Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import Stepper from '../../components/customStepper/CustomStepper';
import PersonalInformation from './PersonalInformation';
import ContactInformation from './ContactInformation';
import {
  personal,
  contact,
  qualification,
  professional,
} from '../../utils/Helper';
import {handleLocation} from '../../utils/data';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import QualificationInformation from './QualificationInformation';
import ProsessionalInformation from './ProsessionalInformation';
import {baseUrl} from '../../utils/baseUrl';

const InformationStepper = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {email, role_id} = route.params;
  console.log(email);
  const [active, setActive] = useState(0);

  const baseFields = {
    email: email,
    role_id: role_id,
    first_name: '',
    middle_name: '',
    last_name: '',
    DOB: '',
    gender: '',
    added_by: 'self',
    street_address1: '',
    street_address2: '',
    country_id: '',
    state_id: '',
    city_id: '',
    zip_code: '',
  };

  const modifiedFields =
    role_id === 5
      ? {
          ...baseFields,
        }
      : role_id === 3
      ? {
          ...baseFields,
          qualification: '',
          university_name: '',
          qualified_year: '',
          speciality_id: 0,
          degree: '',
          state_reg_number: 0,
          country_reg_number: 0,
          state_reg_date: '',
          council_name: '',
        }
      : {};

  console.log('roleid', role_id);
  console.log('fields', modifiedFields);

  const [formData, setFormData] = useState(modifiedFields);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [country, setCountry] = useState();

  const handleDayPress = (day, name) => {
    setStartDate(day.dateString);
    console.log('field', name);
    setFormData({
      ...formData,
      [name]: day.dateString,
    }); // } else {;
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        color: '#E72B4A',
        textColor: 'white',
      },
    });

    //   if (!startDate || (endDate && day.dateString <= startDate)) {
    //     resetDates();
    //     setStartDate(day.dateString);
    //     setMarkedDates({
    //       [day.dateString]: {
    //         startingDay: true,
    //         selected: true,
    //         color: '#E72B4A',
    //         textColor: 'white',
    //       },
    //     });
    //   } else {
    //     setEndDate(day.dateString);
    //     setMarkedDates(prev => ({
    //       ...prev,
    //       ...calculateMarkedDates(startDate, day.dateString),
    //       [day.dateString]: {
    //         endingDay: true,
    //         selected: true,
    //         color: '#E72B4A',
    //         textColor: 'white',
    //       },
    //     }));
    //   }
    // }
  };

  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {selected: true, color: '#E72B4A', textColor: 'white'};
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };

  const resetDates = () => {
    setStartDate('');
    setEndDate('');
    setMarkedDates({});
  };

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'country_id') {
      setFormData(prev => ({
        ...prev,
        state_id: '',
      }));
    }
  };

  const handleCompleteProfile = async () => {
    console.log(formData);
    const dashboardNavigate =
      role_id === 5
        ? 'PatientNavigation'
        : role_id === 3
        ? 'DoctorNavigation'
        : null;

    try {
      const response = await axios.post(
        `${baseUrl}auth/updateProfile`,
        formData,
      );
      navigation.navigate(dashboardNavigate);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };
  const Patientcontent = [
    <PersonalInformation
      data={personal}
      formData={formData}
      onChange={handleChange}
      calculateMarkedDates={calculateMarkedDates}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      handleDayPress={handleDayPress}
      resetDates={resetDates}
      markedDates={markedDates}
    />,
    <ContactInformation
      data={contact}
      formData={formData}
      onChange={handleChange}
    />,
  ];

  const Doctorcontent = [
    <PersonalInformation
      data={personal}
      formData={formData}
      onChange={handleChange}
      calculateMarkedDates={calculateMarkedDates}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      handleDayPress={day => handleDayPress(day, 'DOB')}
      resetDates={resetDates}
      markedDates={markedDates}
    />,
    <QualificationInformation
      data={qualification}
      formData={formData}
      onChange={handleChange}
      calculateMarkedDates={calculateMarkedDates}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      handleDayPress={day => handleDayPress(day, 'qualified_year')}
      resetDates={resetDates}
      markedDates={markedDates}
    />,
    <ProsessionalInformation
      data={professional}
      formData={formData}
      onChange={handleChange}
      calculateMarkedDates={calculateMarkedDates}
      endDate={endDate}
      startDate={startDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      handleDayPress={day => handleDayPress(day, 'state_reg_date')}
      resetDates={resetDates}
      markedDates={markedDates}
    />,
    <ContactInformation
      data={contact}
      formData={formData}
      onChange={handleChange}
    />,
  ];

  const baseContent =
    role_id === 5 ? Patientcontent : role_id === 3 ? Doctorcontent : null;
  console.log(formData);
  return (
    <ScrollView>
      <SafeAreaView style={{backgroundColor: '#fff'}}>
        <View style={{paddingHorizontal: 10}}>
          <Image
            source={require('../../assets/labellogo.png')}
            style={{height: 60, width: 150, resizeMode: 'contain'}}
          />
        </View>
        <View style={{marginVertical: 20, marginHorizontal: 20}}>
          <Stepper
            active={active}
            content={baseContent}
            onBack={() => setActive(p => p - 1)}
            onFinish={() => {
              handleCompleteProfile();
            }}
            onNext={() => {
              console.log('hello');
              setActive(p => p + 1);
            }}
            // width={250}
            padding={5}
            borderRadius={30}
            fontSize={20}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default InformationStepper;
