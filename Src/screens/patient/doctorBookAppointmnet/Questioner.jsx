import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/customComponents/Header/Header';
import InAppCrossBackHeader from '../../../components/customComponents/InAppCrossBackHeader/InAppCrossBackHeader';
import CustomInput from '../../../components/customInputs/CustomInputs';
import {patientDetails} from '../../../utils/data';
import CustomRadioButton from '../../../components/customRadioGroup/CustomRadioGroup';
import CustomButton from '../../../components/customButton/CustomButton';
import DocumentPicker from 'react-native-document-picker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Questioner = ({data, patientdetails, SetPatientDetails, questions}) => {
  // const [patientdetails, SetPatientDetails] = useState({
  //   firstname: '',
  //   gender: '',
  //   age: '',
  //   reports: '',
  //   selection: '',
  //   parienttextarea: '',
  //   pdf: [],
  // });
  // const [imageUri, setImageUri] = useState(null);
  // async function documentUpload() {
  //   try {
  //     const docs = await DocumentPicker.pick({
  //       type: DocumentPicker.types.pdf,
  //       allowMultiSelection: false,
  //     });

  //     if (docs && docs.length > 0) {
  //       SetPatientDetails((prevDetails) => ({
  //         ...prevDetails,
  //         pdf: docs,
  //       }));
  //     }
  //     // if (res && res.length > 0) {
  //     //   setImageUri(res[0].uri); // Set URI of selected image
  //     // }
  //   } catch (error) {
  //     if (DocumentPicker.isCancel(error)) {
  //     } else {
  //       console.error(error);
  //     }
  //   }
  // }
  console.log('from questions', questions);
  // console.log(patientdetails);
  const handleChange = (name, value) => {
    SetPatientDetails(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchQuestions = async () => {};

  // const handlesubmit = () => {
  //   console.log(patientdetails);
  // };
  return (
    <ScrollView>
      <SafeAreaView>
        {/* <View>
            <Header />
          </View>
          <View>
            <InAppCrossBackHeader showClose={true} />
          </View> */}
        <View
          style={{
            // padding: 15,
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 25,
            marginTop: '5%',
          }}>
          <View
            style={{
              gap: 20,
              flexDirection: 'column',
              alignContent: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: hp(2),
                fontFamily: 'Poppins-Medium',
                color: 'black',
              }}>
              Questioner
            </Text>
            <View style={{flexDirection: 'row', gap: 20}}>
              <Text
                style={{
                  fontSize: hp(2),
                  fontFamily: 'Poppins-Medium',
                  color: 'black',
                }}>
                Please answer these questions
              </Text>
            </View>
          </View>
          <View style={{gap: 10}}>
            {/* {questions?.length > 0 &&
              questions?.map(field => (
                <>
                  <CustomInput
                    key={field.id}
                    type={field.type}
                    name={field.name}
                    options={field.options}
                    placeholder={field.placeholder}
                    // fontSize={20}
                    value={patientdetails[field.name] || ''}
                    onChange={handleChange}
                    // onpress={documentUpload}
                    // fileName={
                    //   patientdetails.pdf.length > 0
                    //     ? patientdetails.pdf[0].name
                    //     : ''
                    // }
                  />
                </>
              ))} */}

            {questions?.length > 0 &&
              questions?.map((field,index) => (
                <>
                  <CustomInput
                    type={'select'}
                    placeholder={field.question}
                    name={`answer_${index + 1}`}
                    options={[
                     {label: field.ans_1,value:field.ans_1},
                     {label: field.ans_2,value:field.ans_2},
                     {label: field.ans_3,value:field.ans_3},
                     {label: field.ans_4,value:field.ans_4}, 
                    ]}
                    value={patientdetails[`answer_${index + 1}`]||null}
                    onChange={handleChange}
                  />
                </>
              ))}
          </View>
          <View>{/* <Image source={{uri: patientdetails.pdf}} /> */}</View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Questioner;
