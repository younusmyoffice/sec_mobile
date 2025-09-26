import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import DoctorProfileCard from '../../../../components/customCards/DoctorProfileCard/DoctorProfileCard';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { baseUrl } from '../../../../utils/baseUrl'; // Ensure this is imported
import { useCommon } from '../../../../Store/CommonContext';

export default function TermsCondition({listingId}) {
  const [description, setDescription] = useState(''); // State for the description input
  const{userId}=useCommon();

  // Function to handle API submission
  const submitTerms = async () => {
    if (description.trim() === '') {
      Alert.alert('Error', 'Please enter the terms and conditions.');
      return;
    }

    const payload = {
      doctor_list_id: listingId, // Replace with dynamic value if needed
      doctor_id: userId, // Replace with dynamic value if needed
      description: description, // The input text from the user
    };
    console.log(" Payload for terms and condition",payload)

    try {
      const response = await axios.post(`${baseUrl}createUpdatedoctorlisting/terms`, payload);

      if (response.data.response) {
        console.log('t&c',response.data.response.termsConditions.description)
        Alert.alert('Success', 'Terms and Conditions have been saved successfully!');
      } else {
        Alert.alert('Error', 'Failed to save terms. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting terms:', err);
      Alert.alert('Error', 'An error occurred while submitting terms. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <DoctorProfileCard /> */}

      <View style={{ margin: 10, paddingTop: 10, gap: 10 }}>
        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#313003' }}>
          Terms & Conditions
        </Text>
        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#939094' }}>
          <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#E72B4A' }}>*</Text>
          Mention all terms and conditions related to this listing.
        </Text>

        <View style={{ marginTop: 20 }}>
          <CustomInput
            type="textarea" // Use textarea type for multi-line input
            placeholder="Enter your terms and conditions"
            value={description} // Bind to state
            onChange={(name, value) => setDescription(value)} // Update state on change
            fontSize={14}
          />
        </View>
      </View>

      <View style={{ gap: 10, alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 }}>
        {/* <CustomButton
          title="Save As Draft"
          fontfamily={'Poppins-SemiBold'}
          textColor={'#E72B4A'}
          fontSize={hp(2)}
          borderWidth={1}
          borderColor={'#E72B4A'}
          borderRadius={20}
          width={wp(55)}
        /> */}

        <CustomButton
          title="Next"
          bgColor={'#E72B4A'}
          fontfamily={'Poppins-SemiBold'}
          textColor={'white'}
          fontSize={hp(2)}
          borderRadius={20}
          width={wp(55)}
          onPress={submitTerms} // Call the submit function
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
