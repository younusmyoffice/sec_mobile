import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileInformation from './customComponents/ProfileInformation';
import PaymentDetails from './customComponents/PaymentDetails';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import ContactDetails from './customComponents/ContactDetails';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import axios from 'axios';
import Header from '../../../../components/customComponents/Header/Header';

const Stack = createNativeStackNavigator();

export default function ProfileInfoMainScreen() {
  const {userId} = useCommon();

  const [activeTab, setActiveTab] = useState('ProfileInformation');
  const [formData, setFormData] = useState({
    added_by: 'self',
    suid: '',
    role_id: '',
    profile_picture: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    dialing_code: '',
    contact_no_primary: '',
    contact_no_secondary: '',
    street_address1: '',
    street_address2: '',
    gender: '',
    DOB: '',
    zip_code: '',
    country_id: '',
    state_id: '',
    city_id: '',
    home_no: '',
    location: '',
    fileExtension: '',
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const inputRefs = useRef([]);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };

  const showDetails = async () => {
    const response = await axiosInstance.post(`patientprofile`, {
      suid: userId.toString(),
    });
    setFormData(response?.data.response[0]); 
    setlocal(false);
    setIsDisabled(true);
  };
console.log(userId)
  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://api.shareecare.com/sec/countries');

      setCountryOptions(
        response?.data?.response.map(country => ({
          label: country.country_name,
          value: country.country_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async () => {
    if (!formData.country_id) return;
    try {
      console.log('country', formData.country_id);

      const response = await axios.get(
        `https://api.shareecare.com/sec/states?country_id=${formData.country_id}`,
      );
      setStateOptions(
        response.data.response.map(state => ({
          label: state.state_name,
          value: state.state_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async () => {
    if (!formData.state_id) return;
    try {
      console.log('state', formData.state_id);
      const response = await axios.get(
        `https://api.shareecare.com/sec/cities?state_id=${formData.state_id}`,
      );
      setCityOptions(
        response.data.response.map(state => ({
          label: state.city_name,
          value: state.city_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };
  const [local, setlocal] = useState(true);
  const ProfileDetails = [
    {id: 1, name: 'email', type: 'email', placeholder: 'Email'},
    {id: 1, name: 'first_name', type: 'text', placeholder: 'First Name'},
    {id: 2, name: 'middle_name', type: 'text', placeholder: 'Middle Name'},
    {id: 3, name: 'last_name', type: 'text', placeholder: 'Last Name'},
    {
      id: 4,
      name: 'gender',
      type: 'select',
      placeholder: 'Gender',
      options: [
        {value: 'Male', label: 'Male'},
        {value: 'Female', label: 'Female'},
        {value: 'Others', label: 'Others'},
      ],
    },
    {
      id: 5,
      name: 'DOB',
      type: 'date',
      placeholder: 'Date Of Birth',
      format: 'singleline',
    },
    {
      id: 6,
      name: 'country_id',
      type: 'select',
      placeholder: 'Country',
      
    },
    {id: 7, name: 'state_id', type: 'select', placeholder: 'State'},
    {id: 8, name: 'city_id', type: 'select', placeholder: 'City'},
    {id: 9, name: 'zip_code', type: 'number', placeholder: 'Zip Code'},

    {id: 10, name: 'street_address1', type: 'text', placeholder: 'Street 1'},
    {id: 11, name: 'street_address2', type: 'text', placeholder: 'Street 2'},
  ];

  const firstFive = ProfileDetails.slice(0, 6);
  const rest = ProfileDetails.slice(6);

  const dynamicFields = rest.map(field => {
    if (field.name === 'country_id') {
      return {...field, options: countryOptions};
    }
    if (field.name === 'state_id') {
      return {...field, options: stateOptions};
    }
    if (field.name === 'city_id') {
      return {...field, options: cityOptions};
    }
    return field;
  });

  useEffect(() => {
    showDetails();
    fetchCountries();
  }, [userId]);

  useEffect(() => {
    if (formData?.country_id) fetchStates();
  }, [formData?.country_id]);

  useEffect(() => {
    if (formData?.state_id) fetchCities();
  }, [formData?.state_id]);
  const renderComponent = () => {
    switch (activeTab) {
      case 'ProfileInformation':
        return (
          <ProfileInformation
            firstFive={firstFive}
            formData={formData}
            setFormData={setFormData}
            local={local}
            setlocal={setlocal}
            showdetails={showDetails}
            inputRefs={inputRefs}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            handleEnable={handleEnable}
          />
        );
      case 'ContactDetails':
        return (
          <ContactDetails
            rest={dynamicFields}
            formData={formData}
            setFormData={setFormData}
            showdetails={showDetails}
            inputRefs={inputRefs}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            handleEnable={handleEnable}
          />
        );
      // case 'PaymentDetails':
      //   return <PaymentDetails />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View>

      <Header
            logo={require('../../../../assets/images/ShareecareHeaderLogo.png')}
            locationIcon={false}
        showLocationMark={false}
        notificationUserIcon={true}
          />
      </View>
      <ScrollView>
        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'ProfileInformation'},
              {title: 'ContactDetails'},
              // {title: 'PaymentDetails'},
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
          />
        </View>

        <View style={styles.contentContainer}>{renderComponent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
