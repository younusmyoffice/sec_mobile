import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useCommon } from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';

export default function TermsCondition({listingId, onListingCreated, editMode = false, existingListing = null, existingTerms = null}) {
  const [description, setDescription] = useState(''); // State for the description input
  const{userId}=useCommon();

  // Handle existing terms data when in edit mode
  useEffect(() => {
    console.log('📝 TermsCondition useEffect triggered:', { editMode, existingTerms });
    
    if (editMode && existingTerms) {
      console.log('📝 TermsCondition - existingTerms received:', existingTerms);
      
      // Handle different possible data structures
      let termsText = '';
      if (typeof existingTerms === 'string') {
        termsText = existingTerms;
      } else if (existingTerms.description) {
        termsText = existingTerms.description;
      } else if (existingTerms.terms_description) {
        termsText = existingTerms.terms_description;
      } else if (existingTerms.text) {
        termsText = existingTerms.text;
      }
      
      console.log('📝 TermsCondition - extracted terms text:', termsText);
      if (termsText) {
        setDescription(termsText);
        console.log('📝 TermsCondition - description set to:', termsText);
      } else {
        console.log('📝 TermsCondition - no terms text found in:', existingTerms);
      }
    } else if (editMode) {
      console.log('📝 TermsCondition - edit mode but no existingTerms provided');
    }
  }, [editMode, existingTerms]);

  // Function to handle API submission
  const submitTerms = async () => {
    // Check if user is authenticated
    if (!userId || userId === 'token' || userId === null || userId === undefined) {
      Alert.alert('Error', 'Please login to submit terms and conditions');
      return;
    }

    if (description.trim() === '') {
      Alert.alert('Error', 'Please enter the terms and conditions.');
      return;
    }

    if (!listingId) {
      Alert.alert('Error', 'Listing information missing. Please complete previous steps first.');
      return;
    }

    const payload = {
      doctor_list_id: listingId, // Replace with dynamic value if needed
      doctor_id: userId, // Replace with dynamic value if needed
      description: description, // The input text from the user
    };
    console.log(" Payload for terms and condition",payload)

    try {
      const response = await axiosInstance.post(`createUpdatedoctorlisting/terms`, payload);

      if (response.data.response) {
        console.log('t&c',response.data.response.termsConditions.description)
        Alert.alert('Success', `Terms and Conditions have been ${editMode ? 'updated' : 'saved'} successfully!`, [
          {
            text: 'OK',
            onPress: () => {
              if (onListingCreated) {
                onListingCreated();
              }
            }
          }
        ]);
      } else {
        Alert.alert('Error', `Failed to ${editMode ? 'update' : 'save'} terms. Please try again.`);
      }
    } catch (err) {
      console.error('Error submitting terms:', err);
      Alert.alert('Error', `An error occurred while ${editMode ? 'updating' : 'submitting'} terms. Please try again.`);
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
          title={editMode ? "Update" : "Next"}
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
