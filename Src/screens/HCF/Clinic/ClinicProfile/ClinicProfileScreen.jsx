/**
 * ============================================================================
 * CLINIC PROFILE SCREEN
 * ============================================================================
 * 
 * PURPOSE:
 * Main screen for Clinic users to view and edit their profile information.
 * 
 * FEATURES:
 * - Display and edit clinic profile details
 * - Dynamic country/state/city dropdowns
 * - Profile image upload
 * - Form validation and submission
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Validates userId before API calls
 * - External APIs (countries/states/cities) use direct axios (no auth required)
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Loading states with CustomLoader
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomLoader: Loading indicator
 * - CustomToaster: Toast notifications
 * - TopTabs: Tab navigation
 * - ProfileInformationClinic: Profile form component
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ClinicProfileScreen
 */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import axios from 'axios'; // NOTE: Used for external public APIs (countries/states/cities) that don't require auth
import Header from '../../../../components/customComponents/Header/Header';
import ProfileInformationClinic from './ProfileInformationClinic';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';
import { baseUrl } from '../../../../utils/baseUrl';

export default function ClinicProfileScreen() {
  const {userId} = useCommon();

  const [activeTab, setActiveTab] = useState('ProfileInformation');
  const [loading, setLoading] = useState(false);
  
  // SECURITY: Initialize formData with safe defaults
  // Includes all fields required by hcf/updateClinicProfile API
  const [formData, setFormData] = useState({
    added_by: 'self',
    suid: '',
    role_id: 6, // Clinic role ID
    profile_picture: '',
    // Personal Information
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    gender: '',
    DOB: '',
    // Contact Information
    dialing_code: '',
    contact_no_primary: '',
    contact_no_secondary: '',
    street_address1: '',
    street_address2: '',
    home_no: '',
    location: '',
    country_id: '',
    state_id: '',
    city_id: '',
    zip_code: '',
    // Educational Information
    qualification: '',
    university_name: '',
    qualified_year: '',
    degree: '',
    speciality_id: '',
    // Department Information
    dept_id: '',
    // Professional/Registration Information
    state_reg_number: '',
    country_reg_number: '',
    state_reg_date: '',
    country_reg_date: '',
    council_name: '',
    // Business Information
    business_name: '',
    company_name: '',
    reg_no: '', // Registration number
    reg_date: '', // Registration date
    // Service Information
    service_time_from: '',
    service_time_to: '',
    service_day_from: '',
    service_day_to: '',
    service: '',
    description: '',
    // File extension for image upload
    fileExtension: '',
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const inputRefs = useRef([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [local, setlocal] = useState(true);

  /**
   * Enable form editing
   */
  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
    Logger.debug('Profile editing enabled');
  };

  /**
   * Fetch clinic profile details
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const showDetails = async () => {
    // SECURITY: Validate userId before API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      Logger.error('Invalid userId for profile', { userId });
      CustomToaster.show('error', 'Error', 'Invalid user session. Please login again.');
      return;
    }

    setLoading(true);
    
    try {
      Logger.api('GET', `hcf/getClinicProfile/${userId}`);
      
      // NOTE: According to Postman collection and backend handler,
      // getClinicProfile uses GET method with doctor_id as path parameter
      const response = await axiosInstance.get(`hcf/getClinicProfile/${userId}`);
      
      Logger.debug('Profile response', { 
        hasData: !!response?.data?.response?.[0] 
      });

      if (response?.data?.response?.[0]) {
        // SECURITY: Validate response data and ensure suid is set
        const profileData = response.data.response[0];
        setFormData({
          ...profileData,
          suid: profileData.suid || userId.toString(), // Ensure suid is set
          role_id: profileData.role_id || 6, // Ensure role_id is set
          dept_id: profileData.dept_id?.toString() || profileData.dept_id || '', // Ensure dept_id is set as string for dropdown
        });
        setlocal(false);
        setIsDisabled(true);
        Logger.info('Profile fetched successfully', {
          suid: profileData.suid || userId,
          dept_id: profileData.dept_id,
        });
      } else {
        Logger.warn('No profile data in response');
        CustomToaster.show('error', 'Error', 'Profile data not found.');
      }
    } catch (err) {
      Logger.error('Error fetching profile', err);
      
      const errorMessage = err?.response?.data?.message || 
        'Failed to fetch profile. Please try again later.';
      
      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch countries list
   * NOTE: External public API - doesn't require authentication
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchCountries = async () => {
    try {
      Logger.api('GET', 'countries (external API)');
      
      // NOTE: Using axios directly for external public API
      const response = await axios.get(`${baseUrl}countries`);

      Logger.debug('Countries response', { 
        count: response?.data?.response?.length || 0 
      });

      if (response?.data?.response) {
        // SECURITY: Validate response data type
        const countries = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setCountryOptions(
          countries.map(country => ({
            label: country.country_name,
            value: country.country_id,
          }))
        );
        Logger.info('Countries fetched successfully', { count: countries.length });
      }
    } catch (error) {
      Logger.error('Error fetching countries', error);
      CustomToaster.show('error', 'Error', 'Failed to load countries. Please try again.');
    }
  };

  /**
   * Fetch states based on selected country
   * SECURITY: Validates country_id before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchStates = async () => {
    // SECURITY: Validate country_id before API call
    if (!formData.country_id) {
      Logger.warn('No country_id selected for states');
      return;
    }

    try {
      Logger.api('GET', `states?country_id=${formData.country_id} (external API)`);
      
      // NOTE: Using axios directly for external public API
      const response = await axios.get(
        `${baseUrl}states?country_id=${formData.country_id}`
      );

      Logger.debug('States response', { 
        country_id: formData.country_id,
        count: response?.data?.response?.length || 0 
      });

      if (response?.data?.response) {
        // SECURITY: Validate response data type
        const states = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setStateOptions(
          states.map(state => ({
            label: state.state_name,
            value: state.state_id,
          }))
        );
        
        // Reset city options when country changes
        setCityOptions([]);
        Logger.info('States fetched successfully', { count: states.length });
      }
    } catch (error) {
      Logger.error('Error fetching states', error);
      CustomToaster.show('error', 'Error', 'Failed to load states. Please try again.');
      setStateOptions([]);
      setCityOptions([]);
    }
  };

  /**
   * Fetch cities based on selected state
   * SECURITY: Validates state_id before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchCities = async () => {
    // SECURITY: Validate state_id before API call
    if (!formData.state_id) {
      Logger.warn('No state_id selected for cities');
      return;
    }

    try {
      Logger.api('GET', `cities?state_id=${formData.state_id} (external API)`);
      
      // NOTE: Using axios directly for external public API
      const response = await axios.get(
        `${baseUrl}cities?state_id=${formData.state_id}`
      );

      Logger.debug('Cities response', { 
        state_id: formData.state_id,
        count: response?.data?.response?.length || 0 
      });

      if (response?.data?.response) {
        // SECURITY: Validate response data type
        const cities = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setCityOptions(
          cities.map(city => ({
            label: city.city_name,
            value: city.city_id,
          }))
        );
        Logger.info('Cities fetched successfully', { count: cities.length });
      }
    } catch (error) {
      Logger.error('Error fetching cities', error);
      CustomToaster.show('error', 'Error', 'Failed to load cities. Please try again.');
      setCityOptions([]);
    }
  };

  /**
   * Fetch doctor departments list
   * SECURITY: Uses axiosInstance for authenticated API calls
   * ERROR HANDLING: Comprehensive error handling
   */
  const fetchDepartments = async () => {
    try {
      Logger.api('GET', 'patient/doctorDepartments');
      
      const response = await axiosInstance.get('patient/doctorDepartments');

      Logger.debug('Departments response', { 
        count: response?.data?.response?.length || 0 
      });

      if (response?.data?.response) {
        // SECURITY: Validate response data type
        const departments = Array.isArray(response.data.response) 
          ? response.data.response 
          : [];
        
        setDepartmentOptions(
          departments.map(dept => ({
            label: dept.department_name,
            value: dept.department_id?.toString() || dept.department_id,
          }))
        );
        Logger.info('Departments fetched successfully', { count: departments.length });
      }
    } catch (error) {
      Logger.error('Error fetching departments', error);
      CustomToaster.show('error', 'Error', 'Failed to load departments. Please try again.');
      setDepartmentOptions([]);
    }
  };

  // Profile form field definitions
  // All fields required by hcf/updateClinicProfile API
  const ProfileDetails = [
    // Personal Information
    {id: 1, name: 'email', type: 'text', placeholder: 'Email'},
    {id: 2, name: 'first_name', type: 'text', placeholder: 'First Name'},
    {id: 3, name: 'middle_name', type: 'text', placeholder: 'Middle Name'},
    {id: 4, name: 'last_name', type: 'text', placeholder: 'Last Name'},
    {
      id: 5,
      name: 'gender',
      type: 'select',
      placeholder: 'Gender',
      options: [
        {value: 'male', label: 'Male'},
        {value: 'female', label: 'Female'},
        {value: 'others', label: 'Others'},
      ],
    },
    {
      id: 6,
      name: 'DOB',
      type: 'date',
      placeholder: 'Date Of Birth',
      format: 'singleline',
    },
    // Educational Information
    {id: 7, name: 'qualification', type: 'text', placeholder: 'Qualification'},
    {id: 8, name: 'university_name', type: 'text', placeholder: 'University Name'},
    {
      id: 9,
      name: 'qualified_year',
      type: 'number',
      placeholder: 'Qualified Year',
    },
    {id: 10, name: 'degree', type: 'text', placeholder: 'Degree'},
    {
      id: 11,
      name: 'dept_id',
      type: 'select',
      placeholder: 'Department',
    },
    // Professional/Registration Information
    {id: 12, name: 'state_reg_number', type: 'text', placeholder: 'State Registration Number'},
    {id: 13, name: 'country_reg_number', type: 'text', placeholder: 'Country Registration Number'},
    {
      id: 14,
      name: 'state_reg_date',
      type: 'date',
      placeholder: 'State Registration Date',
      format: 'singleline',
    },
    {
      id: 15,
      name: 'country_reg_date',
      type: 'date',
      placeholder: 'Country Registration Date',
      format: 'singleline',
    },
    {id: 16, name: 'council_name', type: 'text', placeholder: 'Council Name'},
    // Business Information
    {id: 17, name: 'business_name', type: 'text', placeholder: 'Business Name'},
    {id: 18, name: 'company_name', type: 'text', placeholder: 'Company Name'},
    {id: 19, name: 'reg_no', type: 'text', placeholder: 'Registration Number'},
    {
      id: 20,
      name: 'reg_date',
      type: 'date',
      placeholder: 'Registration Date',
      format: 'singleline',
    },
    // Service Information
    {id: 21, name: 'service', type: 'text', placeholder: 'Service/Reports and Services'},
    {
      id: 22,
      name: 'service_time_from',
      type: 'time',
      placeholder: 'Service Time From',
    },
    {
      id: 23,
      name: 'service_time_to',
      type: 'time',
      placeholder: 'Service Time To',
    },
    {
      id: 24,
      name: 'service_day_from',
      type: 'date',
      placeholder: 'Service Day From',
      format: 'singleline',
    },
    {
      id: 25,
      name: 'service_day_to',
      type: 'date',
      placeholder: 'Service Day To',
      format: 'singleline',
    },
    // Address Information
    {id: 26, name: 'country_id', type: 'select', placeholder: 'Country'},
    {id: 27, name: 'state_id', type: 'select', placeholder: 'State'},
    {id: 28, name: 'city_id', type: 'select', placeholder: 'City'},
    {id: 29, name: 'zip_code', type: 'text', placeholder: 'Zip Code'},
    {id: 30, name: 'street_address1', type: 'text', placeholder: 'Street Address 1'},
    {id: 31, name: 'street_address2', type: 'text', placeholder: 'Street Address 2'},
    {id: 32, name: 'home_no', type: 'text', placeholder: 'House Number'},
    {id: 33, name: 'location', type: 'text', placeholder: 'Location'},
    {id: 34, name: 'description', type: 'text', placeholder: 'Description', multiline: true},
  ];

    // Split fields into sections for better UI organization
  const personalFields = ProfileDetails.slice(0, 6); // email, first_name, middle_name, last_name, gender, DOB
  const educationalFields = ProfileDetails.slice(6, 12); // qualification, university_name, qualified_year, degree, dept_id
  const professionalFields = ProfileDetails.slice(12, 17); // state_reg_number, country_reg_number, state_reg_date, country_reg_date, council_name
  const businessFields = ProfileDetails.slice(17, 21); // business_name, company_name, reg_no, reg_date
  const serviceFields = ProfileDetails.slice(21, 26); // service, service_time_from, service_time_to, service_day_from, service_day_to
  const addressFields = ProfileDetails.slice(26, 35); // country, state, city, zip_code, street_address1, street_address2, home_no, location, description

  /**
   * Map dynamic field options (country, state, city, department)
   */
  const dynamicEducationalFields = educationalFields.map(field => {
    if (field.name === 'dept_id') {
      return {...field, options: departmentOptions};
    }
    return field;
  });

  const dynamicAddressFields = addressFields.map(field => {
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

  // Fetch profile, countries, and departments on mount
  useEffect(() => {
    if (userId) {
      Logger.debug('ClinicProfileScreen initialized', { userId });
      showDetails();
      fetchCountries();
      fetchDepartments();
    } else {
      Logger.warn('ClinicProfileScreen: userId not available');
      CustomToaster.show('error', 'Error', 'User session not found. Please login again.');
    }
  }, [userId]);

  // Fetch states when country changes
  useEffect(() => {
    if (formData?.country_id) {
      Logger.debug('Country changed, fetching states', { country_id: formData.country_id });
      fetchStates();
    }
  }, [formData?.country_id]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formData?.state_id) {
      Logger.debug('State changed, fetching cities', { state_id: formData.state_id });
      fetchCities();
    }
  }, [formData?.state_id]);

  /**
   * Submit form with proper data normalization
   * SECURITY: Validates and sanitizes all form data before API submission
   * ERROR HANDLING: Comprehensive error handling
   * Uses same pattern as Doctor profile update
   */
  const submitForm = async () => {
    // SECURITY: Basic validation
    if (!formData.email || !formData.first_name || !formData.last_name) {
      CustomToaster.show(
        'error',
        'Validation Error',
        'Please fill in all required fields (Email, First Name, Last Name).'
      );
      Logger.warn('Profile update validation failed', {
        hasEmail: !!formData.email,
        hasFirstName: !!formData.first_name,
        hasLastName: !!formData.last_name,
      });
      return;
    }

    setLoading(true);

    try {
      Logger.api('POST', 'hcf/updateClinicProfile', {
        email: formData.email,
        suid: formData.suid || userId,
      });

      // Helper functions for data normalization (same pattern as Doctor profile)
      const sanitize = v =>
        v === undefined || v === null ? null : String(v).trim();
      const toIntOrNull = v => {
        if (v === undefined || v === null || v === '') return null;
        const n = parseInt(v, 10);
        return Number.isNaN(n) ? null : n;
      };
      const toDateOrNull = v => {
        const s = sanitize(v);
        if (!s) return null;
        // Accept YYYY-MM-DD format (API format)
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        // Accept DD-MM-YYYY format (DOB format)
        const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return `${m[3]}-${m[2]}-${m[1]}`;
        // Try Date parse as fallback
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
        const s = sanitize(v);
        if (!s) return null;
        // Extract year from date format YYYY-MM-DD
        const m = s.match(/^(\d{4})-\d{2}-\d{2}$/);
        if (m) return parseInt(m[1], 10);
        // Extract year from date format DD-MM-YYYY
        const dmy = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dmy) return parseInt(dmy[3], 10);
        // Try parsing as integer
        const n = parseInt(s, 10);
        return Number.isNaN(n) ? null : n;
      };

      // Handle profile picture - ensure base64 data URI format
      let profilePictureData = formData.profile_picture;
      if (profilePictureData) {
        // If it's already a data URI, use as-is
        if (!profilePictureData.startsWith('data:')) {
          // If it's raw base64, add data URI prefix
          profilePictureData = `data:image/png;base64,${profilePictureData}`;
        }
      }

      // Build payload matching API structure exactly (from Postman collection)
      const payload = {
        role_id: 6, // Clinic role ID
        suid: String(formData.suid || userId || '').trim(),
        email: sanitize(formData.email),
        // Personal Information
        first_name: sanitize(formData.first_name),
        last_name: sanitize(formData.last_name),
        middle_name: sanitize(formData.middle_name),
        gender: sanitize(formData.gender)?.toLowerCase() || null,
        DOB: sanitize(formData.DOB), // Keep as-is (API expects "12-01-1995" format)
        // Educational Information
        qualification: sanitize(formData.qualification),
        university_name: sanitize(formData.university_name),
        qualified_year: normalizeQualifiedYear(formData.qualified_year),
        degree: sanitize(formData.degree),
        // Professional/Registration Information
        state_reg_number: sanitize(formData.state_reg_number),
        country_reg_number: sanitize(formData.country_reg_number),
        state_reg_date: toDateOrNull(formData.state_reg_date), // YYYY-MM-DD format
        country_reg_date: toDateOrNull(formData.country_reg_date), // YYYY-MM-DD format
        council_name: sanitize(formData.council_name),
        // Department Information
        dept_id: toIntOrNull(formData.dept_id), // Department ID as integer
        // Address Information
        street_address1: sanitize(formData.street_address1),
        street_address2: sanitize(formData.street_address2),
        country_id: sanitize(formData.country_id), // Keep as string (API expects "7")
        state_id: sanitize(formData.state_id), // Keep as string (API expects "17")
        city_id: sanitize(formData.city_id), // Keep as string (API expects "362")
        zip_code: sanitize(formData.zip_code),
        description: sanitize(formData.description),
        location: sanitize(formData.location),
        home_no: sanitize(formData.home_no),
        // Business Information
        business_name: sanitize(formData.business_name),
        company_name: sanitize(formData.company_name),
        reg_no: sanitize(formData.reg_no),
        reg_date: toDateOrNull(formData.reg_date), // YYYY-MM-DD format
        // Service Information
        service_time_from: sanitize(formData.service_time_from), // "13:12:22" format
        service_time_to: sanitize(formData.service_time_to), // "23:10:21" format
        service_day_from: toDateOrNull(formData.service_day_from), // YYYY-MM-DD format
        service_day_to: toDateOrNull(formData.service_day_to), // YYYY-MM-DD format
        service: sanitize(formData.service),
        // Profile Picture
        profile_picture: profilePictureData || null,
      };

      // Remove undefined values (convert to null)
      Object.keys(payload).forEach(k => {
        if (payload[k] === undefined) payload[k] = null;
      });

      const response = await axiosInstance.post('hcf/updateClinicProfile', payload);

      Logger.info('Clinic profile updated successfully', {
        email: formData.email,
        suid: formData.suid || userId,
        hasResponse: !!response?.data,
      });

      // Refresh profile data
      showDetails();

      CustomToaster.show(
        'success',
        'Profile Updated',
        'Clinic profile information updated successfully',
      );
    } catch (e) {
      Logger.error('Error updating clinic profile', e);

      const errorMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Failed to update profile. Please try again later.';

      CustomToaster.show('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render component based on active tab
   * @returns {JSX.Element} Component to render
   */
  const renderComponent = () => {
    switch (activeTab) {
      case 'ProfileInformation':
        return (
          <ProfileInformationClinic
            personalFields={personalFields}
            educationalFields={dynamicEducationalFields}
            professionalFields={professionalFields}
            businessFields={businessFields}
            serviceFields={serviceFields}
            addressFields={dynamicAddressFields}
            formData={formData}
            setFormData={setFormData}
            local={local}
            setlocal={setlocal}
            showdetails={showDetails}
            inputRefs={inputRefs}
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
            handleEnable={handleEnable}
            submitForm={submitForm}
          />
        );
      default:
        Logger.warn('Invalid activeTab', { activeTab });
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          logo={require('../../../../assets/images/ShareecareHeaderLogo.png')}
          locationIcon={false}
          showLocationMark={false}
          notificationUserIcon={true}
        />
      </View>
      
      {/* REUSABLE COMPONENT: CustomLoader for loading states */}
      {loading && <CustomLoader />}
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.tabsContainer}>
          <TopTabs
            borderRadius={8}
            bordercolor={COLORS.BG_WHITE}
            data={[
              {title: 'ProfileInformation'},
            ]}
            borderwidth={1}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
  headerContainer: {
    // Header container styling
  },
  scrollView: {
    backgroundColor: COLORS.BG_WHITE,
  },
  tabsContainer: {
    margin: 10,
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
});
