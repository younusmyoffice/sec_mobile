import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './CustomButtonStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCommon} from '../../Store/CommonContext';
import {ActivityIndicator} from 'react-native-paper';

const CustomButton = ({
  bgColor, // Default background color
  textColor = 'white', // Default text color
  borderColor, // Default border color
  borderWidth, // Default border width
  borderRadius, // Default border radius
  fontSize, // Default font size
  fontWeight, // Default font weight
  title, // Title is required (no default)
  height, // Default button height
  width, // Default button width
  padding,
  onPress,
  fontfamily,
  showhide,
  lefticon,
  iconname,
  row,
  gap,
  pv = 10,
  iconSize = 20,
  loading=false,
  isFormValid,
  isLogging,
  disabled

  
}) => {
console.log(disabled)
  return (
    <View style={{gap: 5}}>
      <TouchableOpacity
        disabled={isLogging || isFormValid || disabled}
        style={[
          styles.button,
          {
            backgroundColor:isFormValid || disabled ?'gray': bgColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: borderRadius,
            height: height,
            width: width,
            flexDirection: row,
            gap: gap,
            paddingVertical: pv,
          },
        ]}
        onPress={onPress}>
        {lefticon && (
          <MaterialCommunityIcons
            name={iconname}
            color="#E72B4A"
            size={iconSize}
          />
        )}
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.buttonText,

              {
                color: isFormValid?'white':textColor,
                fontSize: fontSize,
                fontWeight: fontWeight,
                padding: padding,
                fontFamily: fontfamily,
              },
            ]}>
            {showhide ? 'Show Less' : title}
          </Text>
          {loading && isLogging && (
            <ActivityIndicator color="white" size={'small'} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

// PropTypes validation
CustomButton.propTypes = {
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.string,
  title: PropTypes.string.isRequired, // Title is still required
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Can be number or string
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Can be number or string
};

export default CustomButton;
