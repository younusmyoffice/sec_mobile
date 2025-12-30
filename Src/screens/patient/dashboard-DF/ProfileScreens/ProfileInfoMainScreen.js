/**
 * ============================================================================
 * PROFILE INFO MAIN SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for patients to view and edit their profile information.
 * Manages tabs for Profile Information and Contact Details.
 * 
 * FEATURES:
 * - Tabbed interface (Profile Information, Contact Details)
 * - Dynamic form fields with validation
 * - Country/State/City cascading dropdowns
 * - Profile image upload
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - Uses userId from CommonContext (preferred over AsyncStorage)
 * - Input validation for profile updates
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - TopTabs: Tab navigation
 * - Header: App header
 * - ProfileInformation, ContactDetails: Profile sub-components
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * NOTE:
 * - Uses axios directly for public APIs (countries, states, cities) - no auth required
 * - Uses axiosInstance for authenticated profile APIs
 * 
 * @module ProfileInfoMainScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState, useMemo} from 'react';
import ProfileInformation from './customComponents/ProfileInformation';
import ContactDetails from './customComponents/ContactDetails';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import Header from '../../../../components/customComponents/Header/Header';
import axiosInstance from '../../../../utils/axiosInstance';
import axios from 'axios';
import {useCommon} from '../../../../Store/CommonContext';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';

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
  const [loading, setLoading] = useState(false);

  /**
   * Enable form editing
   */
  const handleEnable = () => {
    Logger.debug('Profile editing enabled');
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };

  /**
   * Fetch and display profile details
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const showDetails = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for profile details', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    try {
      setLoading(true);
      Logger.api('POST', 'patientprofile', {
        suid: userId.toString(),
      });

      const response = await axiosInstance.post(`patientprofile`, {
        suid: userId.toString(),
      });

      Logger.debug('Profile details response', {
        hasData: !!response?.data?.response?.[0],
      });

      // SECURITY: Validate response data type
      if (response?.data?.response && Array.isArray(response.data.response) && response.data.response.length > 0) {
        setFormData(response.data.response[0]);
        Logger.info('Profile details loaded successfully');
      } else {
        Logger.warn('No profile data found');
        CustomToaster.show('warning', 'No Data', 'Profile information not found.');
      }

      setIsDisabled(true);
    } catch (error) {
      Logger.error('Error fetching profile details', error);
      
      const errorMessage = error?.response?.data?.message ||
        'Failed to fetch profile details. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch countries list
   * NOTE: Uses axios (not axiosInstance) for public API - no auth required
   */
  const fetchCountries = async () => {
    try {
      Logger.api('GET', 'countries', null, { useAxios: true });

      // NOTE: Using axios (not axiosInstance) for public API
      const response = await axiosInstance.get('countries');

      // SECURITY: Validate response data type
      if (response?.data?.response && Array.isArray(response.data.response)) {
        setCountryOptions(
          response.data.response.map(country => ({
            label: country.country_name,
            value: country.country_id,
          })),
        );
        Logger.info('Countries loaded successfully', {
          count: response.data.response.length,
        });
      } else {
        Logger.warn('Invalid countries response format');
        setCountryOptions([]);
      }
    } catch (error) {
      Logger.error('Error fetching countries', error);
      CustomToaster.show('error', 'Error', 'Failed to load countries. Please try again later.');
      setCountryOptions([]);
    }
  };

  /**
   * Fetch states for selected country
   * SECURITY: Validates country_id before API call
   * NOTE: Uses axiosInstance (though public API, keeping consistent)
   */
  const fetchStates = async () => {
    // SECURITY: Validate country_id before API call
    if (!formData.country_id) {
      Logger.warn('Country ID not available for fetching states');
      return;
    }

    try {
      Logger.api('GET', `states?country_id=${formData.country_id}`, null, { useAxios: true });

      const response = await axiosInstance.get(`states?country_id=${formData.country_id}`);
      
      // SECURITY: Validate response data type
      if (response?.data?.response && Array.isArray(response.data.response)) {
        setStateOptions(
          response.data.response.map(state => ({
            label: state.state_name,
            value: state.state_id,
          })),
        );
        Logger.info('States loaded successfully', {
          count: response.data.response.length,
          countryId: formData.country_id,
        });
      } else {
        Logger.warn('Invalid states response format');
        setStateOptions([]);
      }
    } catch (error) {
      Logger.error('Error fetching states', error);
      CustomToaster.show('error', 'Error', 'Failed to load states. Please try again later.');
      setStateOptions([]);
    }
  };

  /**
   * Fetch cities for selected state
   * SECURITY: Validates state_id before API call
   * NOTE: Uses axiosInstance (though public API, keeping consistent)
   */
  const fetchCities = async () => {
    // SECURITY: Validate state_id before API call
    if (!formData.state_id) {
      Logger.warn('State ID not available for fetching cities');
      return;
    }

    try {
      Logger.api('GET', `cities?state_id=${formData.state_id}`, null, { useAxios: true });

      const response = await axiosInstance.get(`cities?state_id=${formData.state_id}`);
      
      // SECURITY: Validate response data type
      if (response?.data?.response && Array.isArray(response.data.response)) {
        setCityOptions(
          response.data.response.map(city => ({
            label: city.city_name,
            value: city.city_id,
          })),
        );
        Logger.info('Cities loaded successfully', {
          count: response.data.response.length,
          stateId: formData.state_id,
        });
      } else {
        Logger.warn('Invalid cities response format');
        setCityOptions([]);
      }
    } catch (error) {
      Logger.error('Error fetching cities', error);
      CustomToaster.show('error', 'Error', 'Failed to load cities. Please try again later.');
      setCityOptions([]);
    }
  };

  /**
   * Profile form fields configuration
   */
  const ProfileDetails = [
    {id: 1, name: 'email', type: 'email', placeholder: 'Email'},
    {id: 2, name: 'first_name', type: 'text', placeholder: 'First Name'},
    {id: 3, name: 'middle_name', type: 'text', placeholder: 'Middle Name'},
    {id: 4, name: 'last_name', type: 'text', placeholder: 'Last Name'},
    {
      id: 5,
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
      id: 6,
      name: 'DOB',
      type: 'date',
      placeholder: 'Date Of Birth',
      format: 'singleline',
    },
    {
      id: 7,
      name: 'country_id',
      type: 'select',
      placeholder: 'Country',
    },
    {id: 8, name: 'state_id', type: 'select', placeholder: 'State'},
    {id: 9, name: 'city_id', type: 'select', placeholder: 'City'},
    {id: 10, name: 'zip_code', type: 'number', placeholder: 'Zip Code'},
    {id: 11, name: 'street_address1', type: 'text', placeholder: 'Street 1'},
    {id: 12, name: 'street_address2', type: 'text', placeholder: 'Street 2'},
  ];

  const firstFive = ProfileDetails.slice(0, 6);
  const rest = ProfileDetails.slice(6);

  /**
   * Dynamically set options for country, state, city fields
   * PERFORMANCE: Uses useMemo for optimization
   */
  const dynamicFields = useMemo(() => {
    return rest.map(field => {
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
  }, [countryOptions, stateOptions, cityOptions]);

  /**
   * Fetch profile details and countries on mount
   */
  useEffect(() => {
    if (userId) {
      Logger.debug('ProfileInfoMainScreen initialized', { userId });
      showDetails();
      fetchCountries();
    } else {
      Logger.warn('ProfileInfoMainScreen: userId not available');
    }
  }, [userId]);

  /**
   * Fetch states when country changes
   */
  useEffect(() => {
    if (formData?.country_id) {
      Logger.debug('Country changed, fetching states', { countryId: formData.country_id });
      fetchStates();
      // Reset state and city when country changes
      setFormData(prev => ({
        ...prev,
        state_id: '',
        city_id: '',
      }));
    }
  }, [formData?.country_id]);

  /**
   * Fetch cities when state changes
   */
  useEffect(() => {
    if (formData?.state_id) {
      Logger.debug('State changed, fetching cities', { stateId: formData.state_id });
      fetchCities();
      // Reset city when state changes
      setFormData(prev => ({
        ...prev,
        city_id: '',
      }));
    }
  }, [formData?.state_id]);

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    Logger.debug('Rendering profile component', { activeTab });

    switch (activeTab) {
      case 'ProfileInformation':
        return (
          <ProfileInformation
            firstFive={firstFive}
            formData={formData}
            setFormData={setFormData}
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
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && <CustomLoader />}

      <View>
        <Header
          logo={require('../../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={false}
          notificationUserIcon={true}
        />
      </View>
      
      <ScrollView>
        <View style={styles.tabsContainer}>
          <TopTabs
            borderRadius={8}
            bordercolor={COLORS.BG_WHITE}
            data={[
              {title: 'ProfileInformation'},
              {title: 'ContactDetails'},
              // {title: 'PaymentDetails'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              Logger.debug('Tab changed', { from: activeTab, to: tab });
              setActiveTab(tab);
            }}
          />
        </View>

        <View style={styles.contentContainer}>
          {renderComponent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE,
    flex: 1,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
