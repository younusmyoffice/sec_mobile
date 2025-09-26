import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function InAppCrossBackHeader({
  
  onBackPress, // Function for back button press
  onClosePress, // Function for close button press
  backIcon = 'arrow-back-sharp', // Customizable back icon
  closeIcon = 'close', // Customizable close icon
  showClose = false, // To show or hide the close button
  showBack = true,
  backgroundColor, // Customizable background color
  iconColor = '#313033', // Customizable icon color
  backIconSize = 30, // Customizable back icon size
  closeIconSize = 30,
  text, // Customizable close icon size
  roundicon,
  title,
}) {


  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: backgroundColor}, // Set background color via props
      ]}>
      {/* Back button with onPress functionality */}
      <View>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <Ionicons name={backIcon} size={backIconSize} color={iconColor} />
            {text && (
              <Text style={{color: '#E72B4A', fontWeight: '500', fontSize: 20}}>
                Back
              </Text>
            )}
          </TouchableOpacity>
        )}
        <Text
          style={{
            fontSize: hp(2),
            color: '#313033',
            fontFamily: 'Poppins-SemiBold',
          }}>
          {title}
        </Text>
      </View>
      {/* Conditionally render close button */}
      <View>
        {showClose && (
          <TouchableOpacity onPress={onClosePress}>
            <MaterialIcons
              name={closeIcon}
              size={closeIconSize}
              color={iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {roundicon && (
        <View
          style={{
            borderWidth: 1.5,
            padding: 10,
            borderRadius: 50,
            borderColor: '#E6E1E5',
            // position: 'relative',
            height: hp(4.5),
            width: wp(10),
          }}>
          <TouchableOpacity style={{alignSelf: 'center'}}>
            <MaterialCommunityIcons
              name="kebab-horizontal"
              size={15}
              color="#AEAAAE"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    flexDirection: 'row',
    // paddingHorizontal: 20,
    // padding:10
  },
});
