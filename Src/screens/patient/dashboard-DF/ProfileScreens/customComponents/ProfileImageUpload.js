/**
 * ============================================================================
 * PROFILE IMAGE UPLOAD COMPONENT
 * ============================================================================
 * 
 * PURPOSE:
 * Reusable component for uploading profile images via camera or gallery.
 * 
 * FEATURES:
 * - Camera capture
 * - Gallery selection
 * - Image preview with error handling
 * 
 * SECURITY:
 * - Uses imageUtils for secure image handling
 * - Proper image error handling
 * 
 * ERROR HANDLING:
 * - Image error handling with fallback
 * - Uses imageUtils for consistent image source handling
 * 
 * REUSABLE COMPONENTS:
 * - Uses imageUtils for standardized image handling
 * 
 * STYLING:
 * - Uses COLORS constants for consistent theming (via imageUtils)
 * - StyleSheet.create() for optimized styling
 * 
 * @module ProfileImageUpload
 */

import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  getProfileImageSource,
  handleImageError,
  handleImageLoad,
} from '../../../../../utils/imageUtils';
import Logger from '../../../../../constants/logger';
import { COLORS } from '../../../../../constants/colors';

const ProfileImageUpload = ({imageUrl, onImageChange}) => {
  const [imageError, setImageError] = useState(false);

  /**
   * Handle image press to show selection options
   */
  const handleImagePress = () => {
    Logger.debug('Profile image upload initiated');
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        {text: 'Camera', onPress: () => openCamera()},
        {text: 'Gallery', onPress: () => openGallery()},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  /**
   * Open camera to capture image
   * ERROR HANDLING: Handles camera errors gracefully
   */
  const openCamera = () => {
    Logger.debug('Opening camera');
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 1,
    };
    launchCamera(options, response => {
      if (!response.didCancel && !response.errorCode) {
        if (response.assets && response.assets.length > 0) {
          const newImage = response.assets[0].uri;
          Logger.info('Image captured from camera', { hasUri: !!newImage });
          onImageChange(newImage);
        }
      } else if (response.errorCode) {
        Logger.error('Camera error', { errorCode: response.errorCode });
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } else {
        Logger.debug('Camera cancelled');
      }
    });
  };

  /**
   * Open gallery to select image
   * ERROR HANDLING: Handles gallery errors gracefully
   */
  const openGallery = () => {
    Logger.debug('Opening gallery');
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorCode) {
        if (response.assets && response.assets.length > 0) {
          const newImage = response.assets[0].uri;
          Logger.info('Image selected from gallery', { hasUri: !!newImage });
          onImageChange(newImage);
        }
      } else if (response.errorCode) {
        Logger.error('Gallery error', { errorCode: response.errorCode });
        Alert.alert('Error', 'Failed to select image. Please try again.');
      } else {
        Logger.debug('Gallery cancelled');
      }
    });
  };

  Logger.debug('ProfileImageUpload rendered', { hasImageUrl: !!imageUrl });

  return (
    <View style={styles.container}>
      <Image
        source={getProfileImageSource(imageUrl)}
        onLoad={() => handleImageLoad(setImageError)}
        onError={(error) => handleImageError(error, setImageError)}
        style={styles.image}
        defaultSource={require('../../../../../assets/images/CardDoctor1.png')}
      />
      <TouchableOpacity style={styles.overlay} onPress={handleImagePress}>
        <Icon name="camera" size={30} color={COLORS.TEXT_WHITE} />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styling using StyleSheet.create() for performance
 * Uses COLORS constants for consistent theming
 */
const styles = StyleSheet.create({
  container: {
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
});

export default ProfileImageUpload;
