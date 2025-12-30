import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, Text, StyleSheet, Image, View} from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const storedSuid = await AsyncStorage.getItem('suid');
        const storedToken = await AsyncStorage.getItem('access_token');
        const storedRoleId = await AsyncStorage.getItem('role_id');
        
        console.log('🔍 SplashScreen - Authentication Check:');
        console.log('  - suid for persistent login:', storedSuid);
        console.log('  - access_token:', storedToken ? 'Present' : 'Missing');
        console.log('  - role_id:', storedRoleId);
        
        // Parse suid safely
        let parsedSuid = null;
        if (storedSuid && storedSuid !== 'token' && storedSuid !== 'null') {
          try {
            parsedSuid = JSON.parse(storedSuid);
            console.log('✅ SplashScreen - Parsed suid:', parsedSuid);
          } catch (parseError) {
            console.error('❌ SplashScreen - Error parsing suid:', parseError);
          }
        }
        
        // Parse role_id safely
        let parsedRoleId = null;
        if (storedRoleId && storedRoleId !== 'null') {
          try {
            parsedRoleId = JSON.parse(storedRoleId);
            console.log('✅ SplashScreen - Parsed role_id:', parsedRoleId);
          } catch (parseError) {
            console.error('❌ SplashScreen - Error parsing role_id:', parseError);
          }
        }
        
        // Check if user is authenticated
        if (parsedSuid && storedToken && storedToken !== 'token') {
          console.log('✅ SplashScreen - User is authenticated, navigating to appropriate screen');
          
          // Navigate based on role
          if (parsedRoleId === 2) {
            console.log('🏥 SplashScreen - HCF Admin detected, navigating to HCF Admin Dashboard');
            navigation.navigate('HCFAdminTabNavigation');
          } else {
            console.log('👤 SplashScreen - Regular user detected, navigating to appropriate screen');
            // Add other role-based navigation here
            navigation.navigate('Launchscreen');
          }
        } else {
          console.log('❌ SplashScreen - No valid session found, navigating to Launchscreen');
          navigation.navigate('Launchscreen');
        }
      } catch (error) {
        console.error('❌ SplashScreen - Error checking authentication:', error);
        navigation.navigate('Launchscreen');
      }
    };
    
    // Add a small delay for splash screen effect
    setTimeout(() => {
      checkAuthAndNavigate();
    }, 2000);
  }, [navigation]);
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
