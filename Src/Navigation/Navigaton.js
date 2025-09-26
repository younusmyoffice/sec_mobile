import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../SplashScreens/SplashScreen';
import Launchscreen from '../SplashScreens/Launchscreen';
import ChoiceScreen1 from '../SplashScreens/ChoiceScreen1';
import ChoiceScreenHCF from '../SplashScreens/ChoiceScreenHCF';
import CustomTabNavigator from './CustomTabNavigator';
import {
  patientRoutes,
  adminRoutes,
  doctorRoutes,
  clinicRoutes,
  diagnosticRoutes,
} from './TabNavigationData';
import Header from '../components/customComponents/Header/Header';
import HeaderDoctor from '../components/customComponents/HeaderDoctor/HeaderDoctor';
import AdminHeader from '../components/customComponents/AdminHeader/AdminHeader';
import NotificationScreen from '../screens/additionalScreens/NotificationScreen';
import Register from '../authentication/Register';
import Login from '../authentication/Login';
import VerifyEmail from '../authentication/VerifyEmail';
import InformationStepper from '../authentication/UserInformation/InformationStepper';
import socketIO from 'socket.io-client';

import Home from '../ChatScreens/Components/Home';
import ChatPage from '../ChatScreens/Components/ChatPage';
import Join from '../scenes/join';
import meeting from '../scenes/meeting';
import ForgetPassword from '../authentication/ForgetPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const socket = socketIO.connect('http://localhost:4000', {
  // put here the url of backend
  reconnectionAttempts: 5, // Attempt reconnection up to 5 times
  reconnectionDelay: 1000, // Delay between reconnection attempts (1 second)
  reconnectionDelayMax: 5000, // Max delay between reconnection attempts (5 seconds)
});
console.log('socket iii i i ', socket);

function PatientTabNavigation() {
  if (!patientRoutes) {
    console.error('patientRoutes is undefined');
  }
  return <CustomTabNavigator routes={patientRoutes} />;
}
function DoctorTabNavigation() {
  return <CustomTabNavigator routes={doctorRoutes} />;
}

function AdminTabNavigation() {
  return <CustomTabNavigator routes={adminRoutes} />;
}
function ClinicTabNavigation() {
  return <CustomTabNavigator routes={clinicRoutes} />;
}
function DiagnosticTabNavigation() {
  return <CustomTabNavigator routes={diagnosticRoutes} />;
}
const SplashScreenWithAuth = () => {
  const navigation=useNavigation();
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        const userData = await AsyncStorage.getItem('role_id');
        const storedSuid = await AsyncStorage.getItem('suid');

        console.log('suid for persistent login:', storedSuid);

        // Normalize the role to match stack names
        const roleMap = {
          2: 'AdminNavigation',
          3: 'DoctorNavigation',
          4: 'DiagnosticNavigation',
          5: 'PatientNavigation',
          6: 'ClinicNavigation',
        };

        // Delay navigation to show splash screen briefly
        setTimeout(() => {
          if (accessToken && userData) {
            const normalizedRole = roleMap[Number(userData)] ; 
            console.log('Navigating to:', normalizedRole); // Debug log
            navigation.replace(normalizedRole);
          } else {
            console.log('No session, navigating to Authentication');
            navigation.replace('Launchscreen');
          }
        }, 2000); // 2-second delay (adjust as needed)
      } catch (error) {
        console.error('Error checking session:', error);
        setTimeout(() => {
          navigation.replace('Launchscreen');
        }, 2000);
      }
    };

    checkSession();
  }, [navigation]);

  return <SplashScreen />;
};
const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreenWithAuth}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Launchscreen"
        component={Launchscreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChoiceScreen1"
        component={ChoiceScreen1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChoiceScreenHCF"
        component={ChoiceScreenHCF}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileComplete"
        component={InformationStepper}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PatientNavigation"
        component={PatientTabNavigation}
        options={{
          headerShown: false,

          // headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="DoctorNavigation"
        component={DoctorTabNavigation}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DiagnosticNavigation"
        component={DiagnosticTabNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ClinicNavigation"
        component={ClinicTabNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdminNavigation"
        component={AdminTabNavigation}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="notification-open"
        component={NotificationScreen}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="ChatHomeMain"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatsScreenChatMain"
        component={ChatPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Join_Screen"
        component={Join}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Meeting_Screen"
        component={meeting}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
export default Navigation;
