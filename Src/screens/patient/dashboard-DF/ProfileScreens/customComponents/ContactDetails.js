import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import ProfileImageUpload from './ProfileImageUpload';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomButton from '../../../../../components/customButton/CustomButton';
import axiosInstance from '../../../../../utils/axiosInstance';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomToaster from '../../../../../components/customToaster/CustomToaster';
export default function ContactDetails({
  rest,
  formData,
  setFormData,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable
}) {
  // Handle changes in form fields
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log("state:",formData.state_id)
    console.log("city:",formData.city_id)
    if (name === 'country_id') {
      setFormData(prev => ({
        ...prev,
        state_id: '',
      }));
    }
  };

  // Handle image change
  const handleImageChange = newImage => {
    setFormData(prev => ({
      ...prev,
      imageUrl: newImage, // Update image URL in the state
    }));
  };
  const handleContactUpdate = async () => {
    try {
      const response = await axiosInstance.post('updatePateintProfile', {
        email: formData.email,
        country_id: formData.country_id,
        state_id: formData.state_id,
        city_id: formData.city_id,
        street_address1: formData.street_address1,
        street_address2: formData.street_address2,
        zip_code: formData.zip_code,
      });
      showdetails();
      CustomToaster.show('success','Contact Updated','Contact information updated')

      console.log('success', response.message);
    } catch (e) {
      CustomToaster.show('error',e.message)

      console.log(e);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rest.map(item =>  (
          <CustomInput
          ref={el => (inputRefs.current[index] = el)}
            key={item.id}
            name={item.name}
            type={item.type}
            placeholder={item.placeholder}
            value={formData[item.name]}
            onChange={handleChange}
            options={item.options || []}
            disabled={item.name === 'email' || isDisabled}
            fontFamily={'Poppins-Medium'}
            fontSize={hp(1.7)}

          />
        )
      )}

      <View style={{margin: 10, padding: 10, marginTop: 20}}>
        <CustomButton
          title="Save Changes"
          bgColor="#E72B4A" // Green background
          textColor="#FFF" // White text
          borderColor="#E72B4A" // Darker green border
          borderWidth={1} // 2px border
          borderRadius={30}
          onPress={handleContactUpdate}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 15,
  },
});
