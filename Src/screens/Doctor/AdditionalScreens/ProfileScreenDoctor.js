import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfessionalDetails from './ProfileScreenComponents/ProfessionalDetails';
import CustomButton from '../../../components/customButton/CustomButton';
import HeaderDoctor from '../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import TopTabs from '../../../components/customComponents/TopTabs/TopTabs';
import ProfileInformation from './ProfileScreenComponents/ProfileInformation';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseUrl';
import { useCommon } from '../../../Store/CommonContext';
import axiosInstance from '../../../utils/axiosInstance';


const Stack = createNativeStackNavigator();

export default function ProfileScreenDoctor() {
    const {userId} = useCommon();
  
  const [activeTab, setActiveTab] = useState('ProfileInformation');
  const [formData, setFormData] = useState({
    suid: 3,
    email: "waseem008@mail.com",
    first_name: "saqibbb",
    last_name: "sharief",
    middle_name: "",
    gender: "male",
    DOB: "01-1995",
    country_id: "7",
    state_id: "17",
    city_id: "362",
    street_address1: "krishnappa layout",
    street_address2: "shampura",
    zip_code: "560045",
    home_no: 787,
    location: "bangalore",
    qualification: "MBBS",
    university_name: "Manipal",
    qualified_year: 2022,
    speciality_id: 7,
    degree: "MBBS",
    start_date: "2023-10-21",
    state_reg_number: 3231221, // unique
    country_reg_number: 79987971, // unique
    state_reg_date: "2023-10-21",
    country_reg_date: "2023-10-21",
    job: "maskan clinic",
    hospital_org: "maskan clinic",
    lic_title: "lic title of medicine",
    lic_certificate_no: 3275641, // unique
    lic_issuedby: "AIIMS",
    lic_date: "2023-10-21",
    lic_description: "description",
    award_title: "medical e award",
    award_issuedby: "medicine ",
    award_date: "2023-10-21",
    award_description: "medical award",
    council_name: "Karnataka Medical Council",
    profile_picture: "moiz_doctor",
    fileExtension: "jpg"
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const inputRefs = useRef([]);
  const [isDisabled, setIsDisabled] = useState(true);
 const ProfileDetails = [
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
    {id: 10, name: 'home_no', type: 'text', placeholder: 'House No'},

    {id: 11, name: 'street_address1', type: 'text', placeholder: 'Street 1'},
    {id: 12, name: 'street_address2', type: 'text', placeholder: 'Street 2'},
    //educationl
    { id: 13, name: 'qualification', type: 'text', placeholder: 'Qualification' },
    { id: 14, name: 'qualified_year',  type: 'date',
      format: 'singleline', placeholder: 'Year of Passing' },
    { id: 15, name: 'university_name', type: 'text', placeholder: 'University Name' },
    { id: 15, name: 'degree', type: 'text', placeholder: 'Degree' },

    { 
      id: 16, 
      name: 'speciality_id', 
      type: 'select', 
      placeholder: 'Specialisation', 
      options: [
        { value: 'Neurologist', label: 'Neurologist' },
        { value: 'Orthopedics', label: 'Orthopedics' },
        { value: 'Gynecologist', label: 'Gynecologist' },
        { value: 'Dentist', label: 'Dentist' },
      ],
    },
    
    //profestional detail
    { id: 17, name: 'state_reg_number', type: 'number', placeholder: 'State Registration No' },
    { id: 18, name: 'state_reg_date', type: 'date',
      format: 'singleline', placeholder: 'State Registration Date' },
    { id: 19, name: 'country_reg_number', type: 'text', placeholder: 'Country Registration No' },
    { id: 20, name: 'country_reg_date', type: 'date',
      format: 'singleline', placeholder: 'Country Registration Date' },
    
  ];
  const firstFive = ProfileDetails.slice(0, 5);
  const rest = ProfileDetails.slice(5,12);
  const educationalDetail = ProfileDetails.slice(12,17);
  const profestionalDetail = ProfileDetails.slice(17);


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
  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };

  const showDetails = async () => {
    console.log("showDetailscall")
    try {
      const response = await axiosInstance.get(`Doctor/doctorProfileDetailsbyId?doctor_id=${userId}`);
      setFormData(response?.data?.response[0]);
      console.log('Doctor profile details', response?.data?.response);
      setlocal(false);
      setIsDisabled(true);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };
  

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseUrl}countries`);

      setCountryOptions(
        response?.data?.response.map(country => ({
          label: country?.country_name,
          value: country?.country_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async () => {
    if (!formData.country_id) return;
    try {
      console.log('country', formData?.country_id);

      const response = await axios.get(
        `${baseUrl}states?country_id=${formData?.country_id}`,
      );
      setStateOptions(
        response.data.response.map(state => ({
          label: state?.state_name,
          value: state?.state_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async () => {
    if (!formData.state_id) return;
    try {
      console.log('state', formData?.state_id);
      const response = await axios.get(
        `${baseUrl}cities?state_id=${formData?.state_id}`,
      );
      setCityOptions(
        response.data.response.map(state => ({
          label: state?.city_name,
          value: state?.city_id,
        })),
      );
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };
  const [local, setlocal] = useState(true);
  // const dynamicFields = rest.map(field => {
  //   if (field.name === 'country_id') {
  //     return {...field, options: countryOptions};
  //   }
  //   if (field.name === 'state_id') {
  //     return {...field, options: stateOptions};
  //   }
  //   if (field.name === 'city_id') {
  //     return {...field, options: cityOptions};
  //   }
  //   return field;
  // });
  const submitForm = async () => {
    console.log("first Submit",formData);
  }
  useEffect(() => {
    showDetails();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData?.country_id) fetchStates();
  }, [formData?.country_id]);

  useEffect(() => {
    if (formData?.state_id) fetchCities();
  }, [formData?.state_id]);
  const handleDataFromChild = (data) => {
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'ProfileInformation':
        return <ProfileInformation firstFive={firstFive}
        formData={formData}
        rest={dynamicFields}
        setFormData={setFormData}
        local={local}
        setlocal={setlocal}
        showdetails={showDetails}
        inputRefs={inputRefs}
        isDisabled={isDisabled}
        setIsDisabled={setIsDisabled}
        handleEnable={handleEnable}
         />;
      case 'ProfessionalDetails':
        return <ProfessionalDetails 
        educationalDetail={educationalDetail}
        profestionalDetail={profestionalDetail}
        formData={formData}
        setFormData={setFormData}
        showdetails={showDetails}
        inputRefs={inputRefs}
        isDisabled={isDisabled}
        setIsDisabled={setIsDisabled}
        handleEnable={handleEnable}
        submitForm={submitForm}/>;
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <View>
        {/* <HeaderDoctor /> */}
      </View>
      <ScrollView>
        {activeTab === 'Staff' ? (
          <View
            style={{
              alignItems: 'flex-end',
              marginTop: 10,
              paddingHorizontal: 15,
            }}>
            <CustomButton
              title="Create Staff"
              borderColor="#E72B4A"
              textColor="#E72B4A"
              borderWidth={1}
              borderRadius={30}
              width={wp(35)}
              fontfamily="Poppins-SemiBold"
              // onPress={() => setisAllow(!isAllow)}
              // showhide={isAllow}
            />
          </View>
        ) : null}

        <View style={{margin: 10}}>
          <TopTabs
            borderRadius={8}
            bordercolor={'#fff'}
            data={[
              {title: 'ProfileInformation'},
              {title: 'ProfessionalDetails'},
             
            ]}
            borderwidth={1}
            activeTab={activeTab} // Pass the activeTab state
            setActiveTab={setActiveTab} // Pass the setActiveTab function to change tab
          />
        </View>

        <View style={styles.contentContainer}>
          {renderComponent()}
        </View>
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
