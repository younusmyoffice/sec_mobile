/**
 * ============================================================================
 * SCREEN: Admin Profile Management
 * ============================================================================
 * 
 * PURPOSE:
 * Screen for HCF Admin to view and edit profile information:
 * - Profile Information (name, HCF details)
 * - Contact Details (email, location, service times)
 * - Registration Details (state/Indian registration info)
 * 
 * SECURITY:
 * - Uses axiosInstance (automatic token injection) ✅
 * - Validates userId before API calls
 * - Input validation and sanitization needed
 * 
 * ERROR HANDLING: ✅ Comprehensive
 * - Loading states with reusable loader
 * - Error messages with CustomToaster
 * - Success messages for actions
 * 
 * @module AdminProfileScreen
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import Header from '../../../../components/customComponents/Header/Header';
import CustomInputs from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import CustomToaster from '../../../../components/customToaster/CustomToaster'; // REUSABLE: Toast messages
import TopTabs from '../../../../components/customComponents/TopTabs/TopTabs';
import TimeRangePicker from '../../../../components/callendarPicker/TimeRangePicker';
import ProfileImageUpload from '../../../patient/dashboard-DF/ProfileScreens/customComponents/ProfileImageUpload';
import CustomLoader from '../../../../components/customComponents/customLoader/CustomLoader'; // REUSABLE: Loader component

// Utils & Services
import axiosInstance from '../../../../utils/axiosInstance'; // SECURITY: Auto token injection
import {useAuth} from '../../../../Store/Authentication';
import Logger from '../../../../constants/logger'; // UTILITY: Structured logging
import {COLORS} from '../../../../constants/colors'; // DESIGN: Color constants
import RNFS from 'react-native-fs'; // UTILITY: File system for base64 conversion

export default function AdminProfileScreen() {
  const {userId} = useAuth();

  // STATE: UI and form data
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [activeTab, setActiveTab] = useState('Profile Information');
  
  // STATE: Dropdown options
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  
  // STATE: Service time and date ranges
  const [serviceTimeFrom, setServiceTimeFrom] = useState('');
  const [serviceTimeTo, setServiceTimeTo] = useState('');
  const [serviceDayFrom, setServiceDayFrom] = useState('');
  const [serviceDayTo, setServiceDayTo] = useState('');

  Logger.debug('AdminProfileScreen initialized', { userId });
  const [formData, setFormData] = useState({
    suid: '',
    email: '',
    role_id: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    country_id: '',
    state_id: '',
    city_id: '',
    profile_picture: '',
    category_id: '',
    hcf_name: '',
    reg_no: '',
    service_offer: '',
    service_time_from: '',
    service_time_to: '',
    service_day_from: '',
    service_day_to: '',
    diag_state_reg_date: '',
    diag_indian_reg_date: '',
    state_reg_no: '',
    indian_reg_no: '',
    state_reg_date: '',
    indian_reg_date: '',
    diag_state_reg_no: '',
    diag_indian_reg_no: '',
  });

  const inputRefs = useRef([]);

  const ProfileInformationFields = [
    {id: 1, name: 'first_name', type: 'text', placeholder: 'First Name', label: 'First Name'},
    {id: 2, name: 'middle_name', type: 'text', placeholder: 'Middle Name', label: 'Middle Name'},
    {id: 3, name: 'last_name', type: 'text', placeholder: 'Last Name', label: 'Last Name'},
    {id: 4, name: 'hcf_name', type: 'text', placeholder: 'HCF Name', label: 'HCF Name'},
    {id: 5, name: 'reg_no', type: 'text', placeholder: 'Registration Number', label: 'Registration Number'},
    {id: 6, name: 'category_id', type: 'text', placeholder: 'Category ID', label: 'Category ID'},
  ];

  const ContactDetailsFields = [
    {id: 1, name: 'email', type: 'email', placeholder: 'Email Address', label: 'Email Address'},
    {id: 2, name: 'country_id', type: 'select', placeholder: 'Country', label: 'Country'},
    {id: 3, name: 'state_id', type: 'select', placeholder: 'State', label: 'State'},
    {id: 4, name: 'city_id', type: 'select', placeholder: 'City', label: 'City'},
    {id: 5, name: 'service_offer', type: 'textarea', placeholder: 'Service Offer', label: 'Service Offer'},
  ];

  const RegistrationFields = [
    {id: 1, name: 'state_reg_no', type: 'text', placeholder: 'State Registration Number', label: 'State Registration Number'},
    {id: 2, name: 'indian_reg_no', type: 'text', placeholder: 'Indian Registration Number', label: 'Indian Registration Number'},
    {id: 3, name: 'state_reg_date', type: 'date', placeholder: 'State Registration Date', label: 'State Registration Date', format: 'singleline'},
    {id: 4, name: 'indian_reg_date', type: 'date', placeholder: 'Indian Registration Date', label: 'Indian Registration Date', format: 'singleline'},
    {id: 5, name: 'diag_state_reg_no', type: 'text', placeholder: 'Diagnostic State Registration Number', label: 'Diagnostic State Registration Number'},
    {id: 6, name: 'diag_indian_reg_no', type: 'text', placeholder: 'Diagnostic Indian Registration Number', label: 'Diagnostic Indian Registration Number'},
    {id: 7, name: 'diag_state_reg_date', type: 'date', placeholder: 'Diagnostic State Registration Date', label: 'Diagnostic State Registration Date', format: 'singleline'},
    {id: 8, name: 'diag_indian_reg_date', type: 'date', placeholder: 'Diagnostic Indian Registration Date', label: 'Diagnostic Indian Registration Date', format: 'singleline'},
  ];

  const handleEnable = () => {
    setIsDisabled(false);
    inputRefs.current.forEach(input => {
      if (input) input.setNativeProps({editable: true});
    });
  };

  /**
   * API: Fetch countries list for dropdown
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchCountries = async () => {
    try {
      Logger.api('GET', 'countries');

      const response = await axiosInstance.get(`countries`);

      Logger.info('Countries fetched successfully', {
        hasData: !!response?.data?.response,
      });

      const countries = response?.data?.response.map(country => ({
        label: country.country_name,
        value: country.country_id,
      }));

      setCountryOptions(countries);
      Logger.debug('Countries set', { count: countries.length });
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      Logger.error('Error fetching countries', {
        status: error?.response?.status,
        error: error,
      });

      // REUSABLE TOAST: Show error message (non-critical)
      Logger.debug('Countries fetch failed (non-critical)');
    }
  };

  /**
   * API: Fetch states list for dropdown based on country
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * SECURITY: Validates country_id before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchStates = async () => {
    if (!formData.country_id) {
      Logger.debug('No country selected, skipping states fetch');
      return;
    }

    try {
      Logger.api('GET', `states?country_id=${formData.country_id}`, {
        country_id: formData.country_id,
      });

      const response = await axiosInstance.get(
        `states?country_id=${formData.country_id}`,
      );

      Logger.info('States fetched successfully', {
        country_id: formData.country_id,
        hasData: !!response.data.response,
      });

      const states = response.data.response.map(state => ({
        label: state.state_name,
        value: state.state_id,
      }));

      setStateOptions(states);
      Logger.debug('States set', { count: states.length });
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      Logger.error('Error fetching states', {
        country_id: formData.country_id,
        status: error?.response?.status,
        error: error,
      });

      // REUSABLE TOAST: Show error message (non-critical)
      Logger.debug('States fetch failed (non-critical)');
    }
  };

  /**
   * API: Fetch cities list for dropdown based on state
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * SECURITY: Validates state_id before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchCities = async () => {
    if (!formData.state_id) {
      Logger.debug('No state selected, skipping cities fetch');
      return;
    }

    try {
      Logger.api('GET', `cities?state_id=${formData.state_id}`, {
        state_id: formData.state_id,
      });

      const response = await axiosInstance.get(
        `cities?state_id=${formData.state_id}`,
      );

      Logger.info('Cities fetched successfully', {
        state_id: formData.state_id,
        hasData: !!response.data.response,
      });

      const cities = response.data.response.map(city => ({
        label: city.city_name,
        value: city.city_id,
      }));

      setCityOptions(cities);
      Logger.debug('Cities set', { count: cities.length });
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      Logger.error('Error fetching cities', {
        state_id: formData.state_id,
        status: error?.response?.status,
        error: error,
      });

      // REUSABLE TOAST: Show error message (non-critical)
      Logger.debug('Cities fetch failed (non-critical)');
    }
  };

  /**
   * API: Fetch HCF profile data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const fetchProfile = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for profile fetch', { userId });
      setLoading(false);
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    setLoading(true);

    try {
      Logger.api('GET', `hcf/getHcfprofile/${userId}`);

      const response = await axiosInstance.get(`hcf/getHcfprofile/${userId}`);

      Logger.info('Profile fetched successfully', {
        hasData: !!response.data.response,
      });

      if (response.data.response && response.data.response.length > 0) {
        const profileData = response.data.response[0];
        Logger.debug('Profile data received', {
          hasEmail: !!profileData.email,
          hasName: !!profileData.first_name,
        });

        // SECURITY: Set form data with fallbacks to prevent undefined
        setFormData({
          suid: profileData.suid || '',
          email: profileData.email || '',
          role_id: profileData.role_id || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          middle_name: profileData.middle_name || '',
          country_id: profileData.country_id || '',
          state_id: profileData.state_id || '',
          city_id: profileData.city_id || '',
          profile_picture: profileData.profile_picture || '',
          category_id: profileData.category_id || '',
          hcf_name: profileData.hcf_name || '',
          reg_no: profileData.reg_no || '',
          service_offer: profileData.service_offer || '',
          diag_state_reg_date: profileData.diag_state_reg_date || '',
          diag_indian_reg_date: profileData.diag_indian_reg_date || '',
          state_reg_no: profileData.state_reg_no || '',
          indian_reg_no: profileData.indian_reg_no || '',
          state_reg_date: profileData.state_reg_date || '',
          indian_reg_date: profileData.indian_reg_date || '',
          diag_state_reg_no: profileData.diag_state_reg_no || '',
          diag_indian_reg_no: profileData.diag_indian_reg_no || '',
        });

        // Set time and date states
        setServiceTimeFrom(profileData.service_time_from || '');
        setServiceTimeTo(profileData.service_time_to || '');
        setServiceDayFrom(profileData.service_day_from || '');
        setServiceDayTo(profileData.service_day_to || '');
      } else {
        Logger.warn('No profile data received');
      }
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load profile data. Please try again.';

      Logger.error('Error fetching profile', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Profile Fetch Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * HANDLER: Update form field value
   * 
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleChange = (name, value) => {
    Logger.debug('Form field changed', { name, hasValue: !!value });
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * HANDLER: Handle date picker selection
   * 
   * @param {Object} day - Selected day object
   * @param {string} name - Field name
   */
  const handleDayPress = (day, name) => {
    const formattedDate = day.dateString;
    Logger.debug('Date selected', { name, date: formattedDate });
    setFormData(prev => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const calculateMarkedDates = () => {
    return {};
  };

  const resetDates = () => {
    // Reset date logic if needed
  };

  /**
   * HANDLER: Handle profile image change
   * 
   * REUSABLE COMPONENT: Uses ProfileImageUpload component
   * CONVERTS: Local file URI to base64 format for API
   * 
   * @param {string} newImageUri - New image URI from image picker (local file path)
   */
  const handleImageChange = async newImageUri => {
    Logger.debug('Profile image changed', { hasImage: !!newImageUri });
    
    try {
      // SECURITY: Validate image URI
      if (!newImageUri || typeof newImageUri !== 'string') {
        Logger.error('Invalid image URI provided');
        CustomToaster.show('error', 'Error', 'Invalid image selected');
        return;
      }

      // CONVERT: Convert local file URI to base64 for API
      // Check if it's already base64 (data URI format)
      if (newImageUri.startsWith('data:image/')) {
        Logger.debug('Image already in base64 format');
        setFormData(prev => ({
          ...prev,
          profile_picture: newImageUri,
        }));
        
        CustomToaster.show(
          'success',
          'Image Selected',
          'Profile picture updated successfully.',
        );
        return;
      }

      // Convert local file URI to base64
      Logger.debug('Converting image to base64', { uri: newImageUri });
      const base64 = await RNFS.readFile(newImageUri, 'base64');
      
      // Format as data URI for proper API handling
      const base64DataUri = `data:image/jpeg;base64,${base64}`;
      
      Logger.info('Image converted to base64 successfully', {
        base64Length: base64.length,
        dataUriLength: base64DataUri.length,
      });

      setFormData(prev => ({
        ...prev,
        profile_picture: base64DataUri,
      }));

      // REUSABLE TOAST: Show success message
      CustomToaster.show(
        'success',
        'Image Selected',
        'Profile picture updated successfully.',
      );
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.message || 'Failed to process image. Please try again.';

      Logger.error('Error processing image', {
        error: errorMessage,
        error: error,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Image Error', errorMessage);
    }
  };

  /**
   * API: Update HCF profile data
   * 
   * SECURITY: Uses axiosInstance (automatic token injection)
   * SECURITY: Validates userId before API call
   * ERROR HANDLING: Comprehensive error handling
   * 
   * @returns {Promise<void>}
   */
  const handleUpdate = async () => {
    // VALIDATION: Check if userId exists
    if (!userId || userId === 'null' || userId === 'token') {
      const errorMsg = 'User ID is missing. Please log in again.';
      Logger.error('Invalid userId for profile update', { userId });
      CustomToaster.show('error', 'Error', errorMsg);
      return;
    }

    try {
      Logger.api('POST', `hcf/updateHcfprofile?hcf_id=${userId}`, {
        hcf_id: userId,
        hasData: true,
      });

      // Include time and date data in the update
      const updateData = {
        ...formData,
        service_time_from: serviceTimeFrom,
        service_time_to: serviceTimeTo,
        service_day_from: serviceDayFrom,
        service_day_to: serviceDayTo,
      };

      const response = await axiosInstance.post(
        `hcf/updateHcfprofile?hcf_id=${userId}`,
        updateData,
      );

      Logger.info('Profile updated successfully', {
        hasResponse: !!response.data,
      });

      // REUSABLE TOAST: Show success message
      CustomToaster.show(
        'success',
        'Profile Updated',
        'Your profile has been updated successfully.',
      );

      setIsDisabled(true);

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      // ERROR HANDLING: Comprehensive error handling
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile. Please try again.';

      Logger.error('Error updating profile', {
        status: error?.response?.status,
        message: errorMessage,
        error: error,
      });

      // REUSABLE TOAST: Show error message
      CustomToaster.show('error', 'Profile Update Failed', errorMessage);
    }
  };

  /**
   * HELPER: Get current fields based on active tab
   * 
   * Maps field definitions and adds dropdown options for location fields
   * 
   * @returns {Array} Fields array with options for dropdowns
   */
  const getCurrentFields = () => {
    const fields = (() => {
      switch (activeTab) {
        case 'Profile Information':
          return ProfileInformationFields;
        case 'Contact Details':
          return ContactDetailsFields;
        case 'Registration Details':
          return RegistrationFields;
        default:
          return ProfileInformationFields;
      }
    })();

    // Add options for dropdown fields
    const fieldsWithOptions = fields.map(field => {
      if (field.name === 'country_id') {
        Logger.debug('Country field options', {
          count: countryOptions.length,
        });
        return {...field, options: countryOptions};
      }
      if (field.name === 'state_id') {
        Logger.debug('State field options', {
          count: stateOptions.length,
        });
        return {...field, options: stateOptions};
      }
      if (field.name === 'city_id') {
        Logger.debug('City field options', {
          count: cityOptions.length,
        });
        return {...field, options: cityOptions};
      }
      return field;
    });

    Logger.debug('Current fields for tab', {
      activeTab,
      fieldCount: fieldsWithOptions.length,
    });

    return fieldsWithOptions;
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchCountries();
    }
  }, [userId]);

  useEffect(() => {
    if (formData?.country_id) {
      fetchStates();
    }
  }, [formData?.country_id]);

  useEffect(() => {
    if (formData?.state_id) {
      fetchCities();
    }
  }, [formData?.state_id]);

  // REUSABLE LOADER: Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Header
          logo={require('../../../../assets/hcfadmin.png')}
          notificationUserIcon={true}
          width={wp(41)}
          height={hp(4)}
          resize={'contain'}
        />
        <View style={styles.loadingContent}>
          <CustomLoader />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View>
          <Header
            logo={require('../../../../assets/hcfadmin.png')}
            notificationUserIcon={true}
            width={wp(41)}
            height={hp(4)}
            resize={'contain'}
          />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* PROFILE PICTURE SECTION */}
          <View style={styles.profilePictureContainer}>
            <ProfileImageUpload
              imageUrl={formData.profile_picture || null} // UTILITY: Pass null, getProfileImageSource handles fallback
              onImageChange={handleImageChange}
            />
            <Text style={styles.profileIdText}>
              Profile ID:{' '}
              <Text style={styles.profileIdValue}>
                SRC{formData.suid || '0001'}
              </Text>
            </Text>
          </View>

          {/* TABS */}
          <View style={styles.tabsContainer}>
            <TopTabs
              data={[
                {title: 'Profile Information'},
                {title: 'Contact Details'},
                {title: 'Registration Details'},
              ]}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeButtonColor={COLORS.PRIMARY} // DESIGN: Use color constant
              nonactivecolor={COLORS.BG_LIGHT} // DESIGN: Use color constant
              borderRadius={8}
              ph={15}
              pv={10}
              fontSize={hp(1.8)}
            />
          </View>

          {/* EDIT BUTTON */}
          <TouchableWithoutFeedback onPress={handleEnable}>
            <View style={styles.editButtonContainer}>
              <MaterialCommunityIcons
                name="pencil"
                color={COLORS.PRIMARY} // DESIGN: Use color constant
                size={hp(2)}
              />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </View>
          </TouchableWithoutFeedback>
          
          {/* Form Fields */}
          <View style={{gap: 15}}>
            {getCurrentFields().map((field, index) => (
              <CustomInputs
                key={field.id}
                ref={el => (inputRefs.current[index] = el)}
                label={field.label}
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                options={field.options || []}
                fontSize={14}
                editable={!isDisabled}
                format={field.format}
                datevalue={formData[field.name] || ''}
                handleDayPress={handleDayPress}
                calculateMarkedDates={calculateMarkedDates}
                resetDates={resetDates}
                markedDates={{}}
              />
            ))}
            
            {/* Service Time and Date Pickers for Contact Details */}
            {activeTab === 'Contact Details' && (
              <>
                <View style={styles.serviceTimeContainer}>
                  <Text style={styles.serviceTimeLabel}>Service Time</Text>
                  <TimeRangePicker
                    Type="singleline"
                    startTime={serviceTimeFrom}
                    endTime={serviceTimeTo}
                    onStartTimeChange={setServiceTimeFrom}
                    onEndTimeChange={setServiceTimeTo}
                  />
                </View>
                
                <View style={styles.serviceDayContainer}>
                  <Text style={styles.serviceDayLabel}>Service Day Range</Text>
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <View style={{flex: 1}}>
                      <CustomInputs
                        label="From Date"
                        type="date"
                        name="service_day_from"
                        value={serviceDayFrom}
                        onChange={(name, value) => setServiceDayFrom(value)}
                        placeholder="Service Day From"
                        fontSize={14}
                        editable={!isDisabled}
                        format="singleline"
                        datevalue={serviceDayFrom}
                        handleDayPress={handleDayPress}
                        calculateMarkedDates={calculateMarkedDates}
                        resetDates={resetDates}
                        markedDates={{}}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <CustomInputs
                        label="To Date"
                        type="date"
                        name="service_day_to"
                        value={serviceDayTo}
                        onChange={(name, value) => setServiceDayTo(value)}
                        placeholder="Service Day To"
                        fontSize={14}
                        editable={!isDisabled}
                        format="singleline"
                        datevalue={serviceDayTo}
                        handleDayPress={handleDayPress}
                        calculateMarkedDates={calculateMarkedDates}
                        resetDates={resetDates}
                        markedDates={{}}
                      />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
          
          {/* SAVE BUTTON */}
          {!isDisabled && (
            <View style={styles.saveButtonContainer}>
              <CustomButton
                title="Save Changes"
                bgColor={COLORS.PRIMARY} // DESIGN: Use color constant
                borderRadius={8}
                textColor={COLORS.BG_WHITE} // DESIGN: Use color constant
                height={hp(5.5)}
                width={wp(80)}
                fontSize={hp(1.8)}
                fontfamily={'Poppins-Medium'}
                onPress={handleUpdate}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

// DESIGN: Styles using color constants
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  safeArea: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
  },
  content: {
    padding: 15,
    gap: 10,
  },
  loadingContainer: {
    backgroundColor: COLORS.BG_WHITE, // DESIGN: Use color constant
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: hp(2),
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileIdText: {
    marginTop: 10,
    fontSize: hp(2),
    color: COLORS.TEXT_SECONDARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Regular',
  },
  profileIdValue: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontWeight: 'bold',
  },
  tabsContainer: {
    marginBottom: 20,
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
  },
  editButtonText: {
    color: COLORS.PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
  serviceTimeContainer: {
    gap: 10,
  },
  serviceTimeLabel: {
    fontSize: hp(1.8),
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  serviceDayContainer: {
    gap: 10,
  },
  serviceDayLabel: {
    fontSize: hp(1.8),
    color: COLORS.TEXT_PRIMARY, // DESIGN: Use color constant
    fontFamily: 'Poppins-Medium',
    marginBottom: 5,
  },
  saveButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
