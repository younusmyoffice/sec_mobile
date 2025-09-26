import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';

const SuccessMessage = () => {
  return (
    <View>
      <View
        style={{
          borderRadius: 100,
          height: hp(15),
          borderWidth: 8,
          width: wp(32),
          borderColor: '#E72B4A',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* <MaterialCommunityIcons name="check" color="#E72B4A" size={80} /> */}
        <View>

        <LottieView
          source={require('../../assets/mark.json')}
          autoPlay
          loop={false} 
          style={{width: 80, height: 80}}
        />
        </View>
      </View>
    </View>
  );
};

export default SuccessMessage;
