import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';

export default function DoctorProfileCard() {
  return (
    <View
      style={{
        margin: 5,
        borderColor: '#EFEFEF',
        borderWidth: 1,
        borderRadius: 8,
        paddingBottom: 0,
        padding: 5,
      }}>
      <View
        style={{
          padding: 5,
          // backgroundColor:'red',
          alignItems: 'flex-end',
          // justifyContent:'flex-end',
          // position: 'relative',
          // height: hp(4.5),
        }}>
        <TouchableOpacity style={{flexDirection: 'row', gap: 2}}>
          <MaterialCommunityIcons
            style={{top: -5}}
            name="pencil"
            size={24}
            color="#E72B4A"
          />
          <Text
            style={{
              color: '#E72B4A',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 12,
            }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          top: -15,
          padding: 5,
        }}>
        <View>
          <Image
            style={{width: 60, height: 60, borderRadius: 8}}
            source={require('../../../assets/cimg.png')}
          />
        </View>
        <View style={{gap: 5}}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              color: '#313033',
            }}>
            Dr.Maria Garcia
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 10,
              color: '#939094',
            }}>
            Neurologist
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
