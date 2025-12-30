/**
 * ============================================================================
 * PROFILE INFORMATION COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Component for displaying and editing patient profile information.
 * Handles first name, last name, email, gender, DOB, and profile picture.
 * 
 * FEATURES:
 * - Profile image upload with camera/gallery selection
 * - Form fields with date picker for DOB
 * - Save functionality
 * 
 * SECURITY:
 * - Uses axiosInstance for authenticated API calls
 * - File type validation (images only)
 * - Base64 conversion for image upload
 * 
 * ERROR HANDLING:
 * - CustomToaster for user-friendly error/success messages
 * - Comprehensive error handling
 * 
 * REUSABLE COMPONENTS:
 * - CustomToaster: Toast notifications
 * - CustomInput: Form input component
 * - CustomButton: Action button
 * 
 * ACCESS TOKEN:
 * - Handled automatically by axiosInstance (reusable throughout app)
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming
 * - StyleSheet.create() for optimized styling
 * 
 * @module ProfileInformation
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
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../../components/customButton/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RNFS from 'react-native-fs';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';
import axiosInstance from '../../../../../utils/axiosInstance';

export default function ProfileInformation({
  firstFive,
  formData,
  setFormData,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable,
}) {
  const [localimage, setLocalImage] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [uploading, setUploading] = useState(false);

  /**
   * Handle form field changes
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = (name, value) => {
    Logger.debug('Form field changed', { name, hasValue: !!value });
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle image change (unused in current implementation)
   * @param {string} newImage - New image URL
   */
  const handleImageChange = newImage => {
    Logger.debug('Image changed', { hasImage: !!newImage });
    setFormData(prev => ({
      ...prev,
      profile_picture: newImage,
    }));
  };

  /**
   * Handle document/image upload
   * SECURITY: File type validation (images only)
   * ERROR HANDLING: Comprehensive error handling
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
          size: selectedDoc?.size,
        });

        // SECURITY: Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedDoc.size && selectedDoc.size > maxSize) {
          Logger.warn('File size exceeds limit', { size: selectedDoc.size });
          CustomToaster.show('error', 'File Too Large', 'Please select an image smaller than 10MB.');
          return;
        }

        setUploading(true);
        setLocalImage(selectedDoc.uri);

        try {
          Logger.debug('Converting image to Base64');
          const base64 = await RNFS.readFile(selectedDoc.uri, 'base64');
          
          // Determine file extension from MIME type or name
          const fileExtension = selectedDoc.name?.split('.').pop() || 'jpg';
          const mimeType = selectedDoc.type || 'image/jpeg';
          
          Logger.debug('Image converted to Base64', {
            size: base64.length,
            extension: fileExtension,
            mimeType,
          });

          setFormData(prevDetails => ({
            ...prevDetails,
            profile_picture: base64,
            fileExtension: fileExtension,
          }));

          CustomToaster.show('success', 'Image Selected', 'Profile picture selected successfully.');
          Logger.info('Profile image selected successfully');
        } catch (error) {
          Logger.error('Error converting file to Base64', error);
          CustomToaster.show('error', 'Error', 'Failed to process image. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        Logger.debug('Document picker cancelled');
      } else {
        Logger.error('Document picker error', error);
        CustomToaster.show('error', 'Error', 'Failed to select image. Please try again.');
      }
    }
  }

  /**
   * Handle date selection for DOB
   * @param {object} day - Selected day object
   * @param {string} name - Field name
   */
  const handleDayPress = (day, name) => {
    Logger.debug('Date selected', { date: day.dateString, field: name });
    setFormData({
      ...formData,
      DOB: day.dateString,
    });
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        color: COLORS.PRIMARY,
        textColor: COLORS.TEXT_WHITE,
      },
    });
  };

  /**
   * Calculate marked dates for date range (unused in current implementation)
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {object} Marked dates object
   */
  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {
        selected: true,
        color: COLORS.PRIMARY,
        textColor: COLORS.TEXT_WHITE,
      };
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };

  /**
   * Handle profile update
   * SECURITY: Validates form data before API call
   * ERROR HANDLING: Comprehensive error handling
   */
  const handlePersonalUpdate = async () => {
    // SECURITY: Basic input validation
    if (!formData.email || !formData.first_name || !formData.last_name) {
      Logger.warn('Profile update validation failed', {
        hasEmail: !!formData.email,
        hasFirstName: !!formData.first_name,
        hasLastName: !!formData.last_name,
      });
      CustomToaster.show('error', 'Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      Logger.api('POST', 'updatePateintProfile', {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        added_by: formData.added_by,
        gender: formData.gender,
        DOB: formData.DOB,
        profile_picture: formData.profile_picture,
        fileExtension: formData.fileExtension,
      });

      setUploading(true);
      
      const response = await axiosInstance.post('updatePateintProfile', {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        added_by: formData.added_by,
        gender: formData.gender,
        DOB: formData.DOB,
        profile_picture: formData.profile_picture,
        fileExtension: formData.fileExtension,
      });
      
      Logger.info('Profile update successful', {
        hasResponse: !!response?.data,
      });

      // Refresh profile details after update
      if (showdetails) {
        await showdetails();
      }

      CustomToaster.show('success', 'Profile Updated', 'Profile information updated successfully.');
      setIsDisabled(true);
      
      Logger.info('Profile information updated successfully');
    } catch (error) {
      Logger.error('Profile update error', error);
      
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Profile update failed. Please try again later.';
      
      CustomToaster.show('error', 'Update Failed', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container1}>
        <View style={styles.profileHeader}>
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
              source={{
                uri: localimage
                  ? localimage
                  : formData.profile_picture,
              }}
              style={styles.image}
              defaultSource={require('../../../../../assets/images/CardDoctor1.png')}
            />
            <TouchableOpacity
              style={styles.overlay}
              onPress={documentUpload}
              disabled={isDisabled || uploading}>
              <Icon name="camera" size={30} color={COLORS.TEXT_WHITE} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileIdContainer}>
            <Text style={styles.profileIdText}>
              Profile ID : <Text style={styles.profileIdValue}>SRC0001</Text>
            </Text>
          </View>
        </View>

        {/* Mapping the first 5 fields */}
        <View>
          {firstFive.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[index] = el)}
              key={`${item.id}-${item.name}`}
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
          
          <View style={styles.saveButtonContainer}>
            <CustomButton
              title="Save Changes"
              bgColor={COLORS.PRIMARY}
              textColor={COLORS.TEXT_WHITE}
              borderColor={COLORS.PRIMARY}
              borderWidth={1}
              borderRadius={30}
              onPress={handlePersonalUpdate}
              disabled={uploading}
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
  container1: {
    backgroundColor: COLORS.BG_WHITE,
  },
  profileHeader: {
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
  image: {
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
  profileIdContainer: {
    margin: 20,
  },
  profileIdText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: COLORS.TEXT_GRAY,
  },
  profileIdValue: {
    color: COLORS.PRIMARY,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
