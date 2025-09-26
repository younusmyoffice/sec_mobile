import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ProfileImageUpload from './ProfileImageUpload';
import CustomInput from '../../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../../components/customComponents/InAppHeadre/InAppHeader';
import CustomButton from '../../../../../components/customButton/CustomButton';


export default function PaymentDetails() {
  // Staff data for the inputs
  const PaymentDetails = [
    { id: 1, name: 'cardname', type: 'text', placeholder: 'Name on Card' },
    { id: 2, name: 'card',
        type: 'cardNumber',
        placeholder: 'Enter your card',
        maxLength: 19,
        },
    { id: 3, name: 'expiridate', type: 'date', placeholder: 'Expiri Date' },
    { id: 4, name: 'cvv', type: 'text', placeholder: 'CVV' },
    
   
  ];

  // Split the data into two parts: the first 5 and the rest
  const firstFive = PaymentDetails.slice(0, 5);
  const rest = PaymentDetails.slice(5);

  // State to manage the form data, including imageUrl for ProfileImageUpload
  const [formData, setFormData] = useState({
    fname: '',
    mname: '',
    lname: '',
    designation: '',
    dateOfBirth: '',
    country: '',
    state: '',
    zipCode: '',
    city: '',
    street1: '',
    street2: '',
    imageUrl: require('../../../../../assets/images/CardDoctor2.png'),  // Default image
  });

  // Handle changes in form fields
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (newImage) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: newImage,  // Update image URL in the state
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Mapping the first 5 fields */}
      {firstFive.map((item) => (
        <CustomInput
          key={item.id}
          name={item.name}
          type={item.type}
          placeholder={item.placeholder}
          value={formData[item.name] || ''}
          onChange={handleChange}
          options={item.options || []} // Pass options for select input
        />
      ))}

      {/* InAppHeader between the two sections */}
     
      {/* Mapping the rest of the fields */}
      {rest.map((item) => (
        <CustomInput
          key={item.id}
          name={item.name}
          type={item.type}
          placeholder={item.placeholder}
          value={formData[item.name] || ''}
          onChange={handleChange}
          options={item.options || []} // Pass options for select input
        />
      ))}

<View style={{margin: 10, padding: 10, marginTop: 20}}>
          <CustomButton
            title="Save Changes"
            bgColor="#E72B4A" // Green background
            textColor="#FFF" // White text
            borderColor="#E72B4A" // Darker green border
            borderWidth={1} // 2px border
            borderRadius={30}
            // onPress={handleContinue}
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
