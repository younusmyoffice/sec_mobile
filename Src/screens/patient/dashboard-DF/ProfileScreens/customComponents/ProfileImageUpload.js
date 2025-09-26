import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ProfileImageUpload = ({imageUrl, onImageChange}) => {
  const [image, setImage] = useState(
    typeof imageUrl === 'string' ? {uri: imageUrl} : imageUrl,
  );

  const handleImagePress = () => {
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

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 1,
    };
    launchCamera(options, response => {
      if (!response.didCancel && !response.errorCode) {
        const newImage = {uri: response.assets[0].uri};
        setImage(newImage);
        onImageChange(newImage.uri); 
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorCode) {
        const newImage = {uri: response.assets[0].uri};
        setImage(newImage);
        onImageChange(newImage.uri); // Send the new image URI to the parent
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={typeof image === 'string' ? {uri: image} : image}
        style={styles.image}
      />
      <TouchableOpacity style={styles.overlay} onPress={handleImagePress}>
        <Icon name="camera" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

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
