import {StyleSheet, Text, View,PixelRatio} from 'react-native';
import React from 'react';
import CustomButton from '../../customButton/CustomButton';

export default function FreeTrailHeader() {
  const fontScale = PixelRatio.getFontScale();
const getFontSize = size => size / fontScale;
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flex: 7,
          alignItems: 'center',
          justifyContent: 'center',
          // paddingHorizontal: 20,
          height: 50,
        }}>
        <Text
          style={{
            // fontWeight:'200',
            color:'#787579',
            fontFamily: 'Poppins-Regular',
            fontSize: getFontSize(13.5),  
            // color:'black'
          }}>
          You have 12 day left of free trail
        </Text>
      </View>
      <View
        style={{
          flex: 4,
          padding: 3,
          alignItems: 'center',
          justifyContent: 'center',
          // paddingHorizontal: 10,
          height: 50,
        }}>
        <CustomButton
          title="Upgrage Now"
          borderColor="#E72B4A"
          borderWidth={1}
          bgColor="#E72B4A"
          borderRadius={40}
          textColor={'#fff'}
          padding={0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
