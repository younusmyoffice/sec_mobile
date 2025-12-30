import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DoctorProfileCard from '../../../../components/customCards/DoctorProfileCard/DoctorProfileCard';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import TimeRangePicker from '../../../../components/callendarPicker/TimeRangePicker';
import CustomButton from '../../../../components/customButton/CustomButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';
import CustomToaster from '../../../../components/customToaster/CustomToaster';

export default function ListingDetails({ setActiveTab, listingId, onListingIdChange, editMode = false, existingListing = null, existingListingDetails = null, onListingUpdated }) {
  const [listingIdState, setListingIdState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    listingName: editMode && existingListing ? existingListing.listing_name || '' : '',
    startDate: editMode && existingListing ? existingListing.working_days_start || '' : '',
    endDate: editMode && existingListing ? existingListing.working_days_end || '' : '',
    workingTimeStart: editMode && existingListing ? existingListing.working_time_start || '' : '',
    workingTimeEnd: editMode && existingListing ? existingListing.working_time_end || '' : '',
    about: editMode && existingListing ? existingListing.about || '' : '',
  });
  const [errors, setErrors] = useState({
    listingName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    about: '',
  });
  const { userId } = useCommon();

  // Handle existing listing details data when in edit mode
  useEffect(() => {
    if (editMode && existingListingDetails) {
      console.log('📝 ListingDetails - existingListingDetails received:', existingListingDetails);
      
      setFormData({
        listingName: existingListingDetails.listing_name || '',
        startDate: existingListingDetails.working_days_start || '',
        endDate: existingListingDetails.working_days_end || '',
        workingTimeStart: existingListingDetails.working_time_start || '',
        workingTimeEnd: existingListingDetails.working_time_end || '',
        about: existingListingDetails.about || '',
      });
      
      // Set the dates for the calendar
      if (existingListingDetails.working_days_start) {
        setStartDate(existingListingDetails.working_days_start);
      }
      if (existingListingDetails.working_days_end) {
        setEndDate(existingListingDetails.working_days_end);
      }
      
      // Set the times
      if (existingListingDetails.working_time_start) {
        const startTimeDate = parseTimeToDate(existingListingDetails.working_time_start);
        if (startTimeDate) {
          setStartTime(startTimeDate);
        }
      }
      if (existingListingDetails.working_time_end) {
        const endTimeDate = parseTimeToDate(existingListingDetails.working_time_end);
        if (endTimeDate) {
          setEndTime(endTimeDate);
        }
      }
      
      console.log('📝 ListingDetails - form data updated with:', {
        listingName: existingListingDetails.listing_name,
        startDate: existingListingDetails.working_days_start,
        endDate: existingListingDetails.working_days_end,
        workingTimeStart: existingListingDetails.working_time_start,
        workingTimeEnd: existingListingDetails.working_time_end,
        about: existingListingDetails.about,
      });
    }
  }, [editMode, existingListingDetails]);

  // Helper function to format time for display
  const formatTimeForDisplay = (timeValue) => {
    if (!timeValue) return '';
    
    // If it's a Date object, format it to HH:mm
    if (timeValue instanceof Date) {
      const hours = timeValue.getHours().toString().padStart(2, '0');
      const minutes = timeValue.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    // If it's already a time string like "21:33:42", format it to "21:33"
    if (typeof timeValue === 'string' && timeValue.includes(':')) {
      const parts = timeValue.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    
    return timeValue.toString();
  };

  const parseTimeToDate = (timeString) => {
    if (!timeString) {
      return null;
    }
    let normalized = timeString;
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      normalized = `${timeString}:00`;
    } else if (/^\d{2}:\d{2}:\d{2}:\d{1,3}$/.test(timeString)) {
      normalized = timeString.replace(/:(\d{1,3})$/, '.$1'); // convert trailing :ms to .ms
    }
    const parsed = new Date(`1970-01-01T${normalized}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleDayPress = (day) => {
    if (!startDate || (endDate && day.dateString <= startDate)) {
      resetDates();
      setStartDate(day.dateString);
      setFormData({
        ...formData,
        startDate: day.dateString,
      });
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          selected: true,
          color: '#E72B4A',
          textColor: 'white',
        },
      });
      validateField('startDate', day.dateString);
    } else {
      setEndDate(day.dateString);
      setFormData({
        ...formData,
        endDate: day.dateString,
      });
      setMarkedDates((prev) => ({
        ...prev,
        ...calculateMarkedDates(startDate, day.dateString),
        [day.dateString]: {
          endingDay: true,
          selected: true,
          color: '#E72B4A',
          textColor: 'white',
        },
      }));
      validateField('endDate', day.dateString);
    }
  };

  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = { selected: true, color: '#E72B4A', textColor: 'white' };
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };

  const resetDates = () => {
    setStartDate('');
    setEndDate('');
    setMarkedDates({});
    setFormData({ ...formData, startDate: '', endDate: '' });
    setErrors({ ...errors, startDate: '', endDate: '' });
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'listingName') {
      newErrors.listingName = !value
        ? 'Listing Name is required'
        : value.length < 3
        ? 'Listing Name must be at least 3 characters'
        : '';
    } else if (name === 'startDate') {
      newErrors.startDate = !value ? 'Start Date is required' : '';
      if (value && endDate && new Date(endDate) < new Date(value)) {
        newErrors.endDate = 'End Date must be after Start Date';
      } else {
        newErrors.endDate = '';
      }
    } else if (name === 'endDate') {
      newErrors.endDate = !value
        ? 'End Date is required'
        : startDate && new Date(value) < new Date(startDate)
        ? 'End Date must be after Start Date'
        : '';
    } else if (name === 'startTime') {
      newErrors.startTime = !value ? 'Start Time is required' : '';
      if (value && endTime) {
        const start = parseTimeToDate(value);
        const end = parseTimeToDate(endTime);
        newErrors.endTime = start && end && end <= start ? 'End Time must be after Start Time' : '';
      }
    } else if (name === 'endTime') {
      const start = parseTimeToDate(startTime);
      const end = parseTimeToDate(value);
      newErrors.endTime = !value
        ? 'End Time is required'
        : start && end && end <= start
        ? 'End Time must be after Start Time'
        : '';
    } else if (name === 'about') {
      newErrors.about = !value
        ? 'About is required'
        : value.length < 10
        ? 'About must be at least 10 characters'
        : '';
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      listingName: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      about: '',
    };

    // Listing Name Validation
    if (!formData.listingName) {
      newErrors.listingName = 'Listing Name is required';
      isValid = false;
    } else if (formData.listingName.length < 3) {
      newErrors.listingName = 'Listing Name must be at least 3 characters';
      isValid = false;
    }

    // Start Date and End Date Validation
    if (!startDate) {
      newErrors.startDate = 'Start Date is required';
      isValid = false;
    }
    if (!endDate) {
      newErrors.endDate = 'End Date is required';
      isValid = false;
    } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
      isValid = false;
    }

    // Start Time and End Time Validation
    if (!startTime) {
      newErrors.startTime = 'Start Time is required';
      isValid = false;
    }
    if (!endTime) {
      newErrors.endTime = 'End Time is required';
      isValid = false;
    } else if (startTime && endTime) {
      const start = parseTimeToDate(startTime);
      const end = parseTimeToDate(endTime);
      if (start && end && end <= start) {
        newErrors.endTime = 'End Time must be after Start Time';
        isValid = false;
      }
    }

    // About Validation
    if (!formData.about) {
      newErrors.about = 'About is required';
      isValid = false;
    } else if (formData.about.length < 10) {
      newErrors.about = 'About must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
// useEffect(() => {
//   CustomToaster.show('error', 'Validation Error', {
//     duration: 3000,
//     text2: 'Please fix the errors in the form.',
//   });
// }, []);
  const handleSave = async () => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      CustomToaster.show('error', 'Authentication Error', {
        duration: 3000,
        text2: 'Please login to create listings.',
      });
      return;
    }

    if (!validateForm()) {
      CustomToaster.show('error', 'Validation Error', {
        duration: 3000,
        text2: 'Please fix the errors in the form.',
      });
      return;
    }

    setIsLoading(true);
    // Format times for API
    const formatTimeForAPI = (timeValue) => {
      if (!timeValue) return '';
      
      // If it's a Date object, format it to HH:mm:ss
      if (timeValue instanceof Date) {
        const hours = timeValue.getHours().toString().padStart(2, '0');
        const minutes = timeValue.getMinutes().toString().padStart(2, '0');
        const seconds = timeValue.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
      
      // If it's already a time string, return as is
      return timeValue.toString();
    };

    // Format dates for API
    const formatDateForAPI = (dateValue) => {
      if (!dateValue) return '';
      
      // If it's already a string, try to parse and format it
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        }
        return dateValue;
      }
      
      // If it's a Date object, format it to YYYY-MM-DD
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      
      return dateValue.toString();
    };

    const requestBody = {
      doctor_id: userId,
      listing_name: formData.listingName,
      working_days_start: formatDateForAPI(formData.startDate),
      working_days_end: formatDateForAPI(formData.endDate),
      working_time_start: formatTimeForAPI(startTime),
      working_time_end: formatTimeForAPI(endTime),
      about: formData.about,
      is_active: 0,
    };

    try {
      let response;
      if (editMode) {
        // Update existing listing
        const updateBody = {
          ...requestBody,
          doctor_list_id: existingListing.doctor_list_id,
        };
        console.log('📝 Updating listing with payload:', updateBody);
        response = await axiosInstance.post('createUpdatedoctorlisting/listing', updateBody);
        console.log('Update response:', response?.data);
        
        if (onListingUpdated) {
          onListingUpdated();
        }
        
        CustomToaster.show('success', 'Success', {
          duration: 3000,
          text2: 'Listing updated successfully!',
        });
      } else {
        // Create new listing
        response = await axiosInstance.post('createUpdatedoctorlisting/listing', requestBody);
        console.log('API response:', response?.data?.response?.docListingCreate?.doctor_list_id);
        setListingIdState(response?.data?.response?.docListingCreate?.doctor_list_id);
        setActiveTab('Add Plan');
        onListingIdChange(response?.data?.response?.docListingCreate?.doctor_list_id);
        
        CustomToaster.show('success', 'Success', {
          duration: 3000,
          text2: 'Listing saved successfully!',
        });
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      CustomToaster.show('error', 'Error', {
        duration: 3000,
        text2: error?.response?.data?.error || 'Error saving listing!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  return (
    <View style={styles.container}>
      
      <InAppHeader LftHdr={'Add Details'} />

      {/* Listing Name Input */}
      <CustomInput
        type={'text'}
        placeholder={'Listing Name'}
        value={formData.listingName}
        onChange={handleChange}
        name="listingName"
      />
      {errors.listingName ? <Text style={styles.errorText}>{errors.listingName}</Text> : null}

      {/* Working Days Header */}
      <InAppHeader LftHdr={'Working Days'} />

      {/* Date Range Picker */}
      <CustomInput
        type={'date'}
        name={'date'}
        format={'doubleline'}
        calculateMarkedDates={calculateMarkedDates}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        resetDates={resetDates}
        markedDates={markedDates}
        handleDayPress={handleDayPress}
      />
      {errors.startDate ? <Text style={styles.errorText}>{errors.startDate}</Text> : null}
      {errors.endDate ? <Text style={styles.errorText}>{errors.endDate}</Text> : null}

      {/* Working Time Header */}
      <InAppHeader LftHdr={'Working Time'} />

      {/* Time Range Picker */}
      <TimeRangePicker
        Type={'d'}
        startTime={startTime ? formatTimeForDisplay(startTime) : null}
        endTime={endTime ? formatTimeForDisplay(endTime) : null}
        onStartTimeChange={(time) => {
          setStartTime(time);
          validateField('startTime', time);
        }}
        onEndTimeChange={(time) => {
          setEndTime(time);
          validateField('endTime', time);
        }}
      />
      {errors.startTime ? <Text style={styles.errorText}>{errors.startTime}</Text> : null}
      {errors.endTime ? <Text style={styles.errorText}>{errors.endTime}</Text> : null}

      {/* About Header */}
      <InAppHeader LftHdr={'About'} />
      <CustomInput
        type={'textarea'}
        placeholder={'Description'}
        value={formData.about}
        onChange={handleChange}
        name="about"
      />
      {errors.about ? <Text style={styles.errorText}>{errors.about}</Text> : null}

      {/* Submit Button */}
      <View style={styles.buttonsContainer}>
        <CustomButton
          title={isLoading ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update' : 'Next')}
          bgColor={'#E72B4A'}
          fontfamily={'Poppins-SemiBold'}
          textColor={'white'}
          fontSize={hp(2)}
          borderRadius={20}
          width={wp(55)}
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp(2),
    paddingTop: hp(2),
  },
  buttonsContainer: {
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: hp(1.5),
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
});
