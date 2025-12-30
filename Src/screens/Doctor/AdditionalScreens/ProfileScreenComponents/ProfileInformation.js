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
import {getProfileImageSource, handleImageError, handleImageLoad} from '../../../../utils/imageUtils';
export default function ProfileInformation({
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
  submitForm,
}) {

  const [markedDates, setMarkedDates] = useState({});


  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = newImage => {
    setFormData(prev => ({
      ...prev,
      profile_picture: newImage, // Update image URL in the state
    }));
  };

  async function documentUpload() {
    try {
      const docs = await DocumentPicker.pick({
        type: DocumentPicker.types.images,
        allowMultiSelection: false,
      });

      if (docs && docs.length > 0) {
        setFormData(prevDetails => ({
          ...prevDetails,
          profile_picture: docs[0].name.split('.')[0],
          fileExtension: docs[0].name.split('.').pop(),
        }));
        setlocal(true);
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
              source={getProfileImageSource(formData?.profile_picture)}
              onLoad={handleImageLoad}
              onError={(error) => handleImageError(error)}
              style={styles.image}
              defaultSource={require('../../../../assets/images/CardDoctor1.png')}
            />
            {/* <Image
              source={{uri: formData.profile_picture}}
              style={styles.image}
            /> */}
            <TouchableOpacity style={styles.overlay} onPress={documentUpload}>
              <Icon name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* <View style={{margin: 20}}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
                color: '#AEAAAE',
              }}>
              Profile ID : <Text style={{color: '#E72B4A'}}>SRC0001</Text>
            </Text>
          </View> */}
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
          <View style={{marginVertical: 20,justifyContent:'flex-start',alignItems:'flex-start'}}><Text style={{color:'#331303',fontFamily:'Poppins-Medium',fontSize:hp(2)}}>Contact Details</Text></View>
          {rest.map((item, index) =>  (
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
              onPress={submitForm}
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
