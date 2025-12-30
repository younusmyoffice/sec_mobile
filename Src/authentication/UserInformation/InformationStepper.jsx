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
import axiosInstance from '../../utils/axiosInstance';
import QualificationInformation from './QualificationInformation';
import ProsessionalInformation from './ProsessionalInformation';
import {baseUrl} from '../../utils/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InformationStepper = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  console.log('🔍 Full route.params:', route.params);
  const {email, role_id} = route.params;
  
  // Ensure role_id is a number
  const normalizedRoleId = Number(role_id);
  
  console.log('📧 Email:', email);
  console.log('🔢 Raw role_id:', role_id, 'type:', typeof role_id);
  console.log('🔢 Normalized role_id:', normalizedRoleId, 'type:', typeof normalizedRoleId);
  const [active, setActive] = useState(0);

  const baseFields = {
    email: email,
    role_id: normalizedRoleId,
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
    normalizedRoleId === 5
      ? {
          ...baseFields,
        }
      : normalizedRoleId === 3
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

  console.log('🔍 InformationStepper - normalizedRoleId:', normalizedRoleId, 'type:', typeof normalizedRoleId);
  console.log('🔍 InformationStepper - fields:', modifiedFields);

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
    
    // FIX: Added ClinicNavigation for role_id 6
    const dashboardNavigate =
      normalizedRoleId === 5
        ? 'PatientNavigation'
        : normalizedRoleId === 3
        ? 'DoctorNavigation'
        : normalizedRoleId === 4
        ? 'DiagnosticNavigation'
        : normalizedRoleId === 6
        ? 'ClinicNavigation'
        : null;

    try {
      // Helpers to coerce and sanitize payload
      const toIntOrNull = v => {
        if (v === undefined || v === null || v === '') return null;
        const n = parseInt(v, 10);
        return Number.isNaN(n) ? null : n;
      };
      const toTrimOrNull = v => {
        if (v === undefined || v === null) return null;
        const s = String(v).trim();
        return s === '' ? null : s;
      };
      const toDateOrNull = v => {
        const s = toTrimOrNull(v);
        if (!s) return null;
        // Accept YYYY-MM-DD or DD-MM-YYYY, normalize to YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        // Fallback: try Date parse
        const d = new Date(s);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        return null;
      };
      const normalizeQualifiedYear = v => {
        if (v === undefined || v === null || v === '') return null;
        const s = String(v);
        const yearFromDate = s.match(/^(\d{4})-\d{2}-\d{2}$/);
        if (yearFromDate) return parseInt(yearFromDate[1], 10);
        const dmy = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dmy) return parseInt(dmy[3], 10);
        const n = parseInt(s, 10);
        return Number.isNaN(n) ? null : n;
      };

      // Build role-specific payload
      const payload = normalizedRoleId === 3 ? {
        role_id: normalizedRoleId,
        email: toTrimOrNull(formData.email),
        first_name: toTrimOrNull(formData.first_name),
        last_name: toTrimOrNull(formData.last_name),
        middle_name: toTrimOrNull(formData.middle_name),
        gender: toTrimOrNull(formData.gender)?.toLowerCase() || null,
        DOB: toDateOrNull(formData.DOB),
        qualification: toTrimOrNull(formData.qualification),
        university_name: toTrimOrNull(formData.university_name),
        qualified_year: normalizeQualifiedYear(formData.qualified_year),
        speciality_id: toIntOrNull(formData.speciality_id),
        degree: toTrimOrNull(formData.degree),
        state_reg_number: toTrimOrNull(formData.state_reg_number),
        country_reg_number: toTrimOrNull(formData.country_reg_number),
        state_reg_date: toDateOrNull(formData.state_reg_date),
        country_reg_date: toDateOrNull(formData.country_reg_date),
        council_name: toTrimOrNull(formData.council_name),
        street_address1: toTrimOrNull(formData.street_address1),
        street_address2: toTrimOrNull(formData.street_address2),
        country_id: toIntOrNull(formData.country_id),
        state_id: toIntOrNull(formData.state_id),
        city_id: toIntOrNull(formData.city_id),
        zip_code: toTrimOrNull(formData.zip_code),
        lic_title: toTrimOrNull(formData.lic_title),
        lic_certificate_no: toIntOrNull(formData.lic_certificate_no),
        lic_issuedby: toTrimOrNull(formData.lic_issuedby),
        lic_date: toDateOrNull(formData.lic_date),
        lic_description: toTrimOrNull(formData.lic_description),
      } : {
        role_id: normalizedRoleId,
        email: toTrimOrNull(formData.email),
        first_name: toTrimOrNull(formData.first_name),
        last_name: toTrimOrNull(formData.last_name),
        middle_name: toTrimOrNull(formData.middle_name),
        gender: toTrimOrNull(formData.gender)?.toLowerCase() || null,
        DOB: toDateOrNull(formData.DOB),
        street_address1: toTrimOrNull(formData.street_address1),
        street_address2: toTrimOrNull(formData.street_address2),
        country_id: toIntOrNull(formData.country_id),
        state_id: toIntOrNull(formData.state_id),
        city_id: toIntOrNull(formData.city_id),
        zip_code: toTrimOrNull(formData.zip_code),
      };

      // Remove undefined keys (convert to null or omit)
      Object.keys(payload).forEach(k => {
        if (payload[k] === undefined) payload[k] = null;
      });

      const response = await axiosInstance.post(
        `auth/updateProfile`,
        payload,
      );
      
      console.log('✅ Profile update successful:', response.data);
      console.log('🚀 Navigating to:', dashboardNavigate);
      console.log('🔢 Role ID from form:', normalizedRoleId);
      console.log('🔢 Role ID from response:', response.data?.response?.role_id);
      console.log('🔢 Sec Role ID from response:', response.data?.response?.sec_role_id);
      
      // FIX: Update stored role_id after profile completion (use sec_role_id if role_id is null)
      const responseRoleId = response.data?.response?.role_id || response.data?.response?.sec_role_id;
      if (responseRoleId) {
        try {
          await AsyncStorage.setItem('role_id', JSON.stringify(responseRoleId));
          console.log('✅ Updated stored role_id to:', responseRoleId);
        } catch (error) {
          console.error('❌ Error updating role_id:', error);
        }
      }
      
      if (dashboardNavigate) {
        console.log('✅ Navigating to dashboard:', dashboardNavigate);
        navigation.replace(dashboardNavigate); // FIX: Use replace instead of navigate to prevent back navigation
      } else {
        console.log('❌ No dashboard navigation defined for role_id:', normalizedRoleId);
        console.log('⚠️ This should not happen - all supported roles should have navigation');
        // Fallback navigation - navigate to login as a safety measure
        navigation.navigate('Login', { role_id: normalizedRoleId });
      }
      
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

  // Diagnostic content - similar to patient but with contact info
  const Diagnosticcontent = [
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

  // FIX: Added Clinic content (same as Patient/Diagnostic - Personal + Contact)
  const Cliniccontent = [
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

  const baseContent =
    normalizedRoleId === 5 ? Patientcontent : 
    normalizedRoleId === 3 ? Doctorcontent : 
    normalizedRoleId === 4 ? Diagnosticcontent :
    normalizedRoleId === 6 ? Cliniccontent : [];
  
  // If no valid content, show error message
  if (!baseContent || baseContent.length === 0) {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18, color: 'red', textAlign: 'center'}}>
          Invalid role_id: {normalizedRoleId} (raw: {role_id}). Please contact support.
        </Text>
      </SafeAreaView>
    );
  }
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
