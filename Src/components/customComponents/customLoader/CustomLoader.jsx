import {View, Text} from 'react-native';
import React from 'react';
import {ActivityIndicator} from 'react-native-paper';

const CustomLoader = () => {
  return (
    <View>
      <ActivityIndicator size={180} color="#E72B4A" />
    </View>
  );
};

export default CustomLoader;
