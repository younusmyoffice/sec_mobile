import {
  Image,
  SafeAreaView,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {Component, useState} from 'react';
import styles from './DoctorCardStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getProfileImageSource, handleImageError, handleImageLoad } from '../../../utils/imageUtils';
const {width} = Dimensions.get('window');

const DoctorCard = ({
  speciality = 'All',
  onClick,
  firstname,
  middlename,
  lastname,
  hospital,
  reviewstar,
  reviews,
  profile_picture,
}) => {
  console.log('profile', `${profile_picture}`);
  const [imageError, setImageError] = useState(false);
  
  const stars = Array.from({length: reviewstar}, (_, index) => index);
  return (
    <SafeAreaView style={[styles.card, {width: width * 0.9}]}>
      <TouchableWithoutFeedback onPress={onClick}>
        <View style={styles.cardbody}>
          <Image
            source={getProfileImageSource(profile_picture)}
            onLoad={handleImageLoad}
            onError={(error) => handleImageError(error, setImageError)}
            style={{width: wp(25), height: hp(15), resizeMode: 'cover'}}
            defaultSource={require('../../../assets/images/CardDoctor1.png')}
          />

          <View style={styles.textContainer}>
            <View>
              <Text style={styles.doctorName}>
                {firstname + ' ' + middlename + ' ' + lastname}
              </Text>
              <View style={styles.line}></View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>
                {speciality} | {hospital}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {stars.map((star, index) => (
                  <MaterialCommunityIcons
                    key={index}
                    name="star"
                    color="#E72B4A"
                     // You can adjust the size
                  />
                ))}
                <Text style={styles.detailsText}>
                  {reviews}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default DoctorCard;
