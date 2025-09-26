import React from 'react';
import {OtpInput} from 'react-native-otp-entry';
 // If using a specific OTP input package
import { SafeAreaView, StyleSheet, View } from 'react-native';
import styles from '../customOtpInput/CustomOtpStyle'
const CustomOtpInput = ({ numberOfDigits, onTextChange,theme }) => {
  return (
    <SafeAreaView>
<View style={{paddingHorizontal:10}}>

      <OtpInput
        numberOfDigits={numberOfDigits}
        onTextChange={onTextChange}
        focusStickBlinkingDuration={500}
        theme={{
          containerStyle: theme?.containerStyle || styles.container,
          pinCodeContainerStyle: theme?.pinCodeContainerStyle || styles.pinCodeContainer,
          pinCodeTextStyle: theme?.pinCodeTextStyle || styles.pinCodeText,
          focusStickStyle: theme?.focusStickStyle || styles.focusStick,
          focusedPinCodeContainerStyle: theme?.focusedPinCodeContainerStyle || styles.focusedPinCodeContainer,
        }}
      />
</View>
    </SafeAreaView>
  );
};



export default CustomOtpInput;
