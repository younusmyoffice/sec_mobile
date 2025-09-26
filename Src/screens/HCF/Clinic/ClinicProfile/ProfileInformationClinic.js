import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomInput from '../../../../components/customInputs/CustomInputs';
import CustomButton from '../../../../components/customButton/CustomButton';
import axiosInstance from '../../../../utils/axiosInstance';
import {useCommon} from '../../../../../Store/CommonContext';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomToaster from '../../../../components/customToaster/CustomToaster';
export default function ProfileInformationClinic({
  firstFive,
  rest,
  formData,
  setFormData,
  local,
  setlocal,
  showdetails,
  inputRefs,
  isDisabled,
  setIsDisabled,
  handleEnable,
}) {
  const [markedDates, setMarkedDates] = useState({});
  const [localimage, setLocalImage] = useState('');

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  async function documentUpload() {
    try {
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });

      if (docs && docs.length > 0) {
        console.log(docs);
        console.log('Document URI:', docs[0]?.uri);
        setlocal(true);

        setLocalImage(docs[0]?.uri);
        console.log(docs[0]?.name);
        try {
          const base64 = await RNFS.readFile(docs[0]?.uri, 'base64');
          setFormData(prevDetails => ({
            ...prevDetails,
            profile_picture: base64,
          }));
          return base64;
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
  const handleDayPress = (day, name) => {
    setFormData({
      ...formData,
      DOB: day.dateString,
    }); // } else {;
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        color: '#E72B4A',
        textColor: 'white',
      },
    });
  };
  const calculateMarkedDates = (start, end) => {
    const marked = {};
    let date = new Date(start);
    while (date <= new Date(end)) {
      const dateStr = date.toISOString().split('T')[0];
      marked[dateStr] = {selected: true, color: '#E72B4A', textColor: 'white'};
      date.setDate(date.getDate() + 1);
    }
    return marked;
  };
  const handlePersonalUpdate = async () => {
    try {
      const response = await axiosInstance.post('updatePateintProfile', {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        added_by: formData.added_by,
        gender: formData.gender,
        DOB: formData.DOB,
        // added profile picture
        profile_picture: formData.profile_picture,
        fileExtension: formData.fileExtension,
      });
      showdetails();
      console.log('success', response.message);
      CustomToaster.show('success','Profile Updated','Profile information updated')
    } catch (e) {
      console.log(e);
    }
  };
  console.log('first', formData);
  return (
    <SafeAreaView>
      {/* <View>
        <Header />
      </View> */}
      <ScrollView contentContainerStyle={styles.container1}>
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            padding: 15,
          }}>
          <View style={{alignSelf: 'flex-end'}}>
            <TouchableWithoutFeedback onPress={handleEnable}>
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={'#E72B4A'}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container}>
            <Image
              source={{
                uri: local ? localimage : formData.profile_picture,
              }}
              style={{width: 100, height: 100, borderRadius: 75}}
              // style={styles.image}
            />
            <TouchableOpacity style={styles.overlay} onPress={documentUpload}>
              <Icon name="camera" size={30} color="#fff" />
            </TouchableOpacity>
            {/* <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
                color: '#AEAAAE',
              }}>
              Profile ID : <Text style={{color: '#E72B4A'}}>SRC0001</Text>
            </Text> */}
          </View>
        </View>

        {/* Mapping the first 5 fields */}
        <View>
          {firstFive.map((item, index) => (
            <CustomInput
              ref={el => (inputRefs.current[index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              startDate={formData.DOB}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={item.name === 'email' || isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          <View
            style={{
              marginVertical: 20,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <Text
              style={{
                color: '#331303',
                fontFamily: 'Poppins-Medium',
                fontSize: hp(2),
              }}>
              Contact Details
            </Text>
          </View>
          {rest.map(item => (
            <CustomInput
              ref={el => (inputRefs.current[index] = el)}
              key={item.id}
              name={item.name}
              type={item.type}
              placeholder={item.placeholder}
              value={formData[item.name] || ''}
              onChange={handleChange}
              options={item.options || []}
              format={item.format}
              startDate={formData.DOB}
              handleDayPress={handleDayPress}
              calculateMarkedDates={calculateMarkedDates}
              markedDates={markedDates}
              disabled={item.name === 'email' || isDisabled}
              fontFamily={'Poppins-Medium'}
              fontSize={hp(1.7)}
            />
          ))}
          {/* <InAppHeader LftHdr="Contact Details" />

{rest.map((item) => (
  <CustomInput
    key={item.id}
    name={item.name}
    type={item.type}
    placeholder={item.placeholder}
    value={formData[item.name] || ''}
    onChange={handleChange}
    options={item.options || []} 
  />
))} */}
          <View>
            <CustomButton
              title="Save Changes"
              bgColor="#E72B4A" // Green background
              textColor="#FFF" // White text
              borderColor="#E72B4A" // Darker green border
              borderWidth={1} // 2px border
              borderRadius={30}
              onPress={handlePersonalUpdate}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: 'white',
    // padding: 15,
  },
  container: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
  },
});
