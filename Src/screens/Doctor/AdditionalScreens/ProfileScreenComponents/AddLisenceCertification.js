import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import InAppHeader from '../../../../components/customComponents/InAppHeadre/InAppHeader';
import HeaderDoctor from '../../../../components/customComponents/HeaderDoctor/HeaderDoctor';
import CustomButton from '../../../../components/customButton/CustomButton';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';

export default function AddLisenceCertification() {
  // Staff data for the inputs
  const certification = [
    { id: 1, name: 'Title', type: 'text', placeholder: 'Title' },
    { id: 2, name: 'Certificateno', type: 'text', placeholder: 'Certificate No' },
    { id: 3, name: 'Issuingauthority', type: 'text', placeholder: 'Issuing Authority' },
    { id: 4, name: 'IssuingDate', type: 'text', placeholder: 'Issuing Date' },
    { id: 5, name: 'Description', type: 'textarea', placeholder: 'Description' },
  ];
  
  const lisence = [
    { id: 1, name: 'Medicallicense', type: 'text', placeholder: 'Medical License' },
    { id: 2, name: 'Certificateno', type: 'text', placeholder: 'Certificate No' },
    { id: 3, name: 'Issuingauthority', type: 'text', placeholder: 'Issuing Authority' },
    { id: 4, name: 'IssuingDate', type: 'text', placeholder: 'Issuing Date' },
    { id: 5, name: 'Description', type: 'textarea', placeholder: 'Description' },
  ];

  // State to manage the form data, including imageUrl for ProfileImageUpload
  const [formData, setFormData] = useState({
    JobTitle: '',
    Organisation: '',
    Description: '',
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
