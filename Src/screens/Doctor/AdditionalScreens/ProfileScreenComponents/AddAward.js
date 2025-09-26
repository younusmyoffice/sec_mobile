import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomButton from '../../../../components/customButton/CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useCommon} from '../../../../Store/CommonContext';
import axiosInstance from '../../../../utils/axiosInstance';

export default function AddAward() {
  const staff = [
    {id: 1, name: 'award_title', type: 'text', placeholder: 'Title'},
    {id: 2, name: 'award_issuedby', type: 'text', placeholder: 'Issuing Authority'},
    {id: 3, name: 'award_description', type: 'textarea', placeholder: 'Description'},
  ];

  const {userId} = useCommon();

  const [formData, setFormData] = useState({
    award_title: '',
    award_issuedby: '',
    award_description: '',
    award_date: '', // To hold the selected date
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Manage DateTimePicker visibility

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date selection
  const handleConfirm = date => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    setFormData(prev => ({
      ...prev,
      award_date: formattedDate,
    }));
    setDatePickerVisibility(false); // Hide the picker
  };

  const addAward = async () => {
    console.log('Submitting formData:', formData);
  
    try {
      const response = await axiosInstance.post('Doctor/updateDoctorAwards', {
        suid: userId,
        email: 'doctor2@mail.com',
        award_title: formData.award_title,
        award_issuedby: formData.award_issuedby,
        award_date: formData.award_date,
        award_description: formData.award_description,
      });
  
      // Check if the response has a "response" key and display success message
      if (response.data?.response?.body) {
        alert(response.data.response.body); // Display the success message
        setFormData({
          award_title: '',
          award_issuedby: '',
          award_description: '',
          award_date: '',
        });
      } else if (response.data?.error) {
        // Handle known error cases (e.g., USER_NOT_EXISTS)
        if (response.data.error === 'USER_NOT_EXISTS') {
          alert('Error: The user does not exist.');
        } else {
          alert(`Error: ${response.data.error}`);
        }
      } else {
        // Handle unexpected responses
        alert('Failed to save the award. Please try again.');
      }
    } catch (e) {
      // Handle network or server errors
      console.error('Error occurred:', e.message);
      alert('An error occurred while saving your award. Please check your network and try again.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView backgroundColor={'#fff'}>
        <HeaderDoctor />

        <View style={{padding: 15}}>
          <InAppHeader LftHdr="Add Award" />
        </View>

        {/* Input fields */}
        {staff.map(item => (
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

        {/* Date Picker */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Award Date</Text>
          <Text
            style={styles.datePickerText}
            onPress={() => setDatePickerVisibility(true)}>
            {formData.award_date || 'Select a Date'}
          </Text>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Save Button */}
        <View style={{alignItems: 'center', margin: 20, marginTop: 20}}>
          <CustomButton
            title="Save"
            bgColor={'#E72B4A'}
            fontfamily={'Poppins-Medium'}
            borderRadius={20}
            textColor={'white'}
            width={widthPercentageToDP(50)}
            onPress={addAward}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  datePickerContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  datePickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  datePickerText: {
    fontSize: 16,
    color: '#555',
  },
});
