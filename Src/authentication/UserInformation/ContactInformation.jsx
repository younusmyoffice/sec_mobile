import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CustomInput from '../../components/customInputs/CustomInputs';
import authenticationStyle from '../AuthenticationStyle';
import { baseUrl } from '../../utils/baseUrl';

const ContactInformation = ({data, formData, onChange}) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${baseUrl}countries`);
      // console.log(
      //   'id:',
      //   response.data.response.map(item => {
      //     return item.country_id;
      //   }),
      // );
      setCountryOptions(
        response?.data?.response.map(country => ({
          label: country.country_name,
          value: country.country_id,
        })),
      );
      console.log('country:', countryOptions);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
  const fetchStates = async () => {
    if (!formData.country_id) return;
    try {
      const response = await axios.get(`${baseUrl}states?country_id=${formData.country_id}`);
      setStateOptions(
        response.data.response.map((state) => ({
          label: state.state_name,
          value: state.state_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  const fetchCities = async () => {
    if (!formData.state_id) return;
    try {
      const response = await axios.get(`${baseUrl}cities?state_id=${formData.state_id}`);
      setCityOptions(
        response.data.response.map((state) => ({
          label: state.city_name,
          value: state.city_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };
  console.log(cityOptions)

  const dynamicFields = data.map((field) => {
    if (field.name === "country_id") {
      return { ...field, options: countryOptions };
    }
    if (field.name === "state_id") {
      return { ...field, options: stateOptions };
    }
    if (field.name === "city_id") {
      return { ...field, options: cityOptions };
    }
    
    return field;
  });
  useEffect(() => {
    fetchCountries();
    fetchStates();
    fetchCities();
  }, [formData.country_id,formData.state_id]);

  return (
    <SafeAreaView>
      <View style={{gap: 50}}>
        <Text style={authenticationStyle.signUp}>Contact Information</Text>
        <View style={{gap: 25}}>
          <View style={{gap: 20}}>
            {dynamicFields.map(field => (
              <CustomInput
                key={field.id}
                placeholder={field.placeholder}
                name={field.name}
                type={field.type}
                options={field.options}
                value={formData[field.name]}
                onChange={onChange}
                fontSize={20}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactInformation;
