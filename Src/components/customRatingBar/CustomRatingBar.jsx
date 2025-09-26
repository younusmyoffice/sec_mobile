import {View, Text} from 'react-native';
import React from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomRatingBar = ({pat,exp,rev,rat}) => {
  // console.log('data' + data);
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-evenly',
      }}>
      {/* {data?.ratings.map((field, index) => ( */}
        <View
          // key={index}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FDEAED',
              padding: 10,
              borderRadius: 50,
              height: hp(7),
              width: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6
              name='user'
              size={hp(3)}
              color={'#E72B4A'}
            />
          </View>
          <Text
            style={{
              color: '#E72B4A',
              fontSize: hp(2),
              fontFamily: 'Poppins-SemiBold',
              marginTop: 5,
            }}>
            {pat}
          </Text>
          <Text style={{color: '#313033', fontSize: hp(1.8)}}>
          Patients
          </Text>
        </View>
        <View
          // key={index}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FDEAED',
              padding: 10,
              borderRadius: 50,
              height: hp(7),
              width: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6
              name='suitcase'
              size={hp(3)}
              color={'#E72B4A'}
            />
          </View>
          <Text
            style={{
              color: '#E72B4A',
              fontSize: hp(2),
              fontFamily: 'Poppins-SemiBold',
              marginTop: 5,
            }}>
            {exp}
          </Text>
          <Text style={{color: '#313033', fontSize: hp(1.8)}}>
          Experience
          </Text>
        </View>
        <View
          // key={index}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FDEAED',
              padding: 10,
              borderRadius: 50,
              height: hp(7),
              width: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6
              name='star'
              size={hp(3)}
              color={'#E72B4A'}
            />
          </View>
          <Text
            style={{
              color: '#E72B4A',
              fontSize: hp(2),
              fontFamily: 'Poppins-SemiBold',
              marginTop: 5,
            }}>
            {rat}
          </Text>
          <Text style={{color: '#313033', fontSize: hp(1.8)}}>
          Rating
          </Text>
        </View>
        <View
          // key={index}
          style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FDEAED',
              padding: 10,
              borderRadius: 50,
              height: hp(7),
              width: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6
              name='message'
              size={hp(3)}
              color={'#E72B4A'}
            />
          </View>
          <Text
            style={{
              color: '#E72B4A',
              fontSize: hp(2),
              fontFamily: 'Poppins-SemiBold',
              marginTop: 5,
            }}>
            {rev}
          </Text>
          <Text style={{color: '#313033', fontSize: hp(1.8)}}>
          Reviews
          </Text>
        </View>
      {/* ))} */}
    </View>
  );
};

export default CustomRatingBar;
