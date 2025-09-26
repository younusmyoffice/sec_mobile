import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import CustomButton from '../../customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InAppHeader({
  LftHdr,
  btnYN,
  btnTitle,
  Navig,
  textbtn,
  textBtnText,
  onClick,
  showReviewHideReview,
  showLess,
  bgcolor = '#E72B4A',
  textcolor = 'white',
  fontsize,
  fontfamily,
  lefticon,
  iconname,
  row,
  gap,
  subtitle,
  iconSize
}) {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.headerText}>{LftHdr}</Text>
        <Text style={{color: '#484649', fontFamily: 'Poppins-Regular'}}>
          {subtitle}
        </Text>
      </View>

      {btnYN ? (
        <>
          <View style={{flexDirection: 'row', alignItems: 'center',top:-7}}>
            
            <CustomButton
              title={btnTitle}
              bgColor={bgcolor}
              borderRadius={30}
              textColor={textcolor}
              onPress={Navig}
              fontSize={fontsize}
              fontfamily={fontfamily}
              iconname={iconname}
              iconSize={iconSize}
              lefticon={lefticon}
              row={row}
              gap={gap}
              height={50}
              // width={60}
            />
          </View>
        </>
      ) : (
        textbtn && (
          <Text
            style={{
              fontSize: hp(1.7),
              color: '#E72B4A',
              fontFamily: 'Poppins-Regular',
            }}
            onPress={onClick}>
            {showReviewHideReview ? (
              <Text>{showLess}</Text>
            ) : (
              <Text>{textBtnText}</Text>
            )}
          </Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    justifyContent: 'space-between',
    // height: 50,
    // backgroundColor: '#fff',
  },
  headerText: {
    fontSize: hp(2),
    color: '#313033',
    fontFamily: 'Poppins-SemiBold',
  },
});
