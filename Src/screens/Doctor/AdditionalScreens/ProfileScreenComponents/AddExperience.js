import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomButton from '../../../../components/customButton/CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../Store/CommonContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddExperience() {
  const {userId} = useCommon();

  const staff = [
    {id: 1, name: 'job', type: 'text', placeholder: 'Job Title'},
    {
      id: 2,
      name: 'organisation',
      type: 'text',
      placeholder: 'Organisation/Hospital',
    },
  ];

  const [formData, setFormData] = useState({
    job: '',
    organisation: '',
    from_date: '',
    to_date: '',
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentDateField, setCurrentDateField] = useState(''); // To track which field is being set

  const showDatePicker = field => {
    setCurrentDateField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    setFormData(prev => ({
      ...prev,
      [currentDateField]: formattedDate,
    }));
    hideDatePicker();
  };

  const addExperiences = async () => {
    console.log('Submitting formData:', {...formData, suid: userId});

    if (new Date(formData.from_date) >= new Date(formData.to_date)) {
      alert("The 'From Date' must be earlier than the 'To Date'.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        'Doctor/updateDoctorExperience',
        {
          suid: userId,
          email: 'doctor2@mail.com',
          job: formData.job,
          organisation: formData.organisation,
          from_date: formData.from_date,
          to_date: formData.to_date,
        },
      );

      // if (response.data.success) {
      //   alert('Experience saved successfully!');
      //   setFormData({
      //     job: '',
      //     organisation: '',
      //     from_date: '',
      //     to_date: '',
      //   });
      // } else {
      //   alert('Failed to save experience. Please try again.');
      // }
      console.log('Submitting formDatawww:', formData);

    } catch (e) {
      console.error('Error occurred:', e.message);
      alert(
        'An error occurred while saving your experience. Please try again.',
      );
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView backgroundColor={'#fff'}>
        <HeaderDoctor />

        <View style={{padding: 15}}>
          <InAppHeader LftHdr="Add Experience" />
        </View>
        {staff.map(item => (
          <CustomInput
            key={item.id}
            name={item.name}
            type={item.type}
            placeholder={item.placeholder}
            value={formData[item.name] || ''}
            onChange={handleChange}
            disabled={item.name === 'email'}
            fontFamily={'Poppins-Medium'}
            fontSize={20}
          />
        ))}
        <View style={styles.datePickerContainer}>
          <CustomButton
            title={`From Date: ${formData.from_date || 'Select'}`}
            bgColor={'#E72B4A'}
            textColor={'white'}
            onPress={() => showDatePicker('from_date')}
          />
          <CustomButton
            title={`To Date: ${formData.to_date || 'Select'}`}
            bgColor={'#E72B4A'}
            textColor={'white'}
            onPress={() => showDatePicker('to_date')}
          />
        </View>
        <View style={{alignItems: 'center', margin: 20, marginTop: 20}}>
          <CustomButton
            title="Save"
            bgColor={'#E72B4A'}
            fontfamily={'Poppins-Medium'}
            borderRadius={20}
            textColor={'white'}
            width={widthPercentageToDP(50)}
            onPress={addExperiences}
          />
        </View>
      </SafeAreaView>

      {/* DateTimePickerModal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
});
