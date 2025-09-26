import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet, Image, View} from 'react-native';

const SplashScreen = async() => {
  const navigation = useNavigation();
  const storedSuid = await AsyncStorage.getItem('suid');

  console.log('suid for persistent login:', storedSuid);
  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate('Launchscreen');
  //   }, 3000);
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text></Text> 
      <View>
        <Image
          source={require('../assets/images/logo1.png')}
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E72B4A',
  },
  logo: {
    marginLeft: 1,
    marginBottom: 90,
    width: 300,
    height: 103,
  },
});
