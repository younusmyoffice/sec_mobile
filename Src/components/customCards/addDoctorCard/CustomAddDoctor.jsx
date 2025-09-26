import {View, Text, SafeAreaView, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from '../../customButton/CustomButton';
const CustomAddDoctor = () => {
  return (
    <SafeAreaView>
      <View
        style={{
          borderRadius: 16,
        //   padding:9,
        paddingHorizontal:10,
        paddingVertical:8,
          borderColor: '#E6E1E5',
          borderWidth: 1,
          margin: 10,
          backgroundColor: '#fff',
         
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10,}}>
          <View>
            <Image
              source={require('../../../assets/cimg.png')}
              style={{
                borderRadius: 10,
                elevation: 2,
                height: hp(10),
                width: wp(20),
                // 35% of screen width
                resizeMode: 'cover',
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: hp(2),
                color: '#1C1B1F',
                fontWeight: '400',
                fontFamily: 'Poppins-SemiBold',
              }}>
              Dr. Elizabeth Davis
            </Text>
            <Text
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                fontSize: hp(2),
                color: '#787579',
                fontFamily: 'Poppins-thin',
              }}>
              Neurologist
            </Text>
          </View>
        </View>
        <View style={{alignSelf:'flex-end'}}>
          <CustomButton
            title="Remove"
            borderWidth={1}
            textColor={'#E72B4A'}
            fontfamily={'Poppins-SemiBold'}
            borderColor={'#E72B4A'}
            borderRadius={20}
            width={wp(30)}
            height={hp(5)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomAddDoctor;
