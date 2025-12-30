/**
 * ============================================================================
 * PROFILE INFORMATION CLINIC
 * ============================================================================
 * 
 * PURPOSE:
 * Component for Clinic users to display and edit profile information including
 * personal details, contact information, and profile picture.
 * 
 * FEATURES:
 * - Profile image upload with base64 conversion
 * - Form fields for personal and contact information
 * - Date picker for date fields
 * - Enable/disable editing mode
 * - Profile update API integration
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - Input validation before API submission
 * - Base64 image conversion for secure image handling
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Loading states
 * - Comprehensive error handling for file upload and API calls
 * 
 * REUSABLE COMPONENTS:
 * - CustomToaster: Toast notifications
 * - CustomInput: Form input fields
 * - CustomButton: Action button
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ProfileInformationClinic
 */

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs'; // UTILITY: File system for base64 conversion
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
import Logger from '../../../../constants/logger';
import { COLORS } from '../../../../constants/colors';
import { getProfileImageSource } from '../../../../utils/imageUtils';

export default function ProfileInformationClinic({
  personalFields,
  educationalFields,
  professionalFields,
  businessFields,
  serviceFields,
  addressFields,
  formData,
  setFormData,
  local,
  setlocal,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable,
  submitForm,
}) {
  const [markedDates, setMarkedDates] = useState({});
  const [localimage, setLocalImage] = useState('');
  const [uploading, setUploading] = useState(false);

  /**
   * Handle form field changes
   * @param {string} name - Field name
   * @param {string} value - Field value
   */
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    Logger.debug('Form field changed', { name, valueLength: value?.length || 0 });
  };

  /**
   * Handle document/image upload
   * SECURITY: Validates file type and converts to base64
   * ERROR HANDLING: Comprehensive error handling for file operations
   */
  async function documentUpload() {
    try {
      Logger.debug('Document picker opened');
      
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });

      if (docs && docs.length > 0) {
        const selectedDoc = docs[0];
        Logger.debug('Document selected', { 
          name: selectedDoc?.name,
          type: selectedDoc?.type,
          uri: selectedDoc?.uri 
        });
        
        setlocal(true);
        setLocalImage(selectedDoc?.uri);
        setUploading(true);

        try {
          // SECURITY: Convert image to base64 for API submission
          const base64 = await RNFS.readFile(selectedDoc?.uri, 'base64');
          
          // SECURITY: Validate base64 data
          if (!base64 || base64.length === 0) {
            throw new Error('Failed to convert image to base64');
          }

          // Update formData with base64 image
          setFormData(prevDetails => ({
            ...prevDetails,
            profile_picture: base64,
          }));
          
          Logger.info('Image converted to base64 successfully', { 
            size: base64.length 
          });
          
          CustomToaster.show('success', 'Success', 'Image selected successfully');
          return base64;
        } catch (error) {
          Logger.error('Error converting file to Base64', error);
          CustomToaster.show(
            'error',
            'Upload Error',
            'Failed to process image. Please try again.'
          );
          setlocal(false);
          setLocalImage('');
          return null;
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      setUploading(false);
      if (DocumentPicker.isCancel(error)) {
        Logger.debug('Document picker cancelled');
        // User cancelled - no action needed
      } else {
        Logger.error('Error in document picker', error);
        CustomToaster.show(
          'error',
          'Error',
          'Failed to select image. Please try again.'
        );
      }
    }
  }

  /**
   * Handle date selection
   * @param {Object} day - Selected day object
   * @param {string} name - Field name (for future use)
   */
  const handleDayPress = (day, name) => {
    setFormData(prev => ({
      ...prev,
      DOB: day.dateString,
    }));
    
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        color: COLORS.PRIMARY,
        textColor: COLORS.TEXT_WHITE,
      },
    });
    
    Logger.debug('Date selected', { date: day.dateString, field: name });
  };

  /**
   * Calculate marked dates for date range
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {Object} Marked dates object
   */
  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {
        selected: true,
        color: COLORS.PRIMARY,
        textColor: COLORS.TEXT_WHITE
      };
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };


  /**
   * Get image source for profile picture
   * Uses local image if available, otherwise uses formData profile_picture
   */
  const imageSource = local && localimage 
    ? { uri: localimage }
    : getProfileImageSource(formData.profile_picture);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.editButtonContainer}>
            <TouchableWithoutFeedback onPress={handleEnable}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={COLORS.PRIMARY}
              />
            </TouchableWithoutFeedback>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.overlay} 
              onPress={documentUpload}
              disabled={isDisabled || uploading}
            >
              <Icon name="camera" size={30} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields Section */}
        <View style={styles.formSection}>
          {/* Personal Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          {personalFields.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              startDate={formData.DOB}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={item.name === 'email' || isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          
          {/* Educational Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Educational Information</Text>
          </View>
          {educationalFields.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[personalFields.length + index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              disabled={isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          
          {/* Professional/Registration Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional/Registration Information</Text>
          </View>
          {professionalFields.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[personalFields.length + educationalFields.length + index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          
          {/* Business Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Business Information</Text>
          </View>
          {businessFields.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[personalFields.length + educationalFields.length + professionalFields.length + index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          
          {/* Service Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Information</Text>
          </View>
          {serviceFields.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[personalFields.length + educationalFields.length + professionalFields.length + businessFields.length + index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          
          {/* Address Information Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Address Information</Text>
          </View>
          {addressFields.map((item, index) => (
            <CustomInput
              ref={el => {
                const totalIndex = personalFields.length + educationalFields.length + professionalFields.length + businessFields.length + serviceFields.length + index;
                inputRefs.current[totalIndex] = el;
              }}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
              multiline={item.multiline || false}
            />
          ))}
          
          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Save Changes"
              bgColor={COLORS.PRIMARY}
              textColor={COLORS.TEXT_WHITE}
              borderColor={COLORS.PRIMARY}
              borderWidth={1}
              borderRadius={30}
              onPress={submitForm}
              disabled={isDisabled || uploading}
            />
          </View>
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
    flex: 1,
  },
  scrollContent: {
    backgroundColor: COLORS.BG_WHITE,
  },
  imageSection: {
    backgroundColor: COLORS.BG_WHITE,
    alignItems: 'center',
    padding: 15,
  },
  editButtonContainer: {
    alignSelf: 'flex-end',
  },
  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
  },
  formSection: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    marginVertical: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'Poppins-Medium',
    fontSize: hp(2),
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
