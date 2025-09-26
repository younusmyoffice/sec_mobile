import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomRadioButton from '../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../components/customButton/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChoiceScreen1({navigation}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelection = async(option,id) => {
    setSelectedOption(option);
    await AsyncStorage.setItem('roleid',JSON.stringify(id))
    // const id1 = await AsyncStorage.getItem('roleid');
    // console.log(id1)
  };

  const handleContinue = async () => {
    if (selectedOption === 'Patient') {
      navigation.navigate('Register', {roleId: 5});
    } else if (selectedOption === 'Doctor') {
      navigation.navigate('Register', {roleId: 3});
    } else if (selectedOption === 'HCF') {
      navigation.navigate('ChoiceScreenHCF');
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
          onPress={() => handleSelection('Patient',5)}
          style={{
            borderColor: selectedOption === 'Patient' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          <CustomRadioButton
            selected={selectedOption === 'Patient'}
            label={'I am a Patient'}
            onPress={() => handleSelection('Patient',1)}
          />
        </TouchableOpacity>

        {/* Option for Doctor */}
        <TouchableOpacity
          onPress={() => handleSelection('Doctor',3)}
          style={{
            borderColor: selectedOption === 'Doctor' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          <CustomRadioButton
            selected={selectedOption === 'Doctor'}
            label={'I am a Doctor'}
            onPress={() => handleSelection('Doctor',3)}
          />
        </TouchableOpacity>

        {/* Option for HCF Facility */}
        <TouchableOpacity
          onPress={() => handleSelection('HCF')}
          style={{
            borderColor: selectedOption === 'HCF' ? '#E72B4A' : '#ccc',
            borderWidth: 1,
            padding: 10,
            margin: 5,
            borderRadius: 16,
            height: 80,
            justifyContent: 'center',
          }}>
          {/* <Text>I am a HCF Facility</Text> */}
          <CustomRadioButton
            selected={selectedOption === 'HCF'}
            label={'I am a HCF'}
            onPress={() => handleSelection('HCF')}
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
