// CustomRadioButton.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomRadioButton = ({ label, selected, onPress, fontSize,fontweight }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.outerCircle}>
        {selected ? <View style={styles.innerCircle} /> : null}
      </View>
      <Text style={[styles.label,{fontSize:fontSize,fontWeight:fontweight}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E72B4A', 
    alignItems: 'center',
    justifyContent: 'center', 
    marginRight: 10,
  },
  innerCircle: {
    height: 12, 
    width: 12,
    borderRadius: 6,
    backgroundColor: '#E72B4A', 
  },
  label: {
    // fontSize: 20,
    color: 'black',
    fontFamily:'Poppins-Regular'
  },
});

export default CustomRadioButton;
