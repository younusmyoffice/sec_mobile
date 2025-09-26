import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import CustomButton from '../../customButton/CustomButton';
import styles from '../doctorCard/DoctorCardStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const BookAppointmentCard = ({
  firstname,
  lastname,
  middlename,
  dspecaility,
  hospital,
  day,
  time,
  onClick,
  profile_picture,
  showbtn=true
}) => {
  console.log('profile app', profile_picture);
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback>
        <View style={{padding: 15, gap: 10}}>
          {/* 1st column */}
          <View style={{flexDirection: 'row', gap: 10}}>
            <View>
              <Image
                source={{uri: profile_picture && profile_picture}}
                // source={require('../../../assets/NoAppointment.png')}
            style={{width: wp(25), height: hp(15),resizeMode:'cover'}}
              />
            </View>
            <View style={{gap: hp(1)}}>
              <Text style={styles.doctorName}>
                {firstname + ' ' + middlename + ' ' + lastname}
              </Text>
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-Regular',
                }}>
                {dspecaility}
              </Text>
              <Text
                style={{
                  fontSize: hp(2),
                  color: '#AEAAAE',
                  fontFamily: 'Poppins-Regular',
                }}>
                {hospital}
              </Text>
            </View>
          </View>
          {/* 2nd column */}

          <View style={{gap: 5}}>
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: '500',
                color: '#787579',
                fontFamily: 'Poppins-Medium',
              }}>
              Working Time
            </Text>
            <Text
              style={{
                fontSize: hp(1.7),
                fontWeight: '500',
                color: '#AEAAAE',
                fontFamily: 'Poppins-Regular',
              }}>
              {day} {time}
            </Text>
          </View>
          {/* 3rd column */}
          {
            showbtn&&(

          <View style={{padding: hp(0)}}>
            <CustomButton
              title="Book Appointment"
              bgColor={'#E72B4A'}
              borderRadius={30}
              textColor={'white'}
              padding={hp(0.5)}
              fontSize={hp(2)}
              fontWeight={'bold'}
              onPress={onClick}
            />
          </View>
            )
          }
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default BookAppointmentCard;
