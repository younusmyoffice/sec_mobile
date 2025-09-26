import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

function CustomTabNavigator({routes}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          const {iconName,isthere=true} = routes.find(r => r.name === route.name);
          return (
            <>
          {
            isthere ?(
              <MaterialCommunityIcons
                name={iconName}
                color={focused ? '#E72B4A' : '#AEAAAE'}
                size={26}
                
              /> 

            ):(
              <Icon
              name={iconName}
              color={focused ? '#E72B4A' : '#AEAAAE'}
              size={26}
              
            /> 
            )
          }
           
              </>
          );
        },
        tabBarActiveTintColor: '#E72B4A',
        tabBarInactiveTintColor: '#AEAAAE',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          fontFamily: 'Poppins-Regular',
        },
        
        headerShown: false,
      })}>
      {routes.map(
        ({name, component, label, resetToInitialScreen, initialScreen}) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{tabBarLabel: label}}
            listeners={({navigation}) => ({
              tabPress: e => {
                if (resetToInitialScreen && initialScreen) {
                  e.preventDefault();
                  navigation.navigate(name, {screen: initialScreen});
                }
              },
            })}
          />
        ),
      )}
    </Tab.Navigator>
  );
}

export default CustomTabNavigator;
