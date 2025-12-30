import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomButton from '../../../../components/customButton/CustomButton';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';
import axiosInstance from '../../../../utils/axiosInstance';
import { useCommon } from '../../../../Store/CommonContext';
import { useNavigation } from '@react-navigation/native';

export default function AddLisenceCertification() {
  const navigation = useNavigation();
  const { userId } = useCommon();
  
  // Staff data for the inputs
  const certification = [
    { id: 1, name: 'lic_title', type: 'text', placeholder: 'Title' },
    { id: 2, name: 'lic_certificate_no', type: 'text', placeholder: 'Certificate No' },
    { id: 3, name: 'lic_issuedby', type: 'text', placeholder: 'Issuing Authority' },
    { id: 4, name: 'lic_date', type: 'text', placeholder: 'Issuing Date' },
    { id: 5, name: 'lic_description', type: 'textarea', placeholder: 'Description' },
  ];
  
  const lisence = [
    { id: 1, name: 'lic_title', type: 'text', placeholder: 'Medical License' },
    { id: 2, name: 'lic_certificate_no', type: 'text', placeholder: 'Certificate No' },
    { id: 3, name: 'lic_issuedby', type: 'text', placeholder: 'Issuing Authority' },
    { id: 4, name: 'lic_date', type: 'text', placeholder: 'Issuing Date' },
    { id: 5, name: 'lic_description', type: 'textarea', placeholder: 'Description' },
  ];

  // State to manage the form data
  const [formData, setFormData] = useState({
    lic_title: '',
    lic_certificate_no: '',
    lic_issuedby: '',
    lic_date: '',
    lic_description: '',
  });

  // State to manage the checkbox selection
  const [isCertificationSelected, setIsCertificationSelected] = useState(false);
  const [isLicenseSelected, setIsLicenseSelected] = useState(false);

  // Handle changes in form fields
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCertificationChange = (value) => {
    setIsCertificationSelected(value);
    // Ensure that if Certification is selected, License is unselected
    if (value) {
      setIsLicenseSelected(false);
    }
  };

  const handleLicenseChange = (value) => {
    setIsLicenseSelected(value);
    // Ensure that if License is selected, Certification is unselected
    if (value) {
      setIsCertificationSelected(false);
    }
  };

  const addLicenseCertification = async () => {
    console.log('📜 Submitting license/certification formData:', formData);
    
    // Validate required fields
    if (!formData.lic_title || !formData.lic_issuedby || !formData.lic_date) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Title, Issuing Authority, and Date)');
      return;
    }

    if (!isCertificationSelected && !isLicenseSelected) {
      Alert.alert('Selection Required', 'Please select either Certification or License');
      return;
    }

    try {
      const response = await axiosInstance.post('Doctor/updateDoctorLicense', {
        suid: userId,
        email: 'doctor2@mail.com',
        lic_title: formData.lic_title,
        lic_certificate_no: formData.lic_certificate_no,
        lic_issuedby: formData.lic_issuedby,
        lic_date: formData.lic_date,
        lic_description: formData.lic_description,
      });

      console.log('📜 License/Certification API response:', response.data);

      // Check for success in multiple possible response formats
      const isSuccess = response.data?.response?.body || 
                       response.data?.success === true || 
                       response.data?.status === 'success' ||
                       response.status === 200;
      
      if (isSuccess) {
        Alert.alert('Success!', `${isCertificationSelected ? 'Certification' : 'License'} added successfully`, [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to ProfileScreenDoctor
              navigation.goBack();
            }
          }
        ]);
        setFormData({
          lic_title: '',
          lic_certificate_no: '',
          lic_issuedby: '',
          lic_date: '',
          lic_description: '',
        });
        setIsCertificationSelected(false);
        setIsLicenseSelected(false);
      } else if (response.data?.error) {
        Alert.alert('Error', `Failed to add ${isCertificationSelected ? 'certification' : 'license'}: ${response.data.error}`);
      } else {
        Alert.alert('Error', 'Failed to save. Please try again.');
      }
    } catch (e) {
      console.error('📜 Error occurred:', e.message);
      console.error('📜 Error details:', e.response?.data);
      Alert.alert('Error', 'An error occurred while saving. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderDoctor />
      <SafeAreaView style={{backgroundColor:'#fff',padding:10}}>
        

        <View style={{ padding: 5 }}>
          <InAppHeader LftHdr="Add Lisence or Certification" />
        </View>

        {/* Checkboxes for Certification and License */}
        <View style={{ flexDirection: 'row', margin: 10 ,gap:10}}>
          <CheckBox
            value={isCertificationSelected}
            onValueChange={handleCertificationChange}
            boxType="square"
            lineWidth={2}
            tintColors={{ true: '#E72B4A', false: '#E72B4A' }}
          />
          <Text style={{ marginTop: 5,fontFamily:'Poppins-Medium',color:'#787579' }}>Certification</Text>

          <CheckBox
            value={isLicenseSelected}
            onValueChange={handleLicenseChange}
            boxType="square"
            lineWidth={2}
            tintColors={{ true: '#E72B4A', false: '#E72B4A' }}
          />
         <Text style={{ marginTop: 5,fontFamily:'Poppins-Medium',color:'#787579' }}>License</Text>
        </View>

        {/* Conditional Rendering for Certification or License Form */}
        {isCertificationSelected && (
          <>
            <Text style={styles.formHeader}>Certification Details</Text>
            {certification.map((item) => (
              <CustomInput
                key={item.id}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={formData[item.name] || ''}
                onChange={handleChange}
                options={item.options || []} // Pass options for select input if needed
              />
            ))}
          </>
        )}

        {isLicenseSelected && (
          <>
            <Text style={styles.formHeader}>License Details</Text>
            {lisence.map((item) => (
              <CustomInput
                key={item.id}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={formData[item.name] || ''}
                onChange={handleChange}
                options={item.options || []} // Pass options for select input if needed
              />
            ))}
          </>
        )}

        <View style={{ alignItems: 'center', margin: 20, marginTop: 20 }}>
          <CustomButton
            title="Save"
            bgColor={'#E72B4A'}
            fontfamily={'Poppins-Medium'}
            borderRadius={20}
            textColor={'white'}
            width={widthPercentageToDP(50)}
            onPress={addLicenseCertification}
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
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    paddingHorizontal:10
  },
});
