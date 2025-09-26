import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomInput from '../../../components/customInputs/CustomInputs';
import {patientDetails} from '../../../utils/data';
import CustomRadioButton from '../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../components/customButton/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import RNFS from 'react-native-fs';
import {validateField} from '../../../components/customInputs/FormValidation';

const PatientDetails = ({data, patientdetails, SetPatientDetails,isLoginValid, setIsLoginValid}) => {
  // const [patientdetails, SetPatientDetails] = useState({
  //   firstname: '',
  //   gender: '',
  //   age: '',
  //   reports: '',
  //   selection: '',
  //   parienttextarea: '',
  //   pdf: [],
  // });
  const [errors, setErrors] = useState({});
  console.log("errors",errors)
  const handleChange = useCallback(
    (name, value) => {
      SetPatientDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
      const error = validateField(name, value);
      setErrors(prev => ({...prev, [name]: error}));
      // setIsLoginValid(
      //   Object.values({...errors, [name]: error}).every(err => !err),
      // );
    },
    [errors],
  );
  console.log(data);
  async function documentUpload() {
    try {
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
        allowMultiSelection: false,
      });

      if (docs && docs.length > 0) {
        try {
          const base64 = await RNFS.readFile(docs[0]?.uri, 'base64');
          SetPatientDetails(prevDetails => ({
            ...prevDetails,
            fileName: docs[0].name,
            file: base64,
          }));
        } catch (error) {
          console.error('Error converting file to Base64:', error);
          return null;
        }
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error(error);
      }
    }
  }

  // const handleChange = (name, value) => {
  //   SetPatientDetails(prevData => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  // const handlesubmit = () => {
  // console.log(patientdetails);
  // };
  return (
    <ScrollView>
      <SafeAreaView>
        <View
          style={{
            // padding: 15,
            flexDirection: 'column',
            justifyContent: 'space-between',
            // gap: 25,
            marginTop: '5%',
          }}>
          <View
            style={{
              gap: 10,
              flexDirection: 'column',
              alignContent: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              Patient Details
            </Text>
            <View style={{flexDirection: 'row', gap: 20}}>
              {['myself', 'minor'].map(option => (
                <CustomRadioButton
                  key={option}
                  label={option === 'myself' ? 'Myself' : 'Minor'}
                  selected={patientdetails?.patient_type === option}
                  onPress={() => handleChange('patient_type', option)}
                />
              ))}
            </View>
          </View>
          <View style={{gap: 10}}>
            {data.length > 0 &&
              data?.map(field => (
                <>
                  {field.type === 'textarea' && (
                    <Text style={{}}>{field.label}</Text>
                  )}
                  <CustomInput
                    key={field.id}
                    type={field.type}
                    name={field.name}
                    options={field.options}
                    placeholder={field?.placeholder}
                    // fontSize={20}
                    value={patientdetails[field.name] || ''}
                    onChange={handleChange}
                    onpress={documentUpload}
                    fileName={
                      // patientdetails?.pdf?.length > 0
                      patientdetails?.fileName
                      // : ''
                    }
                  />
                  {errors[field.name] && (
                    <Text style={{color: 'red'}}>{errors[field.name]}</Text>
                  )}
                </>
              ))}
            {/* <View style={{alignSelf: 'center'}}>
              <CustomButton
                title="Continue"
                bgColor={'#E72B4A'}
                fontSize={20}
                borderRadius={30}
                textColor={'white'}
                fontWeight={'500'}
                width={300}
                padding={5}
                onPress={handlesubmit}
              />
            </View> */}
          </View>
          <View></View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default PatientDetails;
