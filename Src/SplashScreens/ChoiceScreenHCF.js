import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomRadioButton from '../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../components/customButton/CustomButton';

export default function ChoiceScreenHCF({navigation}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = option => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === 'Admin') {
      navigation.navigate('Register',{roleId:2});
    } else if (selectedOption === 'Diagnostic') {
      navigation.navigate('Register',{roleId:4});
    } else if (selectedOption === 'Clinic') {
      navigation.navigate('Register',{roleId:6});
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: '#FFF', flex: 1}}>
      <View
        style={{
          //   backgroundColor: 'red',
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
          padding: 10,
        }}>
        <Image
          //   style={{minWidth: 250, minHeight: 45}}
          source={require('../assets/images/ShareecareWhiteLogo.png')}
        />
      </View>
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: '#313033'}}>
          Please Select
        </Text>
      </View>
      <View style={{padding: 10, gap: 10}}>
        <TouchableOpacity
          onPress={() => handleSelection('Admin')}
          style={{
            borderColor: selectedOption === 'Admin' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          <CustomRadioButton
            selected={selectedOption === 'Admin'}
            label={'Admin'}
            onPress={() => handleSelection('Admin')}
          />
        </TouchableOpacity>

        {/* Option for Doctor */}
        <TouchableOpacity
          onPress={() => handleSelection('Diagnostic')}
          style={{
            borderColor: selectedOption === 'Diagnostic' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          <CustomRadioButton
            selected={selectedOption === 'Diagnostic'}
            label={'Diagnostic'}
            onPress={() => handleSelection('Diagnostic')}
          />
        </TouchableOpacity>

        {/* Option for Healthcare Facility */}
        <TouchableOpacity
          onPress={() => handleSelection('Clinic')}
          style={{
            borderColor: selectedOption === 'Clinic' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          {/* <Text>I am a Healthcare Facility</Text> */}
          <CustomRadioButton
            selected={selectedOption === 'Clinic'}
            label={'Clinic'}
            onPress={() => handleSelection('Clinic')}
          />
        </TouchableOpacity>

        {/* Continue Button */}
        <View style={{margin: 10, padding: 10, marginTop: 20}}>
          <CustomButton
            title="Continue"
            bgColor="#E72B4A" // Green background
            textColor="#FFF" // White text
            borderColor="#E72B4A" // Darker green border
            borderWidth={1} // 2px border
            borderRadius={30}
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
