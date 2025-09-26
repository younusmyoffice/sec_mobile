import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import Navigation from './Src/Navigation/Navigaton';
import {DevSettings} from 'react-native';
import CommonProvider from './Src/Store/CommonContext';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationProvider from './Src/Store/Authentication';
import {SocketProvider} from './Src/Store/SocketContext'; // Adjust path if needed
import Toast from 'react-native-toast-message';
import LocationProvider from './Src/Store/LocationContext';

const App = () => {
  if (__DEV__) {
    DevSettings.addMenuItem('Start Debugging', () => {
      DevSettings.setDebuggingEnabled(true);
    });
  }
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleRadioChange = () => {};

  return (
    <>
      <NavigationContainer>
        <AuthenticationProvider>
          <LocationProvider>
            <SocketProvider>
              <CommonProvider>
                <Navigation />
              </CommonProvider>
            </SocketProvider>
          </LocationProvider>
        </AuthenticationProvider>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;
